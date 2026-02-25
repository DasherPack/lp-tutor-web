"use client";

import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const locales: { value: Locale; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },
  { value: "ja", label: "JA" },
  { value: "zh", label: "中文" },
];

export function LocaleSelector() {
  const { locale, setLocale } = useTranslation();
  return (
    <div className="flex items-center gap-1 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] p-0.5">
      {locales.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={`rounded px-2 py-1 text-xs font-medium transition ${
            locale === value
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
          aria-label={`Language: ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
