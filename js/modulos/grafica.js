// Módulo 3: Gráfica - Desarrollador 3
// js/modulos/grafica.js

let board = null;
let elementosGraficos = [];

/**
    * Inicializa el tablero de JSXGraph dentro de un contenedor HTML.
    * @param {string} containerId - ID del div contenedor (ej: 'box' o 'jxgbox')
    * @param {Array<number>} boundingBox - Límites [xmin, ymax, xmax, ymin]
    */
export function inicializarTablero(containerId = 'jxgbox', boundingBox = [-5, 5, 5, -5]) {
  // Limpia el tablero si ya existía previo a un re-render
    if (board) {
        JXG.JSXGraph.freeBoard(board);
        elementosGraficos = [];
    }

    board = JXG.JSXGraph.initBoard(containerId, {
        boundingbox: boundingBox,
        axis: true,
        showCopyright: false,
        showNavigation: true,
        keepaspectratio: false
    });

    return board;
}

/**
 * Limpia los trazados y elementos dinámicos manteniendo el tablero activo.
 */
function limpiarElementos() {
    if (!board) return;
    elementosGraficos.forEach(el => board.removeObject(el));
    elementosGraficos = [];
}

/**
 * Renderiza la función original f(x), la derivada correcta, la del estudiante
 * y agrega la pista visual interactiva (glider + tangente).
 * 
 * @param {Function} f - Función original f(x)
 * @param {Function} dfCorrecta - Derivada real f'(x)
 * @param {Function|null} dfEstudiante - Derivada propuesta por el estudiante (opcional)
 */
export function mostrarGrafica(f, dfCorrecta, dfEstudiante = null) {
    if (!board) {
        console.error("El tablero no ha sido inicializado. Llama primero a inicializarTablero().");
        return;
    }

    limpiarElementos();

  // 1. Trazar función original f(x)
    const graficaOriginal = board.create('functiongraph', [f], {
        strokeColor: '#2b6cb0', // Azul
        strokeWidth: 2.5,
        name: 'f(x)'
    });
    elementosGraficos.push(graficaOriginal);

  // 2. Trazar derivada correcta vs. la del estudiante
    if (dfCorrecta) {
        const graficaCorrecta = board.create('functiongraph', [dfCorrecta], {
            strokeColor: '#38a169', // Verde
            strokeWidth: 2,
            dash: 0,
        name: "f'(x) Real"
        });
        elementosGraficos.push(graficaCorrecta);
    }

    if (dfEstudiante) {
        const graficaEstudiante = board.create('functiongraph', [dfEstudiante], {
            strokeColor: '#e53e3e', // Rojo
            strokeWidth: 2,
            dash: 2, // Línea punteada para contrastar
            name: "f'(x) Estudiante"
        });
        elementosGraficos.push(graficaEstudiante);
    }

  // 3. Pista visual: Punto arrastrable (glider) sobre f(x) y su recta tangente
    const puntoArrastrable = board.create('glider', [0, 0, graficaOriginal], {
        name: 'P',
        color: '#dd6b20', // Naranja
        size: 4
    });

    const rectaTangente = board.create('tangent', [puntoArrastrable], {
        strokeColor: '#805ad5', // Morado
        strokeWidth: 1.5,
        dash: 1
    });

    elementosGraficos.push(puntoArrastrable, rectaTangente);

    board.update();
}