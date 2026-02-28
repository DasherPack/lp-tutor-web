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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    if (newLocale === currentLocale) return;
    setLocale(newLocale);
    const newPath = pathWithLocale(newLocale, innerPath);
    router.push(newPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      aria-label="Select language"
      className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] px-2 py-1 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer"
    >
      {locales.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
