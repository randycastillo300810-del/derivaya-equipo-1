// ==========================================================================
// DerivaYa — Orquestador Principal (Líder de Proyecto)
// Integra la navegación entre las 4 pantallas y los módulos de la app:
// - Módulo 2: correccion.js (evaluación y verificación simbólico-numérica)
// - Módulo 3: grafica.js (visualizador interactivo con JSXGraph)
// ==========================================================================

import { ComputeEngine, compile } from "https://esm.run/@cortex-js/compute-engine";
import * as grafica from "./modulos/grafica.js";
import * as correccion from "./modulos/correccion.js";

// Función matemática base del ejercicio de demostración: f(x) = x³ - 3x
const fDemo = (x) => Math.pow(x, 3) - 3 * x;
const dfCorrectaDemo = (x) => 3 * Math.pow(x, 2) - 3;

// Estado compartido
export const app = {
  ce: null,
  board: null,
  ejercicio: {
    enunciado: "x^3 - 3x",
    solucion: "3x^2 - 3",
    fn: fDemo,
    dfn: dfCorrectaDemo,
  },
};

const NOMBRES_NIVELES = {
  1: "Nivel 1 · Polinomios",
  2: "Nivel 2 · Trigonométricas y Exponenciales",
  3: "Nivel 3 · Regla de la Cadena",
};

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
// 1. NAVEGACIÓN ENTRE PANTALLAS
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

  // Reajustar el tablero al volver a la pantalla del entrenador
  if (nombreVista === "entrenador") {
    requestAnimationFrame(() => redimensionarTablero());
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function seleccionarNivel(nivel) {
  const numNivel = Number(nivel);

  [1, 2, 3].forEach((n) => {
    const tab = document.getElementById(`btn-nivel-${n}`);
    if (tab) {
      tab.classList.toggle("active", n === numNivel);
    }
  });

  const nombre = NOMBRES_NIVELES[numNivel] || `Nivel ${numNivel}`;
  const subtituloNivel = document.getElementById("subtitulo-nivel");
  const etiquetaNivel = document.getElementById("etiqueta-nivel");

  if (subtituloNivel) subtituloNivel.textContent = nombre;
  if (etiquetaNivel) etiquetaNivel.textContent = nombre;

  mostrarPantalla("entrenador");
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
  if (btnVolver) btnVolver.addEventListener("click", () => mostrarPantalla("entrenador"));

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
// 2. CONEXIÓN DE MÓDULOS CON EL BOTÓN COMPROBAR Y MATHLIVE
// ==========================================================================
function convertirRespuestaAFuncion(texto) {
  if (!texto || !texto.trim()) return null;

  // 1. Si Compute Engine está disponible, compilar la expresión con CortexJS
  if (app.ce) {
    try {
      const limpia = texto.replace(/\bsen\b/g, "\\sin");
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
      console.debug("Compute engine parsing:", e);
    }
  }

  // 2. Parser numérico de respaldo para pruebas rápidas en JS
  try {
    let jsCode = texto
      .replace(/(\d+)\s*x/g, "$1*x")
      .replace(/x\^(\d+)/g, "Math.pow(x, $1)")
      .replace(/x\^\{([^}]+)\}/g, "Math.pow(x, $1)")
      .replace(/sen\(/g, "Math.sin(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/e\^x/g, "Math.exp(x)");

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

function comprobarRespuesta() {
  const inputEl = document.getElementById("respuesta");
  const valor = inputEl ? inputEl.value.trim() : "";
  const retroEl = document.getElementById("contenedor-retroalimentacion");

  if (!valor) return;

  // Asegurar que Compute Engine esté listo
  if (!app.ce) {
    try {
      app.ce = new ComputeEngine();
    } catch (e) {
      console.warn("Compute Engine aún no disponible:", e);
    }
  }

  // 1. Validar y corregir con el Módulo 2 (Vanessa)
  let resultado = { ok: false, valida: false, mensaje: "Error al evaluar la respuesta." };
  if (app.ce && typeof correccion.corregir === "function") {
    resultado = correccion.corregir(app.ce, valor, app.ejercicio.solucion);
  }

  // 2. Convertir la respuesta del estudiante en función matemática para graficarla
  const dfEstudiante = convertirRespuestaAFuncion(valor);

  // 3. Graficar con el Módulo 3 (Mariandry): f(x), la derivada teórica y la del estudiante
  grafica.mostrarGrafica(fDemo, dfCorrectaDemo, dfEstudiante);

  // 4. Mostrar retroalimentación contextualizada
  if (retroEl) {
    retroEl.removeAttribute("hidden");
    retroEl.style.display = "block";
    retroEl.style.padding = "14px 18px";
    retroEl.style.borderRadius = "10px";
    retroEl.style.marginTop = "14px";
    retroEl.style.fontSize = "14px";
    retroEl.style.fontWeight = "500";

    if (!resultado.valida) {
      // Caso A: Expresión inválida, vacía o con variables distintas a x (no descuenta intento)
      retroEl.style.backgroundColor = "rgba(245, 183, 73, 0.15)";
      retroEl.style.border = "1px solid #F5B749";
      retroEl.style.color = "#F5B749";
      retroEl.innerHTML = `⚠️ <strong>Entrada no válida:</strong> ${resultado.mensaje}`;
    } else if (resultado.ok) {
      // Caso B: Respuesta correcta
      retroEl.style.backgroundColor = "rgba(129, 182, 76, 0.2)";
      retroEl.style.border = "1px solid var(--chess-green)";
      retroEl.style.color = "#A3D179";
      retroEl.innerHTML = `🎉 <strong>${resultado.mensaje}</strong> Tu derivada coincide perfectamente con la curva teórica (verde).`;
    } else {
      // Caso C: Respuesta incorrecta (valida pero no coincide numéricamente)
      retroEl.style.backgroundColor = "rgba(235, 77, 75, 0.2)";
      retroEl.style.border = "1px solid #eb4d4b";
      retroEl.style.color = "#ff7979";
      retroEl.innerHTML = `❌ <strong>${resultado.mensaje}</strong> Revisa la curva rosa y compárala con la curva verde en el visualizador.`;
    }
  }
}

function configurarEventosEntrenador() {
  const inputEl = document.getElementById("respuesta");
  const btnComprobar = document.getElementById("comprobar");
  const btnLimpiar = document.getElementById("btn-limpiar");
  const vistaPrevia = document.getElementById("vista-previa-derivada");
  const teclado = document.getElementById("teclado-matematico");

  // Habilitar botón al escribir
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
      if (e.key === "Enter" && !btnComprobar.disabled) {
        e.preventDefault();
        comprobarRespuesta();
      }
    });
  }

  if (btnComprobar) {
    btnComprobar.addEventListener("click", comprobarRespuesta);
  }

  if (btnLimpiar && inputEl) {
    btnLimpiar.addEventListener("click", () => {
      inputEl.value = "";
      if (btnComprobar) btnComprobar.disabled = true;
      if (vistaPrevia) {
        vistaPrevia.textContent = "Escribe una expresión...";
        vistaPrevia.style.color = "var(--text-muted)";
      }
      // Volver a mostrar solo f(x) y la derivada real
      grafica.mostrarGrafica(fDemo, dfCorrectaDemo, null);
    });
  }

  // Atajos de teclado matemático
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
}

// ==========================================================================
// 3. INICIALIZACIÓN
// ==========================================================================
function iniciarApp() {
  // Inicializar Compute Engine para el Módulo 2 (Corrección)
  try {
    app.ce = new ComputeEngine();
    console.log("[DerivaYa] Compute Engine y Módulo 2 (Corrección) listos.");
  } catch (err) {
    console.debug("Compute engine sync init:", err);
  }

  configurarNavegacion();
  configurarEventosEntrenador();

  // Mostrar el entrenador de entrada
  mostrarPantalla("entrenador");

  // Inicializar el tablero JSXGraph usando la función de Mariandry (Módulo 3)
  app.board = grafica.inicializarTablero("box", [-6, 8, 6, -6]);

  // Graficar f(x) = x³ - 3x con su derivada real f'(x) = 3x² - 3 y la tangente
  grafica.mostrarGrafica(fDemo, dfCorrectaDemo, null);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarApp);
} else {
  iniciarApp();
}
