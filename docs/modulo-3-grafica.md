# 📄 Informe de Desarrollo de Módulo — DerivaYa

- **Nombre del Módulo:** Módulo 3 (grafica.js)
- **Desarrollador Responsable:** Mariandry García
- **Número de Issue en GitHub:** #3
- **Rama de Trabajo:** feature/MRG/num_3
- **Fecha de Entrega:** 24/11/2026

---

## 1. Objetivo del Módulo
Construir el módulo de renderizado gráfico interactivo para DerivaYa utilizando JSXGraph. Permite inicializar el tablero geométrico, trazar la función original $f(x)$, contrastar visualmente la derivada correcta frente a la propuesta por el estudiante y ofrecer una pista interactiva mediante un punto deslizable (`glider`) con su recta tangente.

---

## 2. Estructura de Archivos y Tecnologías
- **Archivos creados o modificados:**
  * `js/modulos/grafica.js`
  * `docs/modulo-3-grafica.md`
- **Tecnologías y librerías utilizadas:**
  * JavaScript ES6 puro (módulos nativos con `export function`, manejo de estado interno y funciones flecha)
  * JSXGraph (`JXG.JSXGraph.initBoard`, `JXG.JSXGraph.freeBoard`, `functiongraph`, `glider` y `tangent`)

---

## 3. Lógica y Funciones Principales

### 3.1. Funciones Exportadas
- `inicializarTablero(containerId = 'jxgbox', boundingBox = [-5, 5, 5, -5])`:
  * Verifica si ya existe una instancia previa del tablero (`board`); si existe, la libera con `JXG.JSXGraph.freeBoard(board)` y reinicia el arreglo `elementosGraficos` para evitar duplicados o fugas al re-renderizar.
  * Crea y configura el tablero en el elemento HTML indicado por `containerId` con `boundingbox`, ejes activos (`axis: true`) y navegación habilitada (`showNavigation: true`).
  * Retorna la instancia `board` creada.
- `mostrarGrafica(f, dfCorrecta, dfEstudiante = null)`:
  * Valida que el tablero esté inicializado antes de dibujar; si no lo está, registra un error en consola y detiene la ejecución.
  * Invoca la función interna `limpiarElementos()` para remover trazos y objetos geométricos anteriores sin destruir el tablero base.
  * Traza la función original `f` como `functiongraph` (`strokeColor: '#2b6cb0'`, `strokeWidth: 2.5`, `name: 'f(x)'`).
  * Si se recibe `dfCorrecta`, dibuja la curva de la derivada esperada (`strokeColor: '#38a169'`, `dash: 0`, `name: "f'(x) Real"`).
  * Si se recibe `dfEstudiante`, dibuja la curva propuesta por el estudiante con estilo punteado para facilitar el contraste visual (`strokeColor: '#e53e3e'`, `dash: 2`, `name: "f'(x) Estudiante"`).
  * Crea la pista visual interactiva anclando un punto deslizable (`glider`) sobre la gráfica de `f(x)` (`color: '#dd6b20'`, `size: 4`) y generando su recta `tangent` asociada (`strokeColor: '#805ad5'`, `dash: 1`).
  * Registra los objetos creados en `elementosGraficos` y llama a `board.update()` para refrescar la escena.

### 3.2. Funciones Auxiliares Internas
- `limpiarElementos()`:
  * Recorre `elementosGraficos` y elimina cada objeto del tablero mediante `board.removeObject(el)`, vaciando el arreglo al finalizar.

### 3.3. Ejemplo de Uso
```javascript
import { inicializarTablero, mostrarGrafica } from './modulos/grafica.js';

inicializarTablero('jxgbox', [-6, 6, 6, -6]);

const f = (x) => Math.pow(x, 2);
const dfCorrecta = (x) => 2 * x;
const dfEstudiante = (x) => 2 * x + 1;

mostrarGrafica(f, dfCorrecta, dfEstudiante);