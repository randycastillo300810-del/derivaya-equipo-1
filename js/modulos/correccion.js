// Módulo 2: Corrección - Desarrollador 2


// compile convierte una expresión en una función que recibe x
import { compile } from "https://esm.run/@cortex-js/compute-engine";

// No comparo texto, comparo valores en estos puntos de x
const PUNTOS = [-2.7, -1.3, -0.4, 0.6, 1.9, 3.2, 4.5];

// Calcula la derivada correcta. Ej: "x^3-3x" -> "3x^2-3"
export function derivar(ce, latexF) {
  const f = ce.parse(latexF);                    // texto -> expresión
  return ce.box(["D", f, "x"]).evaluate().latex; // D = derivar respecto a x
}

// Devuelve { ok, valida, mensaje }
// valida: false -> no se descuenta intento
// OJO: la tolerancia del PDF era 1e6 (error), debe ser 1e-6
export function corregir(ce, latexEstudiante, latexCorrecta, tolerancia = 1e-6) {
  // A. ¿Está vacía?
  if (!latexEstudiante.trim()) {
    return { ok: false, valida: false, mensaje: "Escribe una respuesta." };
  }

  // B. ¿Está bien escrita?
  const expr = ce.parse(latexEstudiante);
  if (!expr.isValid) {
    return { ok: false, valida: false, mensaje: "La expresión no está bien escrita." };
  }

  // C. ¿Usó otra variable que no sea x?
  const otras = expr.unknowns.filter((v) => v !== "x");
  if (otras.length) {
    return { ok: false, valida: false, mensaje: `Solo puedes usar la variable x (usaste ${otras.join(", ")}).` };
  }

  // D. Las dos expresiones pasan a ser funciones
  const fe = compile(expr);                    // estudiante
  const fc = compile(ce.parse(latexCorrecta)); // correcta

  // E. Comparo en cada punto
  let comparados = 0;
  for (const x of PUNTOS) {
    const c = fc.run({ x });
    if (typeof c !== "number" || !Number.isFinite(c)) continue; // fuera del dominio
    const e = fe.run({ x });
    if (typeof e !== "number" || Math.abs(e - c) > tolerancia * Math.max(1, Math.abs(c))) {
      return { ok: false, valida: true, mensaje: "No es correcta. Compara tu respuesta en la gráfica." };
    }
    comparados++;
  }

  // F. Correcta si coincidió en al menos 3 puntos
  return comparados >= 3
    ? { ok: true, valida: true, mensaje: "¡Correcto!" }
    : { ok: false, valida: false, mensaje: "No se pudo comprobar la respuesta." };
}

