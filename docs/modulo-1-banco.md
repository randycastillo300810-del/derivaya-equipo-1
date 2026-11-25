# 📄 Informe de Desarrollo de Módulo — DerivaYa

- **Nombre del Módulo:** Módulo 1 (banco.js)
- **Desarrollador Responsable:** Sara Moncada
- **Número de Issue en GitHub:** #1
- **Rama de Trabajo:** feature/SM/dev/1
- **Fecha de Entrega:** 24/11/2026

---

## 1. Objetivo del Módulo
Construir el módulo de generación y estructura de datos del banco de ejercicios de derivadas para DerivaYa. Provee un catálogo organizado de reactivos con enunciados, funciones, respuestas esperadas y pistas para alimentar el flujo interactivo de práctica del sistema.

---

## 2. Estructura de Archivos y Tecnologías
- **Archivos creados o modificados:**
  * js/modulos/banco.js
  * docs/modulo-1-banco.md
- **Tecnologías y librerías utilizadas:**
  * JavaScript ES6 puro (arreglos, objetos literales y exportación de módulos con `export function`)

---

## 3. Lógica y Funciones Principales

### 3.1. Funciones Exportadas
- **obtenerBancoEjercicios()**
  * **Parámetros que recibe:** No recibe parámetros.
  * **Lógica interna:** Devuelve la colección estructurada `bancoEjercicios` con 15 ejercicios distribuidos en 5 reactivos por bloque temático (Polinomios, Trigonométricas/Exponenciales y Regla de la Cadena), donde cada elemento incluye `id`, `nivel`, `funcion`, `enunciado`, `respuestaCorrecta` y `pista`.
  * **Retorno:** Devuelve un arreglo (`Array<Object>`) con los 15 objetos de ejercicios listos para ser consumidos por el orquestador principal (`main.js`).

---

## 4. Pruebas y Validación Local
- **Método de prueba:** Revisión de sintaxis y estructura de datos en Visual Studio Code y verificación del historial de commits y cambios en la rama `feature/SM/dev/1` dentro del Pull Request `#11` en GitHub.
- **Casos probados:**
  1. Verificación de la estructura de cada objeto del arreglo (`id`, `nivel`, `funcion`, `enunciado`, `respuestaCorrecta` y `pista`).
  2. Comprobación de la cantidad total de ejercicios (15 reactivos: 5 de Polinomios, 5 de Trigonométricas/Exponenciales y 5 de Regla de la Cadena) y de la exportación `obtenerBancoEjercicios()`.
- **Estado final:** Funciona de forma autónoma, sin errores de sintaxis en JavaScript y alineado con los ajustes solicitados en la revisión del Pull Request `#11` y el Issue `#1`.

---

## 5. Dificultades Técnicas y Soluciones (Opcional)
- **Problema:** Ajuste del alcance del banco de ejercicios y alineación de los metadatos del Pull Request `#11` con los requisitos del Issue `#1`.
- **Solución aplicada:** Se amplió `js/modulos/banco.js` a 15 ejercicios organizados en los tres bloques temáticos solicitados y se actualizó el título del PR a `#1 — Banco de ejercicios (banco.js)` junto con `Closes #1` en la descripción, subiendo los cambios mediante commits con prefijo `[FIX]`.