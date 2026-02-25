"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

/** Mapeo locale -> atributo lang (BCP 47) para SEO y accesibilidad. */
const LANG_MAP: Record<Locale, string> = {
  es: "es",
  en: "en",
  fr: "fr",
  de: "de",
  ja: "ja",
  zh: "zh-Hans", // Chino simplificado
};

/** Sincroniza el atributo lang del elemento html con el locale actual. */
export function LangSync() {
  const { locale } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = LANG_MAP[locale] ?? "es";
  }, [locale]);
  return null;
}
