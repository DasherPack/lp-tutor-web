/**
 * Rutas y locales para SEO multilingüe.
 * Usado por middleware y componentes de enlace.
 */
import type { Locale } from "@/lib/i18n";

export const SUPPORTED_LOCALES: Locale[] = ["es", "en", "fr", "de", "ja", "zh"];

export function isValidLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

/** Mapeo locale -> código hreflang (BCP 47) */
export const LOCALE_TO_BCP47: Record<Locale, string> = {
  es: "es",
  en: "en",
  fr: "fr",
  de: "de",
  ja: "ja",
  zh: "zh-Hans",
};

/** Rutas internas sin prefijo de locale */
export const ROUTES = {
  home: "",
  simplex: "simplex",
  graphical: "graphical",
} as const;

/** Construye path con locale: /[locale]/path */
export function pathWithLocale(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
