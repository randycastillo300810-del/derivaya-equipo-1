# 📄 Informe de Desarrollo de Módulo — DerivaYa

* **Nombre del Módulo:** Módulo 4 (progreso.js)
* **Desarrollador Responsable:** Randy Castillo (Líder de Proyecto — *Cobertura por retiro de integrante asignado*)
* **Número de Issue en GitHub:** #4
* **Rama de Trabajo:** `develop`
* **Fecha de Entrega:** 24/11/2026

---

## 1. Objetivo del Módulo
Construir el sistema integral de gamificación, puntuación acumulativa multi-nivel con penalización por pistas, control de intentos, almacenamiento persistente del progreso por nivel y del récord histórico, y generación del resumen detallado al finalizar cada nivel o sesión de ejercicios en DerivaYa.

---

## 2. Estructura de Archivos y Tecnologías
* **Archivos creados o modificados:**
  * `js/modulos/progreso.js` (unificado en `js/main.js` por el líder)
* **Tecnologías y librerías utilizadas:**
  * JavaScript ES6 Modules (`import` / `export`).
  * Web Storage API (`localStorage`) para persistencia local del récord (`alcaravan_record`) y del estado multi-nivel (`alcaravan_progreso_v2`).
  * Manejo defensivo de excepciones con bloques `try / catch` para soporte en modo incógnito o entornos de almacenamiento restringido.

---

## 3. Lógica y Funciones Principales

### 3.1. Funciones Exportadas / Métodos de Progreso

* **`iniciar(app, reiniciarTodo = false)`**
  * **Parámetros que recibe:** 
    * `app`: Objeto de estado global compartido de la aplicación.
    * `reiniciarTodo` *(opcional, booleano, por defecto `false`)*: Si es `true`, reinicia completamente el progreso de todos los niveles y el puntaje acumulado a cero. Si es `false`, solo reinicia el nivel actual restando sus puntos previos del acumulador global para no perder el progreso de los demás niveles.
  * **Lógica interna:** Restablece contadores temporales (`pistasActuales = 0`, `esNuevoRecord = false`), gestiona la limpieza selectiva o total en `estadoGlobal`, sincroniza con `localStorage` y actualiza `app.puntaje` y `app.aciertos`.
  * **Retorno:** `void`.

* **`registrarPista(app)`**
  * **Parámetros que recibe:** `app` (objeto global).
  * **Lógica interna:** Incrementa el contador acumulativo de pistas solicitadas durante la pregunta en curso (`pistasActuales++`).
  * **Retorno:** `void`.

* **`obtenerRecord()`**
  * **Parámetros que recibe:** Ninguno.
  * **Lógica interna:** Consulta la clave fija `"alcaravan_record"` en `localStorage`. Valida con `Number.isFinite()` para asegurar que sea un valor numérico seguro. Si no existe o si el entorno restringe el almacenamiento (ej. modo incógnito), retorna 0 sin romper la aplicación.
  * **Retorno:** `number` — El récord numérico histórico guardado en el navegador.

* **`registrar(app, resultado, pregunta)`**
  * **Parámetros que recibe:** 
    * `app`: Objeto de estado global con `nivelActual`.
    * `resultado`: Objeto con `{ ok, valida, intentos }` proveniente de la corrección (`correccion.js`).
    * `pregunta`: Objeto del reactivo evaluado proveniente del Módulo 1 (`banco.js`).
  * **Lógica interna:**
    1. Localiza los datos del nivel activo en `estadoGlobal.niveles[nivel]`.
    2. Si `resultado.ok` es verdadero:
       * Incrementa los aciertos del nivel (`datosNivel.aciertos++`).
       * Otorga 10 puntos si acierta en el primer intento (`PUNTOS_PRIMER_INTENTO = 10`), o 5 puntos en el segundo (`PUNTOS_SEGUNDO_INTENTO = 5`).
       * Aplica penalización de 2 puntos por cada pista usada (`PENALIZACION_PISTA = 2`).
       * Asegura un piso de 0 con `Math.max(0, puntosBase - descuentoPistas)` para evitar puntos negativos.
       * Suma los puntos tanto al nivel como al puntaje global acumulado (`estadoGlobal.puntajeTotal`).
    3. Registra en el historial del nivel el objeto `{ pregunta, intentos, pistas, puntos, ok }`.
    4. Reinicia `pistasActuales = 0` para el siguiente ejercicio.
    5. Actualiza `app.puntaje` y `app.aciertos`.
    6. Comprueba si se ha superado el récord histórico y, de ser así, actualiza `alcaravan_record` y marca `esNuevoRecord = true`.
    7. Guarda el estado actualizado en `localStorage` bajo `"alcaravan_progreso_v2"`.
  * **Retorno:** `void`.

