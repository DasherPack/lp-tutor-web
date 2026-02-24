import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";

const baseUrl = siteConfig.baseUrl ?? "https://lp-tutor.example.com";

export const metadata: Metadata = {
  title: "Calculadora de Programación Lineal: Simplex y Método Gráfico paso a paso",
  description: siteConfig.description,
  openGraph: {
    title: "Calculadora de Programación Lineal: Simplex y Método Gráfico paso a paso",
    description: siteConfig.description,
    url: baseUrl,
  },
  alternates: { canonical: baseUrl },
};

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
