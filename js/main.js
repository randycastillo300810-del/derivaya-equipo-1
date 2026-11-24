// ==========================================================================
// DerivaYa — Orquestador Principal (Líder de Proyecto)
// Integra los 4 módulos del equipo:
// - Módulo 1: banco.js (15 ejercicios por nivel)
// - Módulo 2: correccion.js (evaluación simbólico-numérica con CortexJS)
// - Módulo 3: grafica.js (visualizador interactivo JSXGraph con tangente)
// - Módulo 4: progreso.js (puntuación, penalización, persistencia y resumen)
// ==========================================================================

import { ComputeEngine, compile } from "https://esm.run/@cortex-js/compute-engine";
import * as banco from "./modulos/banco.js";
import * as correccion from "./modulos/correccion.js";
import * as grafica from "./modulos/grafica.js";
import * as progreso from "./modulos/progreso.js";

// ==========================================================================
// 1. ESTADO GLOBAL COMPARTIDO
// ==========================================================================
export const app = {
  ce: null,
  board: null,
  nivelActual: 1, // 1: Polinomios, 2: Trig/Exp, 3: Cadena
  preguntas: [],  // Ejercicios activos del nivel seleccionado
  indice: 0,      // Índice del ejercicio actual (0..4)
  intentosRestantes: 2,
  pistasUsadasEnPregunta: 0,
  ejercicioActual: null,
  fnActual: null,
  dfnActual: null,
  puntaje: 0,
  aciertos: 0,
};

const NOMBRES_NIVELES = {
  1: { etiqueta: "Básico", titulo: "Nivel 1 · Polinomios" },
  2: { etiqueta: "Intermedio", titulo: "Nivel 2 · Trigonométricas y Exponenciales" },
  3: { etiqueta: "Avanzado", titulo: "Nivel 3 · Regla de la Cadena" },
};

// ==========================================================================
// 2. CONVERSIÓN DE LATEX A FUNCIONES EVALUABLES PARA JSXGRAPH
// ==========================================================================
function limpiarLatex(texto) {
  if (!texto) return "";
  return String(texto)
    .replace(/^f\(x\)\s*=\s*/i, "")
    .replace(/^y\s*=\s*/i, "")
    .replace(/\bsen\b/g, "\\sin")
    .trim();
}

function convertirAFuncion(textoLatex) {
  const limpia = limpiarLatex(textoLatex);
  if (!limpia) return null;

  // 1. Intento principal: CortexJS Compute Engine
  if (app.ce) {
    try {
      const expr = app.ce.parse(limpia);
      if (expr && expr.isValid) {
        const fnComp = compile(expr);
        return (x) => {
          try {
            const res = fnComp.run({ x });
            return typeof res === "number" && Number.isFinite(res) ? res : NaN;
          } catch {
            return NaN;
          }
        };
      }
    } catch (e) {
      console.debug("[DerivaYa] CortexJS compile fallback:", e);
    }
  }

  // 2. Parser numérico de respaldo
  try {
    const jsCode = limpia
      .replace(/\\cdot/g, "*")
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "(($1)/($2))")
      .replace(/(\d+)\s*x/g, "$1*x")
      .replace(/x\^\{([^}]+)\}/g, "Math.pow(x, $1)")
      .replace(/x\^(\d+)/g, "Math.pow(x, $1)")
      .replace(/\\sin/g, "Math.sin")
      .replace(/\\cos/g, "Math.cos")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/e\^\{([^}]+)\}/g, "Math.exp($1)")
      .replace(/e\^x/g, "Math.exp(x)")
      .replace(/\\ln/g, "Math.log");

    const fnEvaluadora = new Function("x", `try { return ${jsCode}; } catch { return NaN; }`);
    const prueba = fnEvaluadora(1);
    if (typeof prueba === "number" && Number.isFinite(prueba)) {
      return fnEvaluadora;
    }
  } catch {
    // Si no es parseable, devolver null
  }

  return null;
}

function redimensionarTablero() {
  if (!app.board) return;
  const box = document.getElementById("box");
  if (!box || box.clientWidth === 0 || box.clientHeight === 0) return;
  try {
    app.board.resizeContainer(box.clientWidth, box.clientHeight);
    app.board.fullUpdate();
  } catch (error) {
    console.debug("No se pudo redimensionar el tablero:", error);
  }
}

