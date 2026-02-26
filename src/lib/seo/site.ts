/**
 * Configuración base para SEO y metadatos.
 * En producción, definir NEXT_PUBLIC_SITE_URL (ej. https://tu-dominio.com).
 */
export const siteConfig = {
  /** Nombre completo para título por defecto y meta (SEO). */
  name: "dalsegno · Programación Lineal — Simplex y Método Gráfico",
  /** Marca corta para header y navegación. */
  brandShort: "dalsegno · PL",
  /** Texto para template de títulos: %s | {titleTemplate} */
  titleTemplate: "dalsegno · Programación Lineal",
  shortDescription:
    "Calculadora de programación lineal: método gráfico 2D y algoritmo Simplex tabular paso a paso. Herramienta educativa gratuita.",
  description:
    "Calculadora y herramienta online de programación lineal. Resuelve problemas de optimización con el método Simplex paso a paso (Big-M, tableau, pivoteo) y con el método gráfico en 2D (región factible, vértices, óptimo). Visualiza cada iteración del Simplex y la región factible. Gratuita para estudiantes e ingeniería.",
  keywords: [
    "programación lineal",
    "calculadora simplex online",
    "simplex paso a paso",
    "método simplex",
    "algoritmo simplex",
    "simplex tabular",
    "resolver programación lineal",
    "método simplex explicado",
    "ejercicios programación lineal",
    "optimización lineal",
    "método gráfico",
    "región factible",
    "Big-M",
    "tableau simplex",
    "tabla simplex",
    "variables de holgura",
    "pivoteo",
    "investigación operativa",
    "LP",
    "linear programming",
  ],
  locale: "es_ES",
  baseUrl:
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
      : undefined,
} as const;
