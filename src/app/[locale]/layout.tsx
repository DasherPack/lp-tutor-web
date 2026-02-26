import { notFound } from "next/navigation";
import { I18nShell } from "@/components/I18nShell";
import { isValidLocale, SUPPORTED_LOCALES } from "@/lib/routing";
import type { Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  return <I18nShell locale={locale as Locale}>{children}</I18nShell>;
}