* **`obtenerResumen(app)`**
  * **Parámetros que recibe:** `app` (objeto global).
  * **Lógica interna:** Extrae las métricas del nivel en curso (`datosNivel.historial`, `datosNivel.puntaje`, `datosNivel.aciertos`), calcula el total de preguntas y filtra las preguntas falladas (`!h.ok`).
  * **Retorno:** Objeto estructurado de resumen para la pantalla de resultados:
    ```javascript
    {
      puntaje: number,        // Puntos obtenidos en el nivel actual
      puntajeTotal: number,   // Puntos globales acumulados en todos los niveles
      aciertos: number,       // Respuestas correctas del nivel actual
      total: number,          // Cantidad total de preguntas evaluadas
      record: number,         // Récord histórico vigente
      nuevoRecord: boolean,   // Indicador de si se superó el récord
      historial: Array,       // Detalle completo reactivo por reactivo del nivel
      falladas: Array         // Lista de preguntas donde se agotaron los intentos
    }
    ```

* **`obtenerEstadoGlobal()`**
  * **Parámetros que recibe:** Ninguno.
  * **Lógica interna:** Devuelve el objeto reactivo en memoria `estadoGlobal` con las ramas de los 3 niveles, el nivel activo y el puntaje acumulado global.
  * **Retorno:** `object` — Estado completo del progreso de la aplicación.

* **`obtenerProgresoNivel(nivel)`**
  * **Parámetros que recibe:** `nivel` (`number` o `string` del 1 al 3).
  * **Lógica interna:** Recupera la estructura `{ indice, puntaje, aciertos, completado, historial }` para el nivel especificado, inicializándola de forma segura si no existiera previamente.
  * **Retorno:** `object` — Datos de avance y desempeño del nivel solicitado.

* **`actualizarIndiceNivel(nivel, indice)`**
  * **Parámetros que recibe:** `nivel` (`number`), `indice` (`number` de la pregunta actual).
  * **Lógica interna:** Almacena el índice de la pregunta en la que se encuentra el estudiante en ese nivel, actualiza `estadoGlobal.nivelActivo` y persiste inmediatamente a `localStorage`. Permite que al alternar entre niveles o recargar la página, el usuario retome exactamente donde quedó.
  * **Retorno:** `void`.

---

## 4. Pruebas y Validación Local
* **Método de prueba:** Se ejecutó en entorno de servidor local HTTP (Live Server) en Microsoft Edge y Google Chrome, además de pruebas automatizadas de persistencia vía Node.js.
* **Casos probados:**
  1. **Acierto en primer intento sin pistas:** Otorga exactamente 10 puntos y actualiza la pastilla superior.
  2. **Acierto con 1 pista solicitada:** Aplica penalización de 2 puntos ($10 - 2 = 8$ puntos netos otorgados).
  3. **Penalización con piso cero:** Si se usan múltiples pistas en un acierto de segundo intento, el puntaje resultante no desciende de 0.
  4. **Superación de récord:** Al alcanzar un puntaje superior al previo, el valor se persiste en `localStorage` y se mantiene al recargar la página.
  5. **Persistencia multi-nivel independiente:** El estudiante resuelve ejercicios en el Nivel 1, cambia al Nivel 2 y regresa al Nivel 1; el puntaje acumulado global se conserva intacto y el nivel recuerda la pregunta exacta donde se encontraba.
  6. **Reseteo selectivo vs. total:** Al jugar de nuevo un nivel completado, solo se reinician los puntos de ese nivel sin afectar los obtenidos en otros niveles; el reseteo de récord limpia ambos estados a 0 de forma segura.
  7. **Modo incógnito:** La captura de excepciones `try / catch` previene que la aplicación falle al bloquearse el acceso a almacenamiento local.
* **Estado final:** Funciona de forma 100% autónoma, sin advertencias en consola y en total sincronía con `main.js`.

---

## 5. Dificultades Técnicas y Soluciones (Opcional)
* **Problema 1 (Restricciones de Almacenamiento):** En navegadores con cookies bloqueadas o modo incógnito estricto, invocar `localStorage.getItem` o `localStorage.setItem` directamente lanza excepciones de tipo `SecurityError` que detienen la ejecución de JavaScript.
  * **Solución aplicada:** Se encapsularon todas las operaciones de lectura y escritura en funciones protegidas con `try / catch` que devuelven valores por defecto seguros en caso de fallo, garantizando que el juego continúe funcionando en memoria sin interrupciones.
* **Problema 2 (Reinicio no deseado al alternar niveles):** Inicialmente, el cambio entre niveles reiniciaba el puntaje acumulado y el índice de avance, provocando que el usuario perdiera su progreso al consultar otro nivel.
  * **Solución aplicada:** Se diseñó una estructura centralizada en `estadoGlobal` persistida bajo la clave `"alcaravan_progreso_v2"`, separando las estadísticas de cada nivel (1, 2 y 3) y manteniendo un `puntajeTotal` global que no se resetea al navegar entre los niveles de dificultad.
