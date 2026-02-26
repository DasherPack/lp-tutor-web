"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { pathWithLocale } from "@/lib/routing";
import type { Locale } from "@/lib/i18n";

const locales: { value: Locale; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },
  { value: "ja", label: "JA" },
  { value: "zh", label: "中文" },
];

/** Obtiene el path interno (sin locale) desde pathname: /es/simplex → simplex */
function getInnerPath(pathname: string, locale: Locale): string {
  const prefix = `/${locale}`;
  if (pathname === prefix || pathname === `${prefix}/`) return "";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length + 1);
  return "";
}

export function LocaleSelector({ locale }: { locale: Locale }) {
  const { locale: currentLocale, setLocale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const innerPath = getInnerPath(pathname, locale);

  const handleSelect = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    setLocale(newLocale);
    const newPath = pathWithLocale(newLocale, innerPath);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] p-0.5">
      {locales.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleSelect(value)}
          className={`rounded px-2 py-1 text-xs font-medium transition ${
            currentLocale === value
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