// ==========================================================================
// 3. NAVEGACIÓN ENTRE PANTALLAS
// ==========================================================================
export function mostrarPantalla(nombreVista) {
  const pantallas = {
    niveles: document.getElementById("pantalla-inicio"),
    entrenador: document.getElementById("pantalla-ejercicio"),
    formulas: document.getElementById("pantalla-formulas"),
    progreso: document.getElementById("pantalla-resultados"),
  };

  const navBotones = {
    niveles: document.getElementById("nav-niveles"),
    entrenador: document.getElementById("nav-entrenador"),
    formulas: document.getElementById("nav-formulas"),
    progreso: document.getElementById("nav-progreso"),
  };

  Object.values(pantallas).forEach((pantalla) => {
    if (pantalla) {
      pantalla.classList.add("hidden");
      pantalla.setAttribute("hidden", "true");
    }
  });

  const activa = pantallas[nombreVista];
  if (activa) {
    activa.classList.remove("hidden");
    activa.removeAttribute("hidden");
  }

  Object.entries(navBotones).forEach(([vista, boton]) => {
    if (!boton) return;
    if (vista === nombreVista) {
      boton.classList.add("active");
      boton.setAttribute("aria-current", "page");
    } else {
      boton.classList.remove("active");
      boton.removeAttribute("aria-current");
    }
  });

  if (nombreVista === "entrenador") {
    requestAnimationFrame(() => redimensionarTablero());
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================================================
// 4. CONTROL DE EJERCICIOS Y FLUJO DEL ENTRENADOR
// ==========================================================================
export function seleccionarNivel(numNivel) {
  const nivel = Number(numNivel);
  app.nivelActual = nivel;

  // Filtrar los 5 ejercicios correspondientes desde el Módulo 1 (banco.js)
  const todosLosEjercicios = banco.obtenerBancoEjercicios();
  const infoNivel = NOMBRES_NIVELES[nivel] || NOMBRES_NIVELES[1];
  app.preguntas = todosLosEjercicios.filter((ej) => ej.nivel === infoNivel.etiqueta);

  // Si por alguna razón la etiqueta no coincide, tomar bloques de 5
  if (!app.preguntas.length) {
    const inicio = (nivel - 1) * 5;
    app.preguntas = todosLosEjercicios.slice(inicio, inicio + 5);
  }

  // Reiniciar progreso para este nivel usando el Módulo 4 (progreso.js)
  progreso.iniciar(app);
  actualizarMarcadoresTopbar();

  // Actualizar pestañas activas en la interfaz
  [1, 2, 3].forEach((n) => {
    const tab = document.getElementById(`btn-nivel-${n}`);
    if (tab) tab.classList.toggle("active", n === nivel);
  });

  const subtituloNivel = document.getElementById("subtitulo-nivel");
  if (subtituloNivel) subtituloNivel.textContent = infoNivel.titulo;

  // Cargar el primer ejercicio
  app.indice = 0;
  cargarEjercicio(0);
  mostrarPantalla("entrenador");
}

function cargarEjercicio(indice) {
  if (!app.preguntas || !app.preguntas[indice]) {
    mostrarPantallaResultados();
    return;
  }

  app.indice = indice;
  app.intentosRestantes = 2;
  app.pistasUsadasEnPregunta = 0;
  app.ejercicioActual = app.preguntas[indice];

  // Elementos de la interfaz
  const etiquetaNivel = document.getElementById("etiqueta-nivel");
  const contadorFuncion = document.getElementById("contador-funcion");
  const barraRelleno = document.getElementById("barra-progreso-relleno");
  const enunciadoFuncion = document.getElementById("enunciado-funcion");
  const indicadorIntentos = document.getElementById("indicador-intentos");
  const inputRespuesta = document.getElementById("respuesta");
  const vistaPrevia = document.getElementById("vista-previa-derivada");
  const retroEl = document.getElementById("contenedor-retroalimentacion");
  const btnComprobar = document.getElementById("comprobar");
  const btnPista = document.getElementById("btn-pista");
  const btnSiguiente = document.getElementById("btn-siguiente");

  // Actualizar textos informativos
  const infoNivel = NOMBRES_NIVELES[app.nivelActual] || NOMBRES_NIVELES[1];
  if (etiquetaNivel) etiquetaNivel.textContent = `${infoNivel.titulo.split("·")[0].trim()}: ${infoNivel.etiqueta}`;
  if (contadorFuncion) contadorFuncion.textContent = `Función #${indice + 1}/${app.preguntas.length}`;
  if (barraRelleno) {
    const porcentaje = ((indice) / app.preguntas.length) * 100;
    barraRelleno.style.width = `${porcentaje}%`;
  }

  // Mostrar la función a derivar
  if (enunciadoFuncion) {
    enunciadoFuncion.textContent = limpiarLatex(app.ejercicioActual.funcion);
  }

  // Estado inicial de entrada e intentos
  if (indicadorIntentos) {
    indicadorIntentos.textContent = `Intentos: 2/2`;
    indicadorIntentos.style.color = "var(--amber)";
  }

  if (inputRespuesta) {
    inputRespuesta.value = "";
    inputRespuesta.disabled = false;
  }

  if (vistaPrevia) {
    vistaPrevia.textContent = "Escribe una expresión...";
    vistaPrevia.style.color = "var(--text-muted)";
  }

  if (retroEl) {
    retroEl.setAttribute("hidden", "true");
    retroEl.style.display = "none";
    retroEl.textContent = "";
  }

  if (btnComprobar) {
    btnComprobar.disabled = true;
    btnComprobar.textContent = "✓ Comprobar";
  }

  if (btnPista) {
    btnPista.disabled = false;
    btnPista.textContent = "💡 Pista (-2)";
  }

  if (btnSiguiente) {
    btnSiguiente.disabled = true;
    btnSiguiente.textContent = indice === app.preguntas.length - 1 ? "Ver Resultados 🏆" : "Siguiente →";
  }

  // Convertir función original y derivada teórica para el Módulo 3 (grafica.js)
  app.fnActual = convertirAFuncion(app.ejercicioActual.funcion);
  app.dfnActual = convertirAFuncion(app.ejercicioActual.respuestaCorrecta);

  // Renderizar f(x) con su tangente interactiva (la derivada se muestra al comprobar)
  if (app.fnActual) {
    grafica.mostrarGrafica(app.fnActual, null, null);
  }
}

// ==========================================================================
// 5. EVALUACIÓN Y CORRECCIÓN (MÓDULOS 2, 3 Y 4)
// ==========================================================================
function comprobarRespuesta() {
  const inputEl = document.getElementById("respuesta");
  const valor = inputEl ? inputEl.value.trim() : "";
  const retroEl = document.getElementById("contenedor-retroalimentacion");
  const btnComprobar = document.getElementById("comprobar");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const indicadorIntentos = document.getElementById("indicador-intentos");

  if (!valor || !app.ejercicioActual) return;

  // 1. Evaluar mediante el Módulo 2 (correccion.js de Vanessa)
  const resultado = correccion.corregir(app.ce, valor, app.ejercicioActual.respuestaCorrecta);

  // 2. Si la expresión no es matemáticamente válida (sintaxis rota o variables ajenas a x),
  // la pauta exige NO descontar intentos
  if (!resultado.valida) {
    if (retroEl) {
      retroEl.removeAttribute("hidden");
      retroEl.style.display = "block";
      retroEl.style.padding = "14px 18px";
      retroEl.style.borderRadius = "10px";
      retroEl.style.marginTop = "14px";
      retroEl.style.backgroundColor = "rgba(245, 183, 73, 0.15)";
      retroEl.style.border = "1px solid #F5B749";
      retroEl.style.color = "#F5B749";
      retroEl.innerHTML = `⚠️ <strong>Formato inválido:</strong> ${resultado.mensaje}`;
    }
    return;
  }

  // Convertir respuesta del estudiante a función para graficar
  const dfEstudiante = convertirAFuncion(valor);

  // Graficar la curva propuesta en contraste con la real en el Módulo 3
  if (app.fnActual) {
    grafica.mostrarGrafica(app.fnActual, app.dfnActual, dfEstudiante);
  }

  // 3. Caso de ACIERTO
  if (resultado.ok) {
    const intentosUsados = 3 - app.intentosRestantes; // 1 si estaba en 2/2, 2 si estaba en 1/2

    // Registrar en Módulo 4 (progreso.js)
    progreso.registrar(app, { ok: true, valida: true, intentos: intentosUsados }, app.ejercicioActual);
    actualizarMarcadoresTopbar();

    if (retroEl) {
      retroEl.removeAttribute("hidden");
      retroEl.style.display = "block";
      retroEl.style.padding = "14px 18px";
      retroEl.style.borderRadius = "10px";
      retroEl.style.marginTop = "14px";
      retroEl.style.backgroundColor = "rgba(129, 182, 76, 0.2)";
      retroEl.style.border = "1px solid var(--chess-green)";
      retroEl.style.color = "#A3D179";
      retroEl.innerHTML = `🎉 <strong>¡Correcto!</strong> Tu derivada coincide perfectamente con la curva teórica (verde).`;
    }

    // Bloquear entrada y habilitar avanzar
    if (inputEl) inputEl.disabled = true;
    if (btnComprobar) btnComprobar.disabled = true;
    if (btnSiguiente) btnSiguiente.disabled = false;
    return;
  }

  // 4. Caso de FALLO (Respuesta válida pero incorrecta)
  app.intentosRestantes--;

  if (indicadorIntentos) {
    indicadorIntentos.textContent = `Intentos: ${app.intentosRestantes}/2`;
    indicadorIntentos.style.color = app.intentosRestantes === 1 ? "#F5B749" : "#ff7979";
  }

  if (app.intentosRestantes > 0) {
    // Le queda 1 intento
    if (retroEl) {
      retroEl.removeAttribute("hidden");
      retroEl.style.display = "block";
      retroEl.style.padding = "14px 18px";
      retroEl.style.borderRadius = "10px";
      retroEl.style.marginTop = "14px";
      retroEl.style.backgroundColor = "rgba(235, 77, 75, 0.15)";
      retroEl.style.border = "1px solid #eb4d4b";
      retroEl.style.color = "#ff7979";
      retroEl.innerHTML = `❌ <strong>No es correcta.</strong> Te queda 1 intento. Compara la curva rosa (tu propuesta) con la verde en el gráfico.`;
    }
  } else {
    // Se agotaron los 2 intentos
    progreso.registrar(app, { ok: false, valida: true, intentos: 2 }, app.ejercicioActual);
    actualizarMarcadoresTopbar();

    if (retroEl) {
      retroEl.removeAttribute("hidden");
      retroEl.style.display = "block";
      retroEl.style.padding = "14px 18px";
      retroEl.style.borderRadius = "10px";
      retroEl.style.marginTop = "14px";
      retroEl.style.backgroundColor = "rgba(235, 77, 75, 0.2)";
      retroEl.style.border = "1px solid #eb4d4b";
      retroEl.style.color = "#ff7979";
      retroEl.innerHTML = `❌ <strong>Intentos agotados.</strong> La solución correcta era: <code>${app.ejercicioActual.respuestaCorrecta}</code>.`;
    }

    if (inputEl) inputEl.disabled = true;
    if (btnComprobar) btnComprobar.disabled = true;
    if (btnSiguiente) btnSiguiente.disabled = false;
  }
}

// ==========================================================================
// 6. GESTIÓN DE PISTAS (MÓDULO 4)
// ==========================================================================
function solicitarPista() {
  if (!app.ejercicioActual) return;
  const retroEl = document.getElementById("contenedor-retroalimentacion");
  const btnPista = document.getElementById("btn-pista");

  // Registrar pista en progreso.js (-2 puntos de penalización)
  progreso.registrarPista(app);
  app.pistasUsadasEnPregunta++;

  if (retroEl) {
    retroEl.removeAttribute("hidden");
    retroEl.style.display = "block";
    retroEl.style.padding = "14px 18px";
    retroEl.style.borderRadius = "10px";
    retroEl.style.marginTop = "14px";
    retroEl.style.backgroundColor = "rgba(68, 55, 34, 0.4)";
    retroEl.style.border = "1px solid #F5B749";
    retroEl.style.color = "#F5B749";
    retroEl.innerHTML = `💡 <strong>Pista pedagógica:</strong> ${app.ejercicioActual.pista} <br><small style="color:var(--text-muted)">(Esta pista descontará 2 pts si aciertas este ejercicio)</small>`;
  }

  if (btnPista) {
    btnPista.disabled = true;
    btnPista.textContent = "💡 Pista usada";
  }
}

function avanzarSiguiente() {
  if (app.indice < app.preguntas.length - 1) {
    cargarEjercicio(app.indice + 1);
  } else {
    mostrarPantallaResultados();
  }
}

// ==========================================================================
// 7. PANTALLA DE RESULTADOS (MÓDULO 4)
// ==========================================================================
function mostrarPantallaResultados() {
  const resumen = progreso.obtenerResumen(app);

  const puntajeFinal = document.getElementById("valor-puntaje-final");
  const recordFinal = document.getElementById("valor-record-final");
  const listaHistorial = document.getElementById("lista-historial");

  if (puntajeFinal) puntajeFinal.textContent = resumen.puntaje;
  if (recordFinal) recordFinal.textContent = resumen.record;

  if (listaHistorial) {
    listaHistorial.innerHTML = "";

    if (!resumen.historial || !resumen.historial.length) {
      listaHistorial.innerHTML = "<p>No hay ejercicios evaluados en esta ronda.</p>";
    } else {
      resumen.historial.forEach((item, idx) => {
        const itemDiv = document.createElement("div");
        itemDiv.style.backgroundColor = "var(--bg-box)";
        itemDiv.style.border = "1px solid var(--border-subtle)";
        itemDiv.style.borderRadius = "10px";
        itemDiv.style.padding = "12px 16px";
        itemDiv.style.marginBottom = "10px";
        itemDiv.style.display = "flex";
        itemDiv.style.justifyContent = "space-between";
        itemDiv.style.alignItems = "center";
        itemDiv.style.flexWrap = "wrap";
        itemDiv.style.gap = "8px";

        const estadoIcono = item.ok ? "✅" : "❌";
        const estadoTexto = item.ok ? "Correcta" : "Agotada";
        const estadoColor = item.ok ? "#A3D179" : "#ff7979";

        itemDiv.innerHTML = `
          <div>
            <strong>#${idx + 1} · ${item.pregunta?.enunciado || item.pregunta?.funcion}</strong>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">
              Solución: <code>${item.pregunta?.respuestaCorrecta}</code> | Intentos: ${item.intentos} | Pistas: ${item.pistas}
            </div>
          </div>
          <div style="text-align:right;">
            <span style="color:${estadoColor}; font-weight:700;">${estadoIcono} ${estadoTexto}</span>
            <div style="font-size:13px; font-weight:700; color:var(--amber);">+${item.puntos} pts</div>
          </div>
        `;
        listaHistorial.appendChild(itemDiv);
      });
    }
  }

  // Actualizar también la pastilla de la barra superior
  actualizarMarcadoresTopbar();
  mostrarPantalla("progreso");
}

function actualizarMarcadoresTopbar() {
  const valorPuntaje = document.getElementById("valor-puntaje");
  const valorRecord = document.getElementById("valor-record");

  if (valorPuntaje) valorPuntaje.textContent = app.puntaje;
  if (valorRecord) valorRecord.textContent = progreso.obtenerRecord();
}

// ==========================================================================
// 8. CONFIGURACIÓN DE EVENTOS
// ==========================================================================
function configurarEventosEntrenador() {
  const inputEl = document.getElementById("respuesta");
  const btnComprobar = document.getElementById("comprobar");
  const btnLimpiar = document.getElementById("btn-limpiar");
  const btnPista = document.getElementById("btn-pista");
  const btnSiguiente = document.getElementById("btn-siguiente");
  const vistaPrevia = document.getElementById("vista-previa-derivada");
  const teclado = document.getElementById("teclado-matematico");
  const btnReiniciarRecord = document.getElementById("btn-reiniciar-record");

  if (inputEl) {
    inputEl.addEventListener("input", () => {
      const tieneTexto = (inputEl.value || "").trim().length > 0;
      if (btnComprobar) btnComprobar.disabled = !tieneTexto;
      if (vistaPrevia) {
        vistaPrevia.textContent = tieneTexto ? inputEl.value : "Escribe una expresión...";
        vistaPrevia.style.color = tieneTexto ? "var(--text-main)" : "var(--text-muted)";
      }
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !btnComprobar?.disabled) {
        e.preventDefault();
        comprobarRespuesta();
      }
    });
  }

  if (btnComprobar) btnComprobar.addEventListener("click", comprobarRespuesta);
  if (btnPista) btnPista.addEventListener("click", solicitarPista);
  if (btnSiguiente) btnSiguiente.addEventListener("click", avanzarSiguiente);

  if (btnLimpiar && inputEl) {
    btnLimpiar.addEventListener("click", () => {
      inputEl.value = "";
      if (btnComprobar) btnComprobar.disabled = true;
      if (vistaPrevia) {
        vistaPrevia.textContent = "Escribe una expresión...";
        vistaPrevia.style.color = "var(--text-muted)";
      }
      if (app.fnActual) {
        grafica.mostrarGrafica(app.fnActual, null, null);
      }
    });
  }

  // Botones del teclado matemático virtual
  if (teclado && inputEl) {
    teclado.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-token]");
      if (!btn) return;
      const token = btn.getAttribute("data-token");
      if (typeof inputEl.executeCommand === "function") {
        inputEl.executeCommand(["insert", token]);
      } else {
        inputEl.value = (inputEl.value || "") + token;
      }
      inputEl.dispatchEvent(new Event("input"));
    });
  }

  // Botón para reiniciar récord desde la pantalla de resultados
  if (btnReiniciarRecord) {
    btnReiniciarRecord.addEventListener("click", () => {
      try {
        localStorage.removeItem("alcaravan_record");
        actualizarMarcadoresTopbar();
        const recordFinal = document.getElementById("valor-record-final");
        if (recordFinal) recordFinal.textContent = "0";
      } catch (e) {
        console.warn("No se pudo reiniciar el récord:", e);
      }
    });
  }
}

