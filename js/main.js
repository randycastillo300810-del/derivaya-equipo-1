// ==========================================================================
// DerivaYa — Orquestador Principal (Líder de Proyecto)
// Integra la navegación entre las 4 pantallas y el Módulo 3 (grafica.js).
// Demuestra la funcionalidad del visualizador interactivo con JSXGraph.
// ==========================================================================

import * as grafica from "./modulos/grafica.js";

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
    requestAnimationFrame(() => grafica.redimensionarTablero());
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

  window.addEventListener("resize", () => grafica.redimensionarTablero());
}

// ==========================================================================
// 2. CONEXIÓN DEL MÓDULO 3 CON EL BOTÓN COMPROBAR Y MATHLIVE
// ==========================================================================
function convertirRespuestaAFuncion(texto) {
  if (!texto || !texto.trim()) return null;

  // 1. Si Compute Engine está disponible, usarlo
  if (app.ce) {
    try {
      const limpia = texto.replace(/\bsen\b/g, "\\sin");
      const expr = app.ce.parse(limpia);
      if (expr && expr.isValid) {
        if (typeof expr.compile === "function") {
          const fnComp = expr.compile();
          return (x) => {
            try {
              const res = typeof fnComp === "function" ? fnComp({ x }) : fnComp.run({ x });
              return typeof res === "number" && Number.isFinite(res) ? res : NaN;
            } catch {
              return NaN;
            }
          };
        }
        return (x) => {
          try {
            const v = expr.subs({ x }).N().valueOf();
            return typeof v === "number" && Number.isFinite(v) ? v : NaN;
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

  // Convertir la respuesta del estudiante en función matemática para graficarla
  const dfEstudiante = convertirRespuestaAFuncion(valor);

  // Llamar al Módulo 3 para graficar f(x), la derivada correcta y la propuesta
  grafica.mostrarGrafica(fDemo, dfCorrectaDemo, dfEstudiante);

  if (retroEl) {
    retroEl.removeAttribute("hidden");
    retroEl.style.display = "block";
    retroEl.style.padding = "12px 16px";
    retroEl.style.borderRadius = "10px";
    retroEl.style.marginTop = "14px";
    retroEl.style.fontSize = "13px";

    if (dfEstudiante) {
      retroEl.style.backgroundColor = "rgba(129, 182, 76, 0.15)";
      retroEl.style.border = "1px solid var(--chess-green)";
      retroEl.style.color = "#A3D179";
      retroEl.textContent = `📈 ¡Derivada graficada en el visualizador! Compara la curva rosa (tu respuesta) con la verde (derivada real).`;
    } else {
      retroEl.style.backgroundColor = "rgba(245, 183, 73, 0.15)";
      retroEl.style.border = "1px solid #F5B749";
      retroEl.style.color = "#F5B749";
      retroEl.textContent = `⚠️ Expresión registrada. Arrastra el punto naranja P sobre la curva azul para observar la pendiente.`;
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
  configurarNavegacion();
  configurarEventosEntrenador();

  // Mostrar el entrenador de entrada
  mostrarPantalla("entrenador");

  // Inicializar el tablero JSXGraph usando la función de tu compañera
  app.board = grafica.inicializarTablero("box", [-6, 8, 6, -6]);

  // Graficar f(x) = x³ - 3x con su derivada real f'(x) = 3x² - 3 y la tangente
  grafica.mostrarGrafica(fDemo, dfCorrectaDemo, null);

  // Cargar Compute Engine en segundo plano
  import("https://esm.run/@cortex-js/compute-engine")
    .then(({ ComputeEngine }) => {
      app.ce = new ComputeEngine();
      console.log("[DerivaYa] Compute Engine listo.");
    })
    .catch((err) => {
      console.debug("Compute engine CDN:", err);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarApp);
} else {
  iniciarApp();
}
