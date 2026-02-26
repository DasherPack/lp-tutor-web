import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
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
  const meta = isValidLocale(locale) ? seoMetadata[locale as Locale].home : seoMetadata.es.home;
  const url = `${baseUrl}/${locale}`;
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
      languages: buildHreflang(baseUrl, ""),
    },
  };
}

export default async function HomeLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const meta = isValidLocale(locale) ? seoMetadata[locale as Locale].home : seoMetadata.es.home;
  const url = `${baseUrl}/${locale}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: meta.title,
    description: meta.description,
    learningResourceType: "WebApplication",
    educationalLevel: "undergraduate",
    inLanguage: locale === "zh" ? "zh-Hans" : locale,
    url,
    about: [
      { "@type": "Thing", name: "Programación lineal" },
      { "@type": "Thing", name: "Método Simplex" },
      { "@type": "Thing", name: "Método gráfico" },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
