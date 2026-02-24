import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { siteConfig } from "@/lib/seo/site";
import { StoreHydration } from "@/components/StoreHydration";
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

const baseUrl = siteConfig.baseUrl ?? "https://lp-tutor.example.com";

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
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: baseUrl },
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
        <div className="min-h-dvh flex flex-col">
          <header className="sticky top-0 z-10 border-b border-[var(--card-border)] bg-[var(--card)]/98 shadow-[var(--shadow-sm)] backdrop-blur-sm">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
              <Link
                href="/"
                className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)] transition hover:text-[var(--primary)]"
              >
                {siteConfig.brandShort}
              </Link>
              <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Principal">
                <Link
                  href="/graphical"
                  className="rounded-[var(--radius)] px-3 py-2 text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                >
                  Método gráfico 2D
                </Link>
                <Link
                  href="/simplex"
                  className="rounded-[var(--radius)] px-3 py-2 text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                >
                  Simplex tabular
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
            <StoreHydration>{children}</StoreHydration>
          </main>
          <footer className="border-t border-[var(--card-border)] bg-[var(--card)]">
            <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
              <p className="font-heading text-xs text-[var(--muted)]">
                Herramienta educativa de programación lineal. Método gráfico y Simplex paso a paso.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
