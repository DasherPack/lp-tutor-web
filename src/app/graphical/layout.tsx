import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { GraphicalHeader } from "@/components/graph/GraphicalHeader";

const baseUrl = siteConfig.baseUrl ?? "https://lp-tutor.example.com";

export const metadata: Metadata = {
  title: "Método gráfico 2D — Región factible y óptimo",
  description:
    "Resuelve programación lineal con dos variables usando el método gráfico: semiplanos, región factible, vértices del polígono y punto óptimo. Visualiza restricciones, sombrea la región factible y evalúa max/min en los vértices. Ideal para entender LP en 2D.",
  keywords: [
    "método gráfico",
    "programación lineal 2D",
    "región factible",
    "semiplanos",
    "vértices",
    "optimización gráfica",
    "polígono factible",
    "programación lineal",
  ],
  openGraph: {
    title: `Método gráfico 2D — Región factible y óptimo | ${siteConfig.titleTemplate}`,
    description:
      "Visualiza la región factible y el óptimo de problemas de programación lineal con dos variables. Semiplanos, vértices y punto óptimo.",
    url: `${baseUrl}/graphical`,
  },
  alternates: { canonical: `${baseUrl}/graphical` },
};

const graphicalBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
    { "@type": "ListItem", position: 2, name: "Método gráfico 2D", item: `${baseUrl}/graphical` },
  ],
};

const graphicalJsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: `Método gráfico 2D para programación lineal — ${siteConfig.titleTemplate}`,
  description:
    "Herramienta educativa para resolver problemas de programación lineal con dos variables mediante el método gráfico: representación de restricciones como semiplanos, intersección que define la región factible (polígono), vértices del polígono y evaluación de la función objetivo en cada vértice para hallar el óptimo. Incluye visualización interactiva de la región factible y el punto óptimo.",
  learningResourceType: "Simulation",
  educationalLevel: "undergraduate",
  inLanguage: "es",
  about: [
    { "@type": "Thing", name: "Método gráfico", description: "Resolución de problemas LP con dos variables mediante semiplanos, región factible y evaluación en vértices." },
    { "@type": "Thing", name: "Región factible" },
    { "@type": "Thing", name: "Vértices" },
    { "@type": "Thing", name: "Semiplanos" },
  ],
  url: `${baseUrl}/graphical`,
};

export default function GraphicalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphicalJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphicalBreadcrumbJsonLd) }}
      />
      <article aria-labelledby="graphical-heading">
        <GraphicalHeader />
        {children}
      </article>
    </>
  );
}
