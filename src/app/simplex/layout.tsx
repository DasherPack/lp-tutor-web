import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { SimplexHeader } from "@/components/simplex/SimplexHeader";
import { SimplexWhatIs } from "@/components/simplex/SimplexWhatIs";

const baseUrl = siteConfig.baseUrl ?? "https://lp-tutor.example.com";

export const metadata: Metadata = {
  title: "Método Simplex tabular paso a paso",
  description:
    "Resuelve programación lineal con el algoritmo Simplex tabular paso a paso: forma estándar, variables de holgura y artificiales (Big-M), tableau inicial, regla del coste reducido, test de razón mínima y pivoteo Gauss-Jordan. Visualiza cada iteración y detecta óptimo, infactibilidad o no acotación.",
  keywords: [
    "método simplex",
    "algoritmo simplex",
    "simplex tabular",
    "tableau simplex",
    "Big-M",
    "variables de holgura",
    "variables artificiales",
    "pivoteo",
    "coste reducido",
    "razón mínima",
    "forma estándar",
    "programación lineal",
    "optimización lineal",
    "Gauss-Jordan",
    "base factible",
  ],
  openGraph: {
    title: `Método Simplex tabular paso a paso | ${siteConfig.titleTemplate}`,
    description:
      "Simplex tabular educativo: forma estándar, Big-M, tableau y pivoteo paso a paso con explicaciones.",
    url: `${baseUrl}/simplex`,
  },
  alternates: { canonical: `${baseUrl}/simplex` },
};

const simplexJsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Método Simplex tabular — ${siteConfig.titleTemplate}`,
  description:
    "Herramienta educativa para resolver problemas de programación lineal con el algoritmo Simplex en formato tableau: conversión a forma estándar (holgura, surplus, variables artificiales), método Big-M, construcción del tableau inicial, selección de variable entrante (coste reducido más negativo), variable saliente (test de razón mínima), operaciones de pivote y criterios de parada (óptimo, infactible, no acotado). Incluye historial de pasos y explicación de cada operación elemental.",
  learningResourceType: "Simulation",
  educationalLevel: "undergraduate",
  inLanguage: "es",
  about: [
    { "@type": "Thing", name: "Método Simplex", description: "Algoritmo de optimización lineal que recorre vértices del politopo factible mediante operaciones de pivote en un tableau; fue desarrollado por George Dantzig." },
    { "@type": "Thing", name: "Big-M" },
    { "@type": "Thing", name: "Tableau simplex" },
    { "@type": "Thing", name: "Pivoteo" },
    { "@type": "Thing", name: "Coste reducido" },
    { "@type": "Thing", name: "Razón mínima" },
  ],
  url: `${baseUrl}/simplex`,
};

const simplexFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es el método Simplex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El método Simplex es un algoritmo para resolver problemas de programación lineal, desarrollado por George Dantzig. Consiste en moverse por vértices de la región factible mejorando el valor de la función objetivo en cada paso hasta llegar al óptimo o detectar que el problema es no acotado o infactible.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es el método Big-M?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cuando hay restricciones de tipo ≥ o =, se añaden variables artificiales y se penalizan en la función objetivo con un coeficiente -M (en maximización) para que salgan de la base. Así se obtiene una base factible inicial o se detecta infactibilidad.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se elige la variable entrante en el Simplex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Se elige la columna con coste reducido más negativo (en maximización). Es la variable no básica que más puede mejorar el valor de la función objetivo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es la regla de la razón mínima?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Determina la variable saliente de la base: se calcula el ratio b_i / a_{i,e} para cada fila con a_{i,e} > 0 (donde e es la columna entrante) y se elige la fila con el ratio mínimo. Así se mantiene la factibilidad.",
      },
    },
  ],
};

const simplexHowToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo resolver un problema de programación lineal con el Simplex",
  description: "Pasos para usar el algoritmo Simplex en formato tabular.",
  step: [
    { "@type": "HowToStep", name: "Introducir restricciones y función objetivo", text: "Define la función objetivo (max o min) y todas las restricciones del problema." },
    { "@type": "HowToStep", name: "Forma estándar", text: "Transforma a forma estándar: añade variables de holgura (≤), surplus y artificiales (≥, =) con Big-M si hace falta." },
    { "@type": "HowToStep", name: "Construir el tableau inicial", text: "Monta el tableau con la base inicial (slack y/o artificiales) y la fila de costes reducidos." },
    { "@type": "HowToStep", name: "Iterar con pivoteo", text: "Elige variable entrante (coste reducido más negativo) y saliente (razón mínima), aplica pivoteo Gauss-Jordan y repite hasta optimalidad o detección de infactible/no acotado." },
    { "@type": "HowToStep", name: "Leer la solución", text: "En el tableau final, los valores de las variables básicas y el valor óptimo z aparecen en la columna de términos independientes." },
  ],
};

export default function SimplexLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(simplexJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(simplexFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(simplexHowToJsonLd) }}
      />
      <article aria-labelledby="simplex-heading">
        <SimplexHeader />
        <SimplexWhatIs />
        {children}
      </article>
    </>
  );
}
