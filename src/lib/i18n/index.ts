import type { Locale } from "./types";
import type { Translations } from "./types";

import es from "@/locales/es.json";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import ja from "@/locales/ja.json";
import zh from "@/locales/zh.json";

export const translations: Record<Locale, Translations> = {
  es: es as Translations,
  en: en as Translations,
  fr: fr as Translations,
  de: de as Translations,
  ja: ja as Translations,
  zh: zh as Translations,
};

export type { Locale, Translations } from "./types";
export { I18nProvider, useTranslation } from "./context";
