const CLAVE_RECORD = "alcaravan_record";
const PUNTOS_PRIMER_INTENTO = 10;
const PUNTOS_SEGUNDO_INTENTO = 5;
const PENALIZACION_PISTA = 2;

let puntaje = 0;
let aciertos = 0;
let pistasActuales = 0;
let esNuevoRecord = false;
let historialPreguntas = [];

// Reinicia el estado al comenzar una partida o nivel.
export function iniciar(app) {
    puntaje = 0;
    aciertos = 0;
    pistasActuales = 0;
    esNuevoRecord = false;
    historialPreguntas = [];
    app.puntaje = 0;
    app.aciertos = 0;
}

// Incrementa el contador de pistas usadas en la pregunta actual.
export function registrarPista(app) {
    pistasActuales++;
}

// Devuelve el récord almacenado en localStorage (0 si no existe o falla).
export function obtenerRecord() {
    try {
        const valor = Number(localStorage.getItem(CLAVE_RECORD));
        return Number.isFinite(valor) ? valor : 0;
    } catch (error) {
        return 0;
    }
}

// Guarda el récord de forma segura.
function guardarRecord(valor) {
    try {
        localStorage.setItem(CLAVE_RECORD, String(valor));
    } catch (error) {
        console.warn("No se pudo guardar el récord:", error);
    }
}

// Evalúa la respuesta, calcula puntos con penalización por pistas,
// actualiza el historial y verifica si se rompió el récord.
export function registrar(app, resultado, pregunta) {
    if (app.indice === 0) {
        puntaje = 0;
        aciertos = 0;
        esNuevoRecord = false;
        historialPreguntas = [];
    }

    let puntosPregunta = 0;
    const intentosUsados = resultado && resultado.intentos ? resultado.intentos : 1;
    const fueExitosa = resultado && resultado.ok;

    if (fueExitosa) {
        aciertos++;
        const puntosBase = (intentosUsados <= 1) ? PUNTOS_PRIMER_INTENTO : PUNTOS_SEGUNDO_INTENTO;
        const descuentoPistas = pistasActuales * PENALIZACION_PISTA;
        puntosPregunta = Math.max(0, puntosBase - descuentoPistas);
        puntaje += puntosPregunta;
    }

    historialPreguntas.push({
        pregunta: pregunta,
        intentos: intentosUsados,
        pistas: pistasActuales,
        puntos: puntosPregunta,
        ok: fueExitosa
    });

    pistasActuales = 0;

    app.puntaje = puntaje;
    app.aciertos = aciertos;

    const recordActual = obtenerRecord();
    if (puntaje > recordActual) {
        guardarRecord(puntaje);
        esNuevoRecord = true;
    }
}

// Devuelve el resumen final: puntaje, aciertos, total, récord, historial y falladas.
export function obtenerResumen(app) {
    const total = (app.preguntas && Array.isArray(app.preguntas)) ? app.preguntas.length : historialPreguntas.length;
    const falladas = historialPreguntas.filter(h => !h.ok).map(h => h.pregunta);

    return {
        puntaje: puntaje,
        aciertos: aciertos,
        total: total,
        record: obtenerRecord(),
        nuevoRecord: esNuevoRecord,
        historial: [...historialPreguntas],
        falladas: falladas
    };
}