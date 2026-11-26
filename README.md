# 📈 DerivaYa — Entrenador Interactivo de Derivadas

> **Plataforma web interactiva y gamificada para el aprendizaje visual y algebraico del cálculo diferencial.**  
> **Proyecto en Equipos: Matemática Interactiva con Git** · **Equipo 1**  
> *Líder de Proyecto:* **Randy Castillo**

---

## 🌟 Descripción General

**DerivaYa** es una aplicación web educativa diseñada para revolucionar la enseñanza y práctica del Cálculo Diferencial. Combina un motor de cálculo simbólico avanzado con un visualizador geométrico dinámico en tiempo real, permitiendo a estudiantes y docentes comprender no solo la manipulación algebraica de las derivadas, sino también su significado geométrico como la pendiente de la recta tangente.

La plataforma implementa un entorno de gamificación con niveles progresivos de dificultad, sistema de intentos, penalización por pistas y persistencia local de récords y progreso.

---

## 🚀 Características Principales

### 1. 🎯 Sistema de Niveles Progresivos
* **Nivel 1 · Polinomios:** Regla de la potencia, derivada de constantes, sumas y restas de monomios.
* **Nivel 2 · Trigonométricas y Exponenciales:** Funciones seno, coseno, tangente, secante al cuadrado, funciones exponenciales ($e^x$) y logaritmo natural ($\ln x$).
* **Nivel 3 · Regla de la Cadena:** Composición de funciones trigonométricas y algebraicas (ej. $\sin(x^2)$, $e^{x^2}$, etc.).

