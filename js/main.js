// ==========================================================================
// DerivaYa — Navegación entre Pantallas (Líder de Proyecto)
// Controla exclusivamente el cambio de vistas de la interfaz para pruebas.
// Los módulos de cada desarrollador se integrarán posteriormente.
// ==========================================================================

// 1. Mapeo de las 4 pantallas principales
const pantallas = {
  niveles: document.getElementById("pantalla-inicio"),
  entrenador: document.getElementById("pantalla-ejercicio"),
  formulas: document.getElementById("pantalla-formulas"),
  progreso: document.getElementById("pantalla-resultados"),
};

// 2. Botones de la barra de navegación inferior
const navBotones = {
  niveles: document.getElementById("nav-niveles"),
  entrenador: document.getElementById("nav-entrenador"),
  formulas: document.getElementById("nav-formulas"),
  progreso: document.getElementById("nav-progreso"),
};

// 3. Tabs superiores de selección de nivel
const tabsNivel = {
  1: document.getElementById("btn-nivel-1"),
  2: document.getElementById("btn-nivel-2"),
  3: document.getElementById("btn-nivel-3"),
};

// 4. Textos informativos de nivel
const subtituloNivel = document.getElementById("subtitulo-nivel");
const etiquetaNivel = document.getElementById("etiqueta-nivel");

const nombresNivel = {
  1: "Nivel 1 · Polinomios",
  2: "Nivel 2 · Trigonométricas y Exponenciales",
  3: "Nivel 3 · Regla de la Cadena",
};

/**
 * Cambia la pantalla visible y resalta el botón activo en la barra inferior.
 * @param {'niveles' | 'entrenador' | 'formulas' | 'progreso'} nombreVista
 */
export function mostrarPantalla(nombreVista) {
  // Ocultar todas las pantallas
  Object.values(pantallas).forEach((pantalla) => {
    if (pantalla) {
      pantalla.classList.add("hidden");
      pantalla.setAttribute("hidden", "true");
    }
  });

  // Mostrar la pantalla seleccionada
  const activa = pantallas[nombreVista];
  if (activa) {
    activa.classList.remove("hidden");
    activa.removeAttribute("hidden");
  }

  // Actualizar estado activo en la barra inferior
  Object.entries(navBotones).forEach(([vista, boton]) => {
    if (boton) {
      if (vista === nombreVista) {
        boton.classList.add("active");
        boton.setAttribute("aria-current", "page");
      } else {
        boton.classList.remove("active");
        boton.removeAttribute("aria-current");
      }
    }
  });
}

/**
 * Selecciona un nivel de dificultad, actualiza etiquetas y navega al entrenador.
 * @param {number|string} nivel
 */
export function seleccionarNivel(nivel) {
  const numNivel = Number(nivel);

  // Actualizar tabs superiores
  Object.entries(tabsNivel).forEach(([n, tab]) => {
    if (tab) {
      tab.classList.toggle("active", Number(n) === numNivel);
    }
  });

  // Actualizar títulos del nivel
  const nombre = nombresNivel[numNivel] || `Nivel ${numNivel}`;
  if (subtituloNivel) subtituloNivel.textContent = nombre;
  if (etiquetaNivel) etiquetaNivel.textContent = nombre;

  // Llevar al usuario al entrenador
  mostrarPantalla("entrenador");
}

// ==========================================================================
// CONFIGURACIÓN DE EVENTOS DE NAVEGACIÓN
// ==========================================================================
function inicializarNavegacion() {
  // 1. Clic en los botones de la barra inferior
  Object.entries(navBotones).forEach(([vista, boton]) => {
    if (boton) {
      boton.addEventListener("click", () => mostrarPantalla(vista));
    }
  });

  // 2. Clic en las pestañas superiores de nivel
  Object.entries(tabsNivel).forEach(([nivel, tab]) => {
    if (tab) {
      tab.addEventListener("click", () => seleccionarNivel(nivel));
    }
  });

  // 3. Botones para iniciar niveles desde la pantalla de bienvenida
  const btnNivel1 = document.getElementById("btn-iniciar-nivel-1");
  const btnNivel2 = document.getElementById("btn-iniciar-nivel-2");
  const btnNivel3 = document.getElementById("btn-iniciar-nivel-3");

  if (btnNivel1) btnNivel1.addEventListener("click", () => seleccionarNivel(1));
  if (btnNivel2) btnNivel2.addEventListener("click", () => seleccionarNivel(2));
  if (btnNivel3) btnNivel3.addEventListener("click", () => seleccionarNivel(3));

  // 4. Botones de acción en la pantalla de resultados
  const btnVolverJugar = document.getElementById("btn-volver-jugar");
  const btnCambiarNivel = document.getElementById("btn-cambiar-nivel");

  if (btnVolverJugar) {
    btnVolverJugar.addEventListener("click", () => mostrarPantalla("entrenador"));
  }
  if (btnCambiarNivel) {
    btnCambiarNivel.addEventListener("click", () => mostrarPantalla("niveles"));
  }

  // Vista inicial por defecto: pantalla de niveles / bienvenida
  mostrarPantalla("niveles");
}

// Iniciar cuando el documento esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarNavegacion);
} else {
  inicializarNavegacion();
}