function configurarNavegacion() {
  const vinculosNav = [
    { id: "nav-entrenador", vista: "entrenador" },
    { id: "nav-niveles", vista: "niveles" },
    { id: "nav-formulas", vista: "formulas" },
    { id: "nav-progreso", vista: "progreso" },
  ];

  vinculosNav.forEach(({ id, vista }) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => mostrarPantalla(vista));
  });

  [1, 2, 3].forEach((nivel) => {
    const tab = document.getElementById(`btn-nivel-${nivel}`);
    if (tab) tab.addEventListener("click", () => seleccionarNivel(nivel));

    const btnInicio = document.getElementById(`btn-iniciar-nivel-${nivel}`);
    if (btnInicio) btnInicio.addEventListener("click", () => seleccionarNivel(nivel));
  });

  const btnVolver = document.getElementById("btn-volver-jugar");
  if (btnVolver) btnVolver.addEventListener("click", () => seleccionarNivel(app.nivelActual));

  const btnCambiarNivel = document.getElementById("btn-cambiar-nivel");
  if (btnCambiarNivel) btnCambiarNivel.addEventListener("click", () => mostrarPantalla("niveles"));

  const logoMarca = document.getElementById("marca");
  if (logoMarca) {
    logoMarca.style.cursor = "pointer";
    logoMarca.addEventListener("click", () => mostrarPantalla("niveles"));
  }

  window.addEventListener("resize", () => redimensionarTablero());
}

