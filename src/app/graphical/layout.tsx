import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";

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
      <article aria-labelledby="graphical-heading">
        <header className="mb-4">
          <h1
            id="graphical-heading"
            className="font-heading text-2xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            Método gráfico 2D para programación lineal
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-3xl leading-relaxed">
            El <strong>método gráfico</strong> permite resolver problemas de programación
            lineal con <strong>dos variables</strong>: cada restricción define un semiplano,
            la intersección de todos es la <strong>región factible</strong> (un polígono).
            El óptimo se alcanza en uno de los <strong>vértices</strong> del polígono; se
            evalúa la función objetivo en cada vértice y se toma el máximo o el mínimo según
            el sentido del problema.
          </p>
        </header>
        {children}
      </article>
    </>
  );
}
