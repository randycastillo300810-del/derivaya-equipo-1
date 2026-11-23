/**
 * Módulo de Generación y Estructura de Datos del Banco de Ejercicios.
 * Provee 15 ejercicios distribuidos en 5 por cada bloque temático:
 * Polinomios, Trigonométricas/Exponenciales y Regla de la Cadena.
 */

const bancoEjercicios = [
    // --- BLOQUE 1: POLINOMIOS (5 ejercicios) ---
    {
        id: 1,
        nivel: "Básico",
        funcion: "f(x) = x^2",
        enunciado: "Encuentra la derivada de f(x) = x²",
        respuestaCorrecta: "2x",
        pista: "Aplica la regla de la potencia: multiplica por el exponente y réstale 1 al mismo."
    },
    {
        id: 2,
        nivel: "Básico",
        funcion: "f(x) = 5x + 3",
        enunciado: "Encuentra la derivada de f(x) = 5x + 3",
        respuestaCorrecta: "5",
        pista: "La derivada de una constante por x es la constante, y la derivada de una constante sola es 0."
    },
    {
        id: 3,
        nivel: "Básico",
        funcion: "f(x) = 4x^3",
        enunciado: "Encuentra la derivada de f(x) = 4x³",
        respuestaCorrecta: "12x^2",
        pista: "Multiplica el coeficiente 4 por el exponente 3 y réstale 1 al exponente."
    },
    {
        id: 4,
        nivel: "Básico",
        funcion: "f(x) = 3x^3 - 5x",
        enunciado: "Encuentra la derivada de f(x) = 3x³ - 5x",
        respuestaCorrecta: "9x^2 - 5",
        pista: "Deriva cada término por separado aplicando la regla de la potencia."
    },
    {
        id: 5,
        nivel: "Básico",
        funcion: "f(x) = 2x^4 - 6x^2 + 7",
        enunciado: "Encuentra la derivada de f(x) = 2x⁴ - 6x² + 7",
        respuestaCorrecta: "8x^3 - 12x",
        pista: "Aplica la regla de la potencia en los términos con x y anula el término independiente."
    },

    // --- BLOQUE 2: TRIGONOMÉTRICAS / EXPONENCIALES (5 ejercicios) ---
    {
        id: 6,
        nivel: "Intermedio",
        funcion: "f(x) = \\sin(x)",
        enunciado: "Encuentra la derivada de f(x) = \\sin(x)",
        respuestaCorrecta: "\\cos(x)",
        pista: "Aplica la regla directa de derivación para la función seno."
    },
    {
        id: 7,
        nivel: "Intermedio",
        funcion: "f(x) = \\cos(x)",
        enunciado: "Encuentra la derivada de f(x) = \\cos(x)",
        respuestaCorrecta: "-\\sin(x)",
        pista: "Recuerda que la derivada del coseno lleva signo negativo."
    },
    {
        id: 8,
        nivel: "Intermedio",
        funcion: "f(x) = e^x",
        enunciado: "Encuentra la derivada de f(x) = e^x",
        respuestaCorrecta: "e^x",
        pista: "La función exponencial natural es igual a su propia derivada."
    },
    {
        id: 9,
        nivel: "Intermedio",
        funcion: "f(x) = 3e^x + 2\\sin(x)",
        enunciado: "Encuentra la derivada de f(x) = 3e^x + 2\\sin(x)",
        respuestaCorrecta: "3e^x + 2\\cos(x)",
        pista: "Conserva las constantes multiplicativas y deriva cada función por separado."
    },
    {
        id: 10,
        nivel: "Intermedio",
        funcion: "f(x) = 4\\cos(x) - e^x",
        enunciado: "Encuentra la derivada de f(x) = 4\\cos(x) - e^x",
        respuestaCorrecta: "-4\\sin(x) - e^x",
        pista: "Aplica las derivadas directas de cos(x) y e^x respetando los signos."
    },

    // --- BLOQUE 3: REGLA DE LA CADENA (5 ejercicios) ---
    {
        id: 11,
        nivel: "Avanzado",
        funcion: "f(x) = (2x + 1)^3",
        enunciado: "Encuentra la derivada de f(x) = (2x + 1)³",
        respuestaCorrecta: "6(2x + 1)^2",
        pista: "Baja el exponente 3, réstale 1 al paréntesis y multiplica por la derivada interna (2)."
    },
    {
        id: 12,
        nivel: "Avanzado",
        funcion: "f(x) = e^{2x}",
        enunciado: "Encuentra la derivada de f(x) = e^{2x}",
        respuestaCorrecta: "2e^{2x}",
        pista: "Deriva la exponencial y multiplica por la derivada del exponente 2x."
    },
    {
        id: 13,
        nivel: "Avanzado",
        funcion: "f(x) = \\sin(3x)",
        enunciado: "Encuentra la derivada de f(x) = \\sin(3x)",
        respuestaCorrecta: "3\\cos(3x)",
        pista: "Calcula cos(3x) y multiplica por la derivada del argumento interno (3)."
    },
    {
        id: 14,
        nivel: "Avanzado",
        funcion: "f(x) = (x^2 + 4)^5",
        enunciado: "Encuentra la derivada de f(x) = (x² + 4)⁵",
        respuestaCorrecta: "10x(x^2 + 4)^4",
        pista: "Aplica la regla de la potencia al exterior y multiplica por la derivada de x² + 4."
    },
    {
        id: 15,
        nivel: "Avanzado",
        funcion: "f(x) = e^{5x - 1}",
        enunciado: "Encuentra la derivada de f(x) = e^{5x - 1}",
        respuestaCorrecta: "5e^{5x - 1}",
        pista: "Deriva e^{5x - 1} y multiplica por la derivada interna del exponente (5)."
    }
];

/**
 * Retorna el listado estructurado de ejercicios del banco.
 * Utilizado por el orquestador principal (main.js) para cargar los reactivos.
 *
 * @returns {Array<Object>} Arreglo con 15 ejercicios (5 por bloque temático).
 */
export function obtenerBancoEjercicios() {
    return bancoEjercicios;
}