/**
 * Módulo de Generación y Estructura de Datos del Banco de Ejercicios.
 * Provee 3 ejercicios por cada nivel de dificultad (Básico, Intermedio y Avanzado),
 * totalizando 9 reactivos con función, enunciado, respuesta correcta y pista orientativa.
 */

const bancoEjercicios = [
    // --- NIVEL BÁSICO (3 ejercicios) ---
    {
        id: 1,
        nivel: "Básico",
        funcion: "f(x) = x^2",
        enunciado: "Encuentra la derivada de f(x) = x²",
        respuestaCorrecta: "2x",
        pista: "Aplica la regla de la potencia: multiplica el exponente y réstale 1 al mismo."
    },
    {
        id: 2,
        nivel: "Básico",
        funcion: "f(x) = 5x + 3",
        enunciado: "Encuentra la derivada de f(x) = 5x + 3",
        respuestaCorrecta: "5",
        pista: "La derivada de una constante por x es la constante, y la derivada de un número solo es 0."
    },
    {
        id: 3,
        nivel: "Básico",
        funcion: "f(x) = 4x^3",
        enunciado: "Encuentra la derivada de f(x) = 4x³",
        respuestaCorrecta: "12x^2",
        pista: "Multiplica el coeficiente 4 por el exponente 3 y réstale 1 al exponente."
    },

    // --- NIVEL INTERMEDIO (3 ejercicios) ---
    {
        id: 4,
        nivel: "Intermedio",
        funcion: "f(x) = 3x^3 - 5x",
        enunciado: "Encuentra la derivada de f(x) = 3x³ - 5x",
        respuestaCorrecta: "9x^2 - 5",
        pista: "Deriva cada término por separado aplicando la regla de la potencia y la constante."
    },
    {
        id: 5,
        nivel: "Intermedio",
        funcion: "f(x) = 2x^4 - 6x^2 + 7",
        enunciado: "Encuentra la derivada de f(x) = 2x⁴ - 6x² + 7",
        respuestaCorrecta: "8x^3 - 12x",
        pista: "Aplica la regla de la potencia en los dos primeros términos; el término independiente (+7) se anula."
    },
    {
        id: 6,
        nivel: "Intermedio",
        funcion: "f(x) = x^3 + 4x^2 - 2x + 1",
        enunciado: "Encuentra la derivada de f(x) = x³ + 4x² - 2x + 1",
        respuestaCorrecta: "3x^2 + 8x - 2",
        pista: "Deriva término a término de izquierda a derecha manteniendo los signos."
    },

    // --- NIVEL AVANZADO (3 ejercicios) ---
    {
        id: 7,
        nivel: "Avanzado",
        funcion: "f(x) = \\sin(x)",
        enunciado: "Encuentra la derivada de f(x) = \\sin(x)",
        respuestaCorrecta: "\\cos(x)",
        pista: "Aplica la regla directa de derivación para la función trigonométrica seno."
    },
    {
        id: 8,
        nivel: "Avanzado",
        funcion: "f(x) = e^{2x}",
        enunciado: "Encuentra la derivada de f(x) = e^{2x}",
        respuestaCorrecta: "2e^{2x}",
        pista: "Aplica la regla de la cadena: deriva la función exponencial y multiplica por la derivada del exponente (2x)."
    },
    {
        id: 9,
        nivel: "Avanzado",
        funcion: "f(x) = \\ln(x) + \\cos(x)",
        enunciado: "Encuentra la derivada de f(x) = \\ln(x) + \\cos(x)",
        respuestaCorrecta: "\\frac{1}{x} - \\sin(x)",
        pista: "La derivada de ln(x) es 1/x y la derivada de cos(x) es -sin(x)."
    }
];

/**
 * Retorna el listado estructurado de ejercicios del banco.
 * Utilizado por el orquestador principal (main.js) para cargar los reactivos.
 *
 * @returns {Array<Object>} Arreglo con 9 ejercicios (3 por cada nivel de dificultad).
 */
export function obtenerBancoEjercicios() {
    return bancoEjercicios;
}