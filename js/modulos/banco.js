// Módulo 1: Banco de ejercicios - Desarrollador 1

// Módulo de Generación y Estructura de Datos del Banco de Ejercicios.
// Almacena los reactivos clasificados por nivel de dificultad e incluye
// propiedades de función, enunciado, respuesta correcta y pista pedagógica.

const bancoEjercicios = [
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
        nivel: "Intermedio",
        funcion: "f(x) = 3x^3 - 5x",
        enunciado: "Encuentra la derivada de f(x) = 3x³ - 5x",
        respuestaCorrecta: "9x^2 - 5",
        pista: "Deriva cada término por separado aplicando la regla de la potencia y la constante."
    },
    {
        id: 3,
        nivel: "Avanzado",
        funcion: "f(x) = \\sin(x)",
        enunciado: "Encuentra la derivada de f(x) = \\sin(x)",
        respuestaCorrecta: "\\cos(x)",
        pista: "Utiliza las identidades de derivación para funciones trigonométricas directas."
    }
];

/**
 * Provee acceso al arreglo completo de ejercicios estructurados.
 * Diseñado para ser importado por el orquestador principal (main.js). 
 @returns {Array<Object>} //Colección de ejercicios con niveles, respuestas y pistas.
 */
export function obtenerBancoEjercicios() {
    return bancoEjercicios;
}