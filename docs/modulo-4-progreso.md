# 📄 Informe de Desarrollo de Módulo — DerivaYa

* **Nombre del Módulo:** Módulo 4 (progreso.js)
* **Desarrollador Responsable:** Randy Castillo (Líder de Proyecto — *Cobertura por retiro de integrante asignado*)
* **Número de Issue en GitHub:** #4
* **Rama de Trabajo:** `develop`
* **Fecha de Entrega:** 24/11/2026

---

## 1. Objetivo del Módulo
Construir el sistema integral de gamificación, puntuación con penalización por pistas, control de intentos, almacenamiento persistente del récord histórico y generación del resumen detallado al finalizar cada ronda de ejercicios en DerivaYa.

---

## 2. Estructura de Archivos y Tecnologías
* **Archivos creados o modificados:**
  * `js/modulos/progreso.js`
* **Tecnologías y librerías utilizadas:**
  * JavaScript ES6 Modules (`import` / `export`).
  * Web Storage API (`localStorage`) para persistencia local de récords.
  * Manejo defensivo de excepciones con bloques `try / catch` para soporte en modo incógnito.

---

## 3. Lógica y Funciones Principales

### 3.1. Funciones Exportadas

* **`iniciar(app)`**
  * **Parámetros que recibe:** `app` (objeto de estado global compartido de la aplicación).
  * **Lógica interna:** Restablece a cero las variables de estado en memoria (`puntaje`, `aciertos`, `pistasActuales`, `esNuevoRecord`) y vacía el historial de preguntas evaluadas (`historialPreguntas = []`).
  * **Retorno:** No retorna valor directo (`void`); actualiza `app.puntaje` y `app.aciertos`.

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
    * `app`: Objeto de estado global.
    * `resultado`: Objeto con `{ ok, valida, intentos }` proveniente de la corrección.
    * `pregunta`: Objeto del reactivo evaluado proveniente del Módulo 1 (`banco.js`).
  * **Lógica interna:**
    1. Si `resultado.ok` es verdadero:
       * Suma 10 puntos si acierta en el primer intento (`intentos <= 1`), o 5 puntos si acierta en el segundo (`intentos === 2`).
       * Aplica penalización de 2 puntos por cada pista usada (`PENALIZACION_PISTA = 2`).
       * Asegura un piso de 0 con `Math.max(0, puntosBase - descuentoPistas)` para evitar puntos negativos.
    2. Guarda en `historialPreguntas` el detalle `{ pregunta, intentos, pistas, puntos, ok }`.
    3. Reinicia `pistasActuales = 0` para la siguiente pregunta.
    4. Si el puntaje actual supera el récord histórico, actualiza `localStorage` mediante `guardarRecord(puntaje)` y marca `esNuevoRecord = true`.
  * **Retorno:** `void`.

* **`obtenerResumen(app)`**
  * **Parámetros que recibe:** `app` (objeto global).
  * **Lógica interna:** Calcula el número total de ejercicios evaluados y filtra el subconjunto de preguntas falladas (`!h.ok`).
  * **Retorno:** Objeto estructurado de resumen para la pantalla de resultados:
    ```javascript
    {
      puntaje: number,        // Puntos totales acumulados
      aciertos: number,       // Respuestas correctas
      total: number,          // Cantidad total de preguntas evaluadas
      record: number,         // Récord histórico vigente
      nuevoRecord: boolean,   // Indicador de si se batió el récord
      historial: Array,       // Detalle completo reactivo por reactivo
      falladas: Array         // Lista de preguntas donde se agotaron los intentos
    }
    ```

---

## 4. Pruebas y Validación Local
* **Método de prueba:** Se ejecutó en entorno de servidor local HTTP (Live Server) en Microsoft Edge y Google Chrome.
* **Casos probados:**
  1. **Acierto en primer intento sin pistas:** Otorga exactamente 10 puntos y actualiza la pastilla superior.
  2. **Acierto con 1 pista solicitada:** Aplica penalización de 2 puntos ($10 - 2 = 8$ puntos netos otorgados).
  3. **Penalización con piso cero:** Si se usan múltiples pistas en un acierto de segundo intento, el puntaje resultante no desciende de 0.
  4. **Superación de récord:** Al alcanzar un puntaje superior al previo, el valor se persiste en `localStorage` y persiste tras recargar la página.
  5. **Modo incógnito:** La captura de excepciones `try / catch` previene que la aplicación falle al bloquearse el acceso a almacenamiento local.
* **Estado final:** Funciona de forma 100% autónoma, sin advertencias en consola y en total sincronía con `main.js`.

---

## 5. Dificultades Técnicas y Soluciones (Opcional)
* **Problema:** En navegadores con almacenamiento de terceros o modo incógnito estricto, invocar `localStorage.getItem` o `localStorage.setItem` directamente puede lanzar excepciones de tipo `SecurityError` que detienen la ejecución de JavaScript.
* **Solución aplicada:** Se encapsularon todas las operaciones de almacenamiento en funciones protegidas con `try / catch` que devuelven un valor por defecto seguro (`0`) en caso de fallo, garantizando que el juego continúe funcionando sin interrupciones.
