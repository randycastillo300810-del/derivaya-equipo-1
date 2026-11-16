// Módulo 3: Gráfica - Desarrollador 3
// js/modulos/grafica.js

let board = null;
let elementosGraficos = [];

/**
 * Normaliza una expresión LaTeX para que Compute Engine interprete sin/sen en español.
 * @param {string} latex
 * @returns {string}
 */
function normalizarLatex(latex) {
  return String(latex || "")
    .trim()
    .replace(/\bsen\b/g, "\\sin");
}

/**
 * Convierte una función JS o una expresión en LaTeX en una función evaluable f(x).
 * @param {object|null} ce - Instancia de ComputeEngine
 * @param {Function|string|null} fuente - Función JS o expresión LaTeX
 * @returns {Function|null}
 */
function convertirAFuncion(ce, fuente) {
  if (!fuente) return null;
  if (typeof fuente === "function") return fuente;
  if (typeof fuente !== "string" || !fuente.trim() || !ce) return null;

  try {
    const expr = ce.parse(normalizarLatex(fuente));
    if (!expr || !expr.isValid) return null;

    if (typeof expr.compile === "function") {
      const compilada = expr.compile();
      if (typeof compilada === "function") {
        return (x) => {
          try {
            const valor = compilada({ x });
            return typeof valor === "number" && Number.isFinite(valor) ? valor : NaN;
          } catch {
            return NaN;
          }
        };
      }
      if (compilada && typeof compilada.run === "function") {
        return (x) => {
          try {
            const valor = compilada.run({ x });
            return typeof valor === "number" && Number.isFinite(valor) ? valor : NaN;
          } catch {
            return NaN;
          }
        };
      }
    }

    return (x) => {
      try {
        const valor = expr.subs({ x }).N().valueOf();
        return typeof valor === "number" && Number.isFinite(valor) ? valor : NaN;
      } catch {
        return NaN;
      }
    };
  } catch (error) {
    console.warn("No se pudo compilar la expresión para graficar:", fuente, error);
    return null;
  }
}

/**
 * Actualiza el indicador en pantalla con la posición x del glider y su pendiente tangente.
 * @param {number} x
 * @param {Function} f
 * @param {Function|null} dfCorrecta
 */
function actualizarLecturaGlider(x, f, dfCorrecta) {
  const lecturaEl = document.getElementById("coordenadas-glider");
  if (!lecturaEl || !Number.isFinite(x)) return;

  let pendiente = NaN;
  if (typeof dfCorrecta === "function") {
    try {
      pendiente = dfCorrecta(x);
    } catch {
      pendiente = NaN;
    }
  }

  // Si aún no se pasa dfCorrecta, estimar pendiente numéricamente para la pista visual
  if (!Number.isFinite(pendiente) && typeof f === "function") {
    const h = 1e-4;
    const fPlus = f(x + h);
    const fMinus = f(x - h);
    if (Number.isFinite(fPlus) && Number.isFinite(fMinus)) {
      pendiente = (fPlus - fMinus) / (2 * h);
    }
  }

  const xTexto = x.toFixed(2);
  const mTexto = Number.isFinite(pendiente) ? pendiente.toFixed(2) : "—";
  lecturaEl.textContent = `x = ${xTexto} | m = f'(x) = ${mTexto}`;
}

/**
 * Inicializa el tablero de JSXGraph dentro de un contenedor HTML.
 * @param {string} containerId - ID del div contenedor (ej: 'box' o 'jxgbox')
 * @param {Array<number>} boundingBox - Límites [xmin, ymax, xmax, ymin]
 */
export function inicializarTablero(containerId = "box", boundingBox = [-5, 5, 5, -5]) {
  if (typeof window.JXG === "undefined") {
    console.warn("JSXGraph aún no está cargado en window.JXG.");
    return null;
  }

  const targetId = document.getElementById(containerId)
    ? containerId
    : document.getElementById("box")
      ? "box"
      : containerId;

  // Limpia el tablero si ya existía previo a un re-render
  if (board) {
    window.JXG.JSXGraph.freeBoard(board);
    elementosGraficos = [];
  }

  board = window.JXG.JSXGraph.initBoard(targetId, {
    boundingbox: boundingBox,
    axis: true,
    showCopyright: false,
    showNavigation: true,
    keepaspectratio: false,
    defaultAxes: {
      x: {
        strokeColor: "#6E6B66",
        ticks: {
          strokeColor: "#4A4844",
          label: { strokeColor: "#9E9C98" },
        },
      },
      y: {
        strokeColor: "#6E6B66",
        ticks: {
          strokeColor: "#4A4844",
          label: { strokeColor: "#9E9C98" },
        },
      },
    },
  });

  return board;
}

/**
 * Limpia los trazados y elementos dinámicos manteniendo el tablero activo.
 */
function limpiarElementos() {
  if (!board) return;
  elementosGraficos.forEach((el) => {
    try {
      board.removeObject(el);
    } catch {
      // Ignorar si ya fue removido por dependencias
    }
  });
  elementosGraficos = [];
}

