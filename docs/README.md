# 📚 Documentación Técnica — DerivaYa
**Proyecto en Equipos: Matemática Interactiva con Git**  
**Equipo 1** · Líder de Proyecto: Randy Castillo  

Bienvenido a la carpeta de documentación técnica de **DerivaYa**. En este directorio se centralizan los informes técnicos individuales de cada módulo desarrollado para la entrega final.

---

## 👥 Asignación de Informes por Desarrollador

Cada integrante del equipo debe crear y redactar su archivo de informe dentro de la carpeta `docs/` en su respectiva rama, siguiendo el **formato oficial unificado**:

| Módulo | Archivo JS | Responsable | Rama de Trabajo |
| :--- | :--- | :--- | :--- |
| Módulo 1 | `js/modulos/banco.js` | Sara | `feature/SM/dev/1` |
| Módulo 2 | `js/modulos/correccion.js` | Vanessa | `feature/SS/dev/2` |
| Módulo 3 | `js/modulos/grafica.js` | Mariandry | `feature/mrg/num_3` |
| Módulo 4 / Integración | `docs/modulo-4-progreso.md` / `js/main.js` | Randy (Líder) | `develop` |

---

## 📋 Formato Oficial de Documentación (Plantilla Obligatoria)

Todos los informes de desarrollo deben construirse copiando y completando la siguiente estructura:

```markdown
# 📄 Informe de Desarrollo de Módulo — DerivaYa

* **Nombre del Módulo:** [Módulo 1 (banco.js) | Módulo 2 (correccion.js) | Módulo 3 (grafica.js) | Módulo 4 (progreso.js)]
* **Desarrollador Responsable:** [Nombre y Apellido del estudiante]
* **Número de Issue en GitHub:** #[Número de Issue asignado en el tablero]
* **Rama de Trabajo:** feature/[INICIALES]/dev/[N°_ISSUE]
* **Fecha de Entrega:** [DD/MM/AAAA]

---

## 1. Objetivo del Módulo
Describe en 2 o 3 líneas qué funcionalidad específica construiste y cómo aporta al funcionamiento de DerivaYa.

---

## 2. Estructura de Archivos y Tecnologías
* **Archivos creados o modificados:**
  * js/modulos/[nombre_de_tu_archivo].js
* **Tecnologías y librerías utilizadas:**
  * (Mencionar las que apliquen: JavaScript ES6 puro, CortexJS Compute Engine, JSXGraph, MathLive, Web Storage API / localStorage, Math.random, etc.)

---

## 3. Lógica y Funciones Principales

### 3.1. Funciones Exportadas
Detalla las funciones clave programadas en tu archivo:

* **nombreDeLaFuncion(parametro1, parametro2)**
  * **Parámetros que recibe:** Explicar qué datos le pasa el líder o el sistema.
  * **Lógica interna:** Qué operaciones, cálculos o trazados realiza internamente.
  * **Retorno:** Qué devuelve (objeto, función matemática, booleano, o nada).

---

## 4. Pruebas y Validación Local
* **Método de prueba:** (Ejemplo: Se ejecutó mediante Live Server / servidor local HTTP en el navegador Google Chrome).
* **Casos probados:**
  1. [Caso 1 probado]
  2. [Caso 2 probado]
* **Estado final:** Funciona de forma autónoma, sin errores en la consola de JavaScript y respetando el contrato acordado con el líder.

---

## 5. Dificultades Técnicas y Soluciones (Opcional)
*Si tuviste algún reto técnico durante el desarrollo, descríbelo brevemente:*
* **Problema:** [Descripción del problema encontrado: sintaxis, compatibilidad, DOM o LaTeX]
* **Solución aplicada:** [Cómo se corrigió, mencionando el commit con tag [FIX] correspondiente]
```

---

## 🔄 Flujo de Trabajo en Git para Integrar tu Informe

Para agregar tu documentación a GitHub desde tu rama:

```bash
# 1. Asegúrate de estar en tu rama de trabajo
git checkout <tu-rama>

# 2. Trae los últimos cambios de develop
git pull origin develop

# 3. Crea tu archivo docs/modulo-X-[nombre].md y pega la plantilla completada

# 4. Agrega el archivo, haz commit con la convención del proyecto y haz push:
git add docs/modulo-X-[nombre].md
git commit -m "[DOC] Documentación técnica de Módulo X según formato oficial"
git push origin <tu-rama>
```
