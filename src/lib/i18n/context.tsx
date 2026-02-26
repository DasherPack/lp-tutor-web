"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "./types";
import type { Translations } from "./types";

const STORAGE_KEY = "lp-tutor-locale";
const SUPPORTED: Locale[] = ["es", "en", "fr", "de", "ja", "zh"];

/** Mapea código de idioma del navegador (ej. "en-US", "es") a Locale soportado. */
function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "es";
  const langs = navigator.languages ?? [navigator.language];
  for (const raw of langs) {
    const code = (raw ?? "").split("-")[0].toLowerCase();
    if (code === "zh") return "zh";
    if (code === "ja") return "ja";
    if (code === "de") return "de";
    if (code === "fr") return "fr";
    if (code === "en") return "en";
    if (code === "es") return "es";
  }
  return "es";
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED.includes(stored as Locale)) return stored as Locale;
  const detected = detectBrowserLocale();
  localStorage.setItem(STORAGE_KEY, detected);
  return detected;
}

function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Translations;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[p];
  }
  return typeof current === "string" ? current : undefined;
}

export function I18nProvider({
  children,
  translations,
}: {
  children: ReactNode;
  translations: Record<Locale, Translations>;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[locale];
      if (!dict) return key;
      let value = getNested(dict as Record<string, unknown>, key);
      if (value === undefined) {
        const fallback = translations.es;
        value = getNested(fallback as Record<string, unknown>, key);
      }
      if (value === undefined) return key;
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, k) =>
          params[k] !== undefined ? String(params[k]) : `{{${k}}}`,
        );
      }
      return value;
    },
    [locale, translations],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, translations: translations[locale] ?? {} }),
    [locale, setLocale, t, translations],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