/**
 * Reajusta el tamaño del tablero cuando el contenedor cambia de visibilidad o tamaño.
 */
export function redimensionarTablero() {
  if (!board) return;
  const box = board.containerObj;
  if (!box || box.clientWidth === 0 || box.clientHeight === 0) return;

  try {
    board.resizeContainer(box.clientWidth, box.clientHeight);
    board.fullUpdate();
  } catch (error) {
    console.debug("No se pudo redimensionar el tablero:", error);
  }
}

/**
 * Renderiza la función original f(x), la derivada correcta, la del estudiante
 * y agrega la pista visual interactiva (glider + tangente).
 *
 * @param {Function} f - Función original f(x)
 * @param {Function|null} dfCorrecta - Derivada real f'(x)
 * @param {Function|null} dfEstudiante - Derivada propuesta por el estudiante (opcional)
 */
export function mostrarGrafica(f, dfCorrecta = null, dfEstudiante = null) {
  if (!board) {
    console.error("El tablero no ha sido inicializado. Llama primero a inicializarTablero().");
    return;
  }

  if (typeof f !== "function") {
    console.warn("mostrarGrafica esperaba una función f(x) válida.");
    return;
  }

  limpiarElementos();

  // 1. Trazar función original f(x)
  const graficaOriginal = board.create("functiongraph", [f], {
    strokeColor: "#3B82F6", // Azul (--blue)
    strokeWidth: 2.5,
    name: "f(x)",
  });
  elementosGraficos.push(graficaOriginal);

  // 2. Trazar derivada correcta vs. la del estudiante
  if (typeof dfCorrecta === "function") {
    const graficaCorrecta = board.create("functiongraph", [dfCorrecta], {
      strokeColor: "#10B981", // Verde (--emerald)
      strokeWidth: 2,
      dash: 0,
      name: "f'(x) Real",
    });
    elementosGraficos.push(graficaCorrecta);
  }

  if (typeof dfEstudiante === "function") {
    const graficaEstudiante = board.create("functiongraph", [dfEstudiante], {
      strokeColor: "#FB7185", // Rosa/Rojo (--pink)
      strokeWidth: 2,
      dash: 2, // Línea punteada para contrastar
      name: "f'(x) Estudiante",
    });
    elementosGraficos.push(graficaEstudiante);
  }

  // 3. Pista visual: Punto arrastrable (glider) sobre f(x) y su recta tangente
  const candidatosX = [1, 0, -1, 2];
  const xInicial = candidatosX.find((x) => {
    try {
      return Number.isFinite(f(x));
    } catch {
      return false;
    }
  }) ?? 1;

  const yInicial = f(xInicial);
  const puntoArrastrable = board.create("glider", [xInicial, Number.isFinite(yInicial) ? yInicial : 0, graficaOriginal], {
    name: "P",
    color: "#F59E0B", // Naranja/Ámbar (--amber)
    size: 4,
    label: {
      strokeColor: "#F59E0B",
      offset: [8, 8],
    },
  });

  const rectaTangente = board.create("tangent", [puntoArrastrable], {
    strokeColor: "#A78BFA", // Morado legible sobre fondo oscuro
    strokeWidth: 1.5,
    dash: 1,
  });

  puntoArrastrable.on("drag", () => {
    actualizarLecturaGlider(puntoArrastrable.X(), f, dfCorrecta);
  });

  actualizarLecturaGlider(puntoArrastrable.X(), f, dfCorrecta);

  elementosGraficos.push(puntoArrastrable, rectaTangente);
  board.update();
}

/**
 * Punto de entrada estándar del contrato del equipo (ver pauta del proyecto).
 * Inicializa el tablero en el objeto compartido `app` y grafica f(x) si existe.
 * @param {object} app
 */
export function iniciar(app) {
  if (!app) return;

  if (app.board) {
    board = app.board;
  } else {
    app.board = inicializarTablero("box", [-5, 5, 5, -5]);
  }

  if (app.ejercicio) {
    const f = app.ejercicio.fn || convertirAFuncion(app.ce, app.ejercicio.enunciado);
    if (f) {
      mostrarGrafica(f, null, null);
    }
  }
}

/**
 * Muestra la comparación visual después de que el estudiante responde (contrato del equipo).
 * @param {object} app
 * @param {string|Function} respuesta
 * @param {object} [resultado]
 */
export function mostrarRespuesta(app, respuesta, resultado = null) {
  if (!app) return;
  if (!board && app.board) {
    board = app.board;
  } else if (!board) {
    iniciar(app);
  }

  const f = app.ejercicio?.fn || convertirAFuncion(app.ce, app.ejercicio?.enunciado);
  const dfCorrecta = app.ejercicio?.dfn || convertirAFuncion(app.ce, app.ejercicio?.solucion);
  const dfEstudiante = typeof respuesta === "function"
    ? respuesta
    : convertirAFuncion(app.ce, respuesta);

  if (f) {
    mostrarGrafica(f, dfCorrecta, dfEstudiante);
  } else {
    console.warn("No hay función base f(x) en app.ejercicio para graficar.", resultado);
  }
}
