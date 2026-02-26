import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { siteConfig } from "@/lib/seo/site";
import { I18nShell } from "@/components/I18nShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const baseUrl = siteConfig.baseUrl;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.themeColor,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.titleTemplate}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  applicationName: siteConfig.brandShort,
  category: "education",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: ["en_US", "fr_FR", "de_DE", "ja_JP", "zh_CN"],
    siteName: siteConfig.name,
    url: baseUrl,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.shortDescription,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "es": baseUrl,
      "en": baseUrl,
      "fr": baseUrl,
      "de": baseUrl,
      "ja": baseUrl,
      "zh-Hans": baseUrl,
      "x-default": baseUrl,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      name: siteConfig.name,
      description: siteConfig.description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
    {
      "@type": "LearningResource",
      "@id": `${baseUrl}/#learning`,
      name: "Programación Lineal: método gráfico y Simplex",
      description:
        "Recurso educativo interactivo para aprender programación lineal: método gráfico 2D (región factible, vértices, óptimo) y algoritmo Simplex tabular con forma estándar, Big-M, pivoteo paso a paso y detección de infactibilidad o no acotación.",
      learningResourceType: "Tool",
      educationalLevel: "undergraduate",
      inLanguage: "es",
      about: [
        {
          "@type": "Thing",
          name: "Programación lineal",
        },
        {
          "@type": "Thing",
          name: "Método Simplex",
          description:
            "Algoritmo para resolver problemas de optimización lineal: transformación a forma estándar, variables de holgura y artificiales (Big-M), tableau y operaciones de pivote hasta optimalidad.",
        },
        {
          "@type": "Thing",
          name: "Método gráfico",
          description: "Resolución de problemas LP con dos variables mediante semiplanos, región factible y evaluación en vértices.",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} min-h-dvh antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <I18nShell>{children}</I18nShell>
      </body>
    </html>
  );
}
