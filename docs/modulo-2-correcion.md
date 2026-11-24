# 📄 Informe de Desarrollo de Módulo — DerivaYa

* **Nombre del Módulo:** Módulo 2 (correccion.js)
* **Desarrollador Responsable:** [Scarlys Semprun]
* **Número de Issue en GitHub:** #2
* **Rama de Trabajo:** `feature/SS/dev/2`
* **Fecha de Entrega:** 23/11/2026

## 1. Objetivo del Módulo

Construí el "juez" de DerivaYa: un módulo que calcula la derivada correcta de la función de cada ejercicio con Compute Engine y decide si la respuesta escrita por el estudiante es correcta. Compara valores y no texto, por lo que respuestas equivalentes como `3x^2-3` y `3(x^2-1)` se aceptan como la misma. Además, tras la revisión del líder, el módulo resiste entradas nulas y acepta tanto `sen(x)` como `sin(x)`.


## 2. Estructura de Archivos y Tecnologías

* **Archivos creados o modificados:**
  * `js/modulos/correccion.js`
* **Tecnologías y librerías utilizadas:**
  * JavaScript ES6 puro (módulos con `import` / `export`)
  * CortexJS Compute Engine (`parse`, `box`, `evaluate`, `compile`)
  * Expresiones regulares de JavaScript (normalización de `sen` a `\sin`)
  * Git y GitHub (rama `feature/SS/dev/2`, Pull Requests #9 y #12)
* **Commits propios:**
  * `[ADD] Funciones de validación en correccion.js`
  * `[ADD] Módulo de corrección con derivar y corregir`
  * `[FIX] Blindar contra nulos y aceptar sen(x) y sin(x)`


## 3. Lógica y Funciones Principales

### 3.1. Funciones Exportadas

* **`derivar(ce, latexF)`**
  * **Parámetros que recibe:** `ce`, el motor de Compute Engine que crea el líder en `main.js`, y `latexF`, la función f(x) escrita en LaTeX (por ejemplo `"x^3-3x"`).
  * **Lógica interna:** convierte el LaTeX en una expresión con `ce.parse`, arma la orden de derivada con `ce.box(["D", f, "x"])` y la calcula con `.evaluate()`. La derivada no se guarda a mano, siempre la calcula el motor.
  * **Retorno:** la derivada en LaTeX como texto (por ejemplo `"3x^2-3"`).

* **`corregir(ce, latexEstudiante, latexCorrecta, tolerancia = 1e-6)`**
  * **Parámetros que recibe:** el motor `ce`, la respuesta del estudiante en LaTeX, la derivada correcta (la que devuelve `derivar`) y la tolerancia de comparación.
  * **Lógica interna:**
    1. Si la respuesta está vacía, es `null` o `undefined`, devuelve un mensaje pidiendo que escriba algo. La condición `!latexEstudiante || !latexEstudiante.trim()` evita el error al llamar `.trim()` sobre un valor nulo.
    2. Normaliza la respuesta con `.replace(/\bsen\b/g, "\\sin")`, de modo que `sen(x)` y `sin(x)` se acepten por igual y `sen` no se lea como las variables `s`, `e` y `n`.
    3. Si la expresión no está bien escrita (`isValid` es falso), avisa del error.
    4. Si usa una variable distinta de `x`, avisa que solo se permite `x`.
    5. Convierte ambas expresiones en funciones con `compile` y las evalúa en 7 puntos de prueba (`-2.7, -1.3, -0.4, 0.6, 1.9, 3.2, 4.5`). Si alguna diferencia supera la tolerancia, la respuesta es incorrecta.
    6. Los puntos donde la derivada correcta no da un número real se omiten, y se exige haber comparado al menos 3 puntos.
  * **Retorno:** un objeto `{ ok, valida, mensaje }`. Con `valida: false` (respuesta vacía, nula, mal escrita o con otra variable) no se descuenta intento; con `ok: false` y `valida: true` sí se descuenta.


## 4. Pruebas y Validación Local

* **Método de prueba:** se creó una página local `prueba.html` (que no se sube al repositorio) y se ejecutó con Live Server de VS Code en Google Chrome, revisando los resultados en la consola del navegador (F12).
* **Casos probados:**
  1. Con f(x) = x³ − 3x, `derivar` devuelve `3x^2-3`.
  2. `3x^2-3` y `3(x^2-1)` dan `ok: true` (formas equivalentes).
  3. `3x^2` da `ok: false, valida: true` (incorrecta, descuenta intento).
  4. Respuesta vacía da `valida: false` con el mensaje "Escribe una respuesta.".
  5. `3y^2` da `valida: false` con el mensaje "Solo puedes usar la variable x (usaste y).".
  6. Con f(x) = cos(x), tanto `-\sin(x)` como `-sen(x)` dan `ok: true`.
  7. Una respuesta `null` da `valida: false` sin lanzar error.
* **Estado final:** funciona de forma autónoma, sin errores de JavaScript en la consola y respetando el contrato acordado con el líder (`derivar` y `corregir`).


## 5. Dificultades Técnicas y Soluciones


* **Problema 1:** en la revisión del PR #9, el líder pidió blindar la función contra valores nulos y aceptar `sen(x)` además de `sin(x)`.
* **Solución aplicada:** agregué la condición `!latexEstudiante ||` al primer `if`, la normalización con `replace(/\bsen\b/g, "\\sin")` antes de parsear, y pasé a usar la variable `limpia` en `ce.parse`. Quedó en el commit `[FIX] Blindar contra nulos y aceptar sen(x) y sin(x)`.

* **Problema 2:** el `git push` del `[FIX]` fue rechazado porque GitHub tenía en mi rama commits que yo no tenía localmente (el merge de `develop`).
* **Solución aplicada:** ejecuté `git pull --no-rebase origin feature/SS/dev/2`, que se completó sin conflictos, y volví a subir la rama.

* **Problema 3:** el PR #9 se fusionó en `develop` antes de que subiera el commit `[FIX]`, por lo que los ajustes del líder quedaron fuera.
* **Solución aplicada:** abrí un nuevo Pull Request (#12) de `feature/SS/dev/2` hacia `develop` con título `#2 — Ajustes de corrección: nulos y sen/sin` y `Closes #2`, que solo modifica `js/modulos/correccion.js`, y avisé al líder para su revisión.