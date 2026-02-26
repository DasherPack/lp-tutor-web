import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { GraphicalHeader } from "@/components/graph/GraphicalHeader";
import { seoMetadata, buildHreflang } from "@/lib/seo/metadata-i18n";
import { isValidLocale } from "@/lib/routing";
import type { Locale } from "@/lib/i18n";

const baseUrl = siteConfig.baseUrl;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = isValidLocale(locale) ? seoMetadata[locale as Locale].graphical : seoMetadata.es.graphical;
  const url = `${baseUrl}/${locale}/graphical`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle ?? meta.title,
      description: meta.ogDescription ?? meta.description,
      url,
    },
    alternates: {
      canonical: url,
      languages: buildHreflang(baseUrl, "graphical"),
    },
  };
}

export default async function GraphicalLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const basePath = `${baseUrl}/${locale}`;
  const graphicalUrl = `${basePath}/graphical`;

  const graphicalBreadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: basePath },
      { "@type": "ListItem", position: 2, name: "Método gráfico 2D", item: graphicalUrl },
    ],
  };

  const graphicalMeta = isValidLocale(locale) ? seoMetadata[locale as Locale].graphical : seoMetadata.es.graphical;
  const graphicalJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: graphicalMeta.title,
    description: graphicalMeta.description,
    learningResourceType: "Simulation",
    educationalLevel: "undergraduate",
    inLanguage: locale === "zh" ? "zh-Hans" : locale,
    url: graphicalUrl,
    about: [
      { "@type": "Thing", name: "Método gráfico", description: "Resolución de problemas LP con dos variables mediante semiplanos, región factible y evaluación en vértices." },
      { "@type": "Thing", name: "Región factible" },
      { "@type": "Thing", name: "Vértices" },
      { "@type": "Thing", name: "Semiplanos" },
    ],
  };

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