// ==========================================================================
// 9. ARRANQUE DE LA APLICACIÓN
// ==========================================================================
function iniciarApp() {
  // 1. Configurar navegación y eventos de inmediato
  try {
    configurarNavegacion();
    configurarEventosEntrenador();
  } catch (e) {
    console.error("[DerivaYa] Error al configurar navegación:", e);
  }

  // 2. Inicializar motor matemático Compute Engine
  try {
    app.ce = new ComputeEngine();
    console.log("[DerivaYa] Compute Engine listo.");
  } catch (err) {
    console.debug("[DerivaYa] ComputeEngine init fallback:", err);
  }

  // 3. Inicializar tablero JSXGraph con el Módulo 3
  try {
    app.board = grafica.inicializarTablero("box", [-6, 8, 6, -6]);
  } catch (err) {
    console.warn("[DerivaYa] Tablero JSXGraph:", err);
  }

  // 4. Iniciar con el Nivel 1 cargando los ejercicios del Módulo 1
  try {
    seleccionarNivel(1);
  } catch (err) {
    console.warn("[DerivaYa] Carga Nivel 1:", err);
  }

  // 5. Cargar récord histórico en topbar
  try {
    actualizarMarcadoresTopbar();
  } catch (err) {
    console.warn("[DerivaYa] Marcadores topbar:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarApp);
} else {
  iniciarApp();
}