### 2. 📈 Visualizador Geométrico en Tiempo Real (JSXGraph)
* Trazado automático de la función original $f(x)$.
* **Punto deslizador interactivo ($P$):** Arrastra el punto naranja sobre la curva para explorar la recta tangente instantánea y observar cómo varía su pendiente ($m = f'(x)$) en cada punto.
* Comparativa gráfica: Visualización de la derivada analítica correcta $f'(x)$ y la derivada ingresada por el estudiante $g(x)$.

### 3. ✍️ Entrada Matemática Inteligente (MathLive)
* Campo de escritura matemática interactivo con renderizado tipográfico de calidad LaTeX en tiempo real.
* Teclado virtual integrado nativo para dispositivos táctiles y móviles.
* Botón de borrado rápido y visualizador de vista previa textual.

### 4. 🧠 Corrección Simbólica Robusta (CortexJS Compute Engine)
* Evaluación algebraica exacta que reconoce expresiones matemáticamente equivalentes (ejemplo: $2x$, $x \cdot 2$, orden de sumandos, simplificaciones).
* Aceptación flexible de nomenclatura en español e internacional (`sen(x)` y `sin(x)`).

### 5. 🏆 Gamificación y Persistencia Multi-Nivel
* **Sistema de Intentos:** 2 intentos por cada ejercicio con badge visual dinámico.
* **Sistema de Puntuación:** 10 puntos por acierto en primer intento, 5 puntos en segundo intento.
* **Pistas Didácticas:** Pistas conceptuales con penalización moderada ($-2$ puntos por pista, con piso en 0).
* **Persistencia Multi-Nivel (`localStorage`):** El progreso, los puntos acumulados y la posición en cada nivel se guardan automáticamente; cambiar de nivel no reinicia el puntaje global.
* **Récord Histórico:** Registro del récord de puntos personal almacenado en el navegador.

### 6. 📖 Formulario de Referencia Rápida
* Guía de consulta integrada con fórmulas y reglas de derivación esenciales clasificadas por nivel, junto con la interpretación geométrica de la derivada.

### 7. 📱 Interfaz Ergonómica y Responsiva (Dark Mode)
* Paleta visual moderna inspirada en temas oscuros profesionales.
* Adaptabilidad 100% fluida a cualquier resolución: teléfonos inteligentes (360px+), tablets, laptops y pantallas de escritorio.
* Sin desbordamientos horizontales ni elementos forzados.

---

## 🏗️ Arquitectura del Software

El proyecto fue construido bajo el estándar de **Módulos ES6 nativos** de JavaScript, desacoplando la lógica de negocio en módulos autónomos y colaborativos:

```
derivaya-equipo-1/
├── css/
│   └── styles.css               # Estilos globales, temas oscuros, layout flex/grid y media queries
├── docs/
│   ├── README.md                # Guía y lineamientos de documentación técnica del equipo
│   ├── modulo-1-banco.md        # Informe técnico detallado del Módulo 1
│   ├── modulo-2-correcion.md    # Informe técnico detallado del Módulo 2
│   ├── modulo-3-grafica.md        # Informe técnico detallado del Módulo 3
│   └── modulo-4-progreso.md     # Informe técnico detallado del Módulo 4
├── js/
│   ├── main.js                  # Controlador central: orquestación de eventos, DOM, gamificación y persistencia
│   └── modulos/
│       ├── banco.js             # MÓDULO 1: Catálogo estructurado de funciones y pistas
│       ├── correccion.js        # MÓDULO 2: Validación y equivalencia simbólica (Compute Engine)
│       ├── grafica.js           # MÓDULO 3: Renderizado y geometría interactiva (JSXGraph)
│       └── progreso.js          # MÓDULO 4: Gestión del progreso, intentos y resumen de resultados
├── libs/                        # Dependencias locales auxiliares
├── index.html                   # Documento semántico principal (Single Page Application)
└── README.md                    # Documentación general del repositorio
```

### Detalle de Módulos

| Módulo | Archivo | Responsable | Rol dentro del Sistema |
| :--- | :--- | :--- | :--- |
| **Módulo 1** | `banco.js` | Sara | Provee la base de datos de reactivos dividida por niveles, con expresiones LaTeX, funciones JavaScript y pistas. |
| **Módulo 2** | `correccion.js` | Vanessa | Procesa la entrada matemática del usuario, la compara simbólicamente con la solución esperada y emite el diagnóstico (`ok`, `valida`, `intentos`). |
| **Módulo 3** | `grafica.js` | Mariandry | Administra el canvas de JSXGraph: dibuja la función, la recta tangente móvil, el glider interactivo y la gráfica del estudiante. |
---

## 🛠️ Tecnologías y Librerías

* **HTML5:** Semántica web moderna (`header`, `main`, `section`, `article`, `nav`, `math-field`).
* **CSS3:** Variables CSS (custom properties), Flexbox, CSS Grid, tipografías monoespaciadas (`JetBrains Mono`, `Inter`) y media queries responsivas.
* **JavaScript ES6+:** Programación modular nativa (`import` / `export`), Web Storage API (`localStorage`), promesas y manejo defensivo con `try / catch`.
* **[JSXGraph](https://jsxgraph.org/):** Librería líder en geometría dinámica, cálculo y trazado de funciones matemáticas interactivas en HTML5 Canvas/SVG.
* **[MathLive](https://cortexjs.net/mathlive/):** Componente web oficial para renderizado, edición accesible y teclado virtual de fórmulas matemáticas.
* **[CortexJS Compute Engine](https://cortexjs.net/compute-engine/):** Motor de cálculo simbólico para análisis algebraico, parsing LaTeX y verificación de equivalencias matemáticas.

---

## 💻 Instalación y Uso Local

Para ejecutar DerivaYa en tu máquina de desarrollo local, no se requiere Node.js ni compiladores complejos, únicamente un servidor HTTP estático para que los módulos ES6 carguen sin restricciones de CORS:

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/randycastillo300810-del/derivaya-equipo-1.git
cd derivaya-equipo-1
```

### Paso 2: Servir los archivos
Puedes utilizar cualquiera de las siguientes opciones:

* **Con VS Code (Recomendado):**
  Instala la extensión **Live Server**, haz clic derecho sobre `index.html` y selecciona *"Open with Live Server"*.

* **Con Node.js (`npx serve` o `http-server`):**
  ```bash
  npx serve .
  # O bien:
  npx http-server -p 8080 .
  ```

* **Con Python 3:**
  ```bash
  python -m http.server 8000
  ```

### Paso 3: Abrir en el navegador
Visita en tu navegador:
```
http://localhost:8000  (o el puerto indicado por tu servidor local)
```

---

## 🌐 Despliegue en Producción

La aplicación se encuentra configurada y desplegada continuamente a través de **Netlify**:  
👉 **[derivaya.netlify.app](https://derivaya.netlify.app)**
---

## 👥 Equipo de Desarrollo (Equipo 1)

* **Randy Castillo** — *Líder de Proyecto, Integración y Gamificación (main.js)*
* **Sara** — *Desarrolladora Módulo 1 (banco.js)*
* **Vanessa** — *Desarrolladora Módulo 2 (correccion.js)*
* **Mariandry** — *Desarrolladora Módulo 3 (grafica.js)*

---
