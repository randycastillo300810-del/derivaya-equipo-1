// Módulo 4: Progreso - Desarrollador 4
const CLAVE_RECORD = "alcaravan_record";
const CLAVE_PROGRESO = "alcaravan_progreso_v2";
const PUNTOS_PRIMER_INTENTO = 10;
const PUNTOS_SEGUNDO_INTENTO = 5;
const PENALIZACION_PISTA = 2;

let pistasActuales = 0;
let esNuevoRecord = false;

function crearEstadoInicial() {
    return {
        puntajeTotal: 0,
        nivelActivo: 1,
        niveles: {
            1: { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] },
            2: { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] },
            3: { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] }
        }
    };
}

let estadoGlobal = cargarEstadoGlobal();

function cargarEstadoGlobal() {
    try {
        const raw = localStorage.getItem(CLAVE_PROGRESO);
        if (raw) {
            const data = JSON.parse(raw);
            if (data && typeof data.puntajeTotal === "number" && data.niveles) {
                // Asegurar que existan todos los niveles
                [1, 2, 3].forEach(n => {
                    if (!data.niveles[n]) {
                        data.niveles[n] = { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] };
                    }
                });
                return data;
            }
        }
    } catch (e) {
        console.warn("No se pudo cargar el progreso global:", e);
    }
    return crearEstadoInicial();
}

function guardarEstadoGlobal() {
    try {
        localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(estadoGlobal));
    } catch (e) {
        console.warn("No se pudo guardar el progreso global:", e);
    }
}

// Devuelve el estado global completo
export function obtenerEstadoGlobal() {
    return estadoGlobal;
}

// Devuelve los datos guardados para un nivel específico
export function obtenerProgresoNivel(nivel) {
    const num = Number(nivel) || 1;
    if (!estadoGlobal.niveles[num]) {
        estadoGlobal.niveles[num] = { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] };
    }
    return estadoGlobal.niveles[num];
}

// Actualiza el índice guardado de un nivel sin borrar nada
export function actualizarIndiceNivel(nivel, indice) {
    const num = Number(nivel) || 1;
    if (estadoGlobal.niveles[num]) {
        estadoGlobal.niveles[num].indice = indice;
        estadoGlobal.nivelActivo = num;
        guardarEstadoGlobal();
    }
}

// Reinicia el estado al comenzar una partida o nivel.
// Si reiniciarTodo es false, solo reinicia el nivel actual manteniendo el puntaje global
export function iniciar(app, reiniciarTodo = false) {
    pistasActuales = 0;
    esNuevoRecord = false;

    if (reiniciarTodo) {
        estadoGlobal = crearEstadoInicial();
        guardarEstadoGlobal();
    } else {
        const nivel = Number(app?.nivelActual) || estadoGlobal.nivelActivo || 1;
        if (estadoGlobal.niveles[nivel]) {
            const ptsPrevios = estadoGlobal.niveles[nivel].puntaje || 0;
            estadoGlobal.puntajeTotal = Math.max(0, estadoGlobal.puntajeTotal - ptsPrevios);
            estadoGlobal.niveles[nivel] = { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] };
            guardarEstadoGlobal();
        }
    }

    if (app) {
        app.puntaje = estadoGlobal.puntajeTotal;
        const nivel = Number(app.nivelActual) || 1;
        app.aciertos = estadoGlobal.niveles[nivel]?.aciertos || 0;
    }
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
// actualiza el historial por nivel y verifica si se rompió el récord histórico.
export function registrar(app, resultado, pregunta) {
    const nivel = Number(app.nivelActual) || estadoGlobal.nivelActivo || 1;
    if (!estadoGlobal.niveles[nivel]) {
        estadoGlobal.niveles[nivel] = { indice: 0, puntaje: 0, aciertos: 0, completado: false, historial: [] };
    }
    const datosNivel = estadoGlobal.niveles[nivel];

    let puntosPregunta = 0;
    const intentosUsados = resultado && resultado.intentos ? resultado.intentos : 1;
    const fueExitosa = resultado && resultado.ok;

    if (fueExitosa) {
        datosNivel.aciertos++;
        const puntosBase = (intentosUsados <= 1) ? PUNTOS_PRIMER_INTENTO : PUNTOS_SEGUNDO_INTENTO;
        const descuentoPistas = pistasActuales * PENALIZACION_PISTA;
        puntosPregunta = Math.max(0, puntosBase - descuentoPistas);
        datosNivel.puntaje += puntosPregunta;
        estadoGlobal.puntajeTotal += puntosPregunta;
    }

    datosNivel.historial.push({
        pregunta: pregunta,
        intentos: intentosUsados,
        pistas: pistasActuales,
        puntos: puntosPregunta,
        ok: fueExitosa
    });

    pistasActuales = 0;

    app.puntaje = estadoGlobal.puntajeTotal;
    app.aciertos = datosNivel.aciertos;

    const recordActual = obtenerRecord();
    if (estadoGlobal.puntajeTotal > recordActual) {
        guardarRecord(estadoGlobal.puntajeTotal);
        esNuevoRecord = true;
    }

    guardarEstadoGlobal();
}

// Devuelve el resumen para la pantalla de resultados del nivel actual
export function obtenerResumen(app) {
    const nivel = Number(app?.nivelActual) || estadoGlobal.nivelActivo || 1;
    const datosNivel = estadoGlobal.niveles[nivel] || { historial: [], puntaje: 0, aciertos: 0 };
    const total = (app?.preguntas && Array.isArray(app.preguntas)) ? app.preguntas.length : datosNivel.historial.length;
    const falladas = datosNivel.historial.filter(h => !h.ok).map(h => h.pregunta);

    return {
        puntaje: datosNivel.puntaje,
        puntajeTotal: estadoGlobal.puntajeTotal,
        aciertos: datosNivel.aciertos,
        total: total,
        record: obtenerRecord(),
        nuevoRecord: esNuevoRecord,
        historial: [...datosNivel.historial],
        falladas: falladas
    };
}
