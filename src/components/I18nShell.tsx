"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/seo/site";
import { I18nProvider, useTranslation } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import { StoreHydration } from "@/components/StoreHydration";
import { LocaleSelector } from "@/components/LocaleSelector";
import { LangSync } from "@/components/LangSync";
import { pathWithLocale } from "@/lib/routing";
import type { Locale } from "@/lib/i18n";

function HeaderContent({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--card-border)] bg-[var(--card)]/98 shadow-[var(--shadow-sm)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href={pathWithLocale(locale, "")}
          className="flex items-center gap-2 font-heading text-xl font-semibold tracking-tight text-[var(--foreground)] transition hover:text-[var(--primary)]"
          title="dalsegno"
        >
          <Image
            src="/dalsegno-logo.svg"
            alt="dalsegno"
            width={120}
            height={36}
            className="h-8 w-auto"
            priority
          />
          <span className="sr-only sm:not-sr-only sm:inline">{siteConfig.brandShort}</span>
        </Link>
        <nav className="flex items-center gap-2" aria-label={t("common.nav.main")}>
          <Link
            href={pathWithLocale(locale, "graphical")}
            className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
          >
            {t("common.nav.graphical")}
          </Link>
          <Link
            href={pathWithLocale(locale, "simplex")}
            className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
          >
            {t("common.nav.simplex")}
          </Link>
          <LocaleSelector locale={locale} />
        </nav>
      </div>
    </header>
  );
}

function FooterContent({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card)]">
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-xs text-[var(--muted)]">{t("layout.footer")}</p>
          <Link href={pathWithLocale(locale, "")} className="flex items-center gap-1.5 text-[var(--muted)] transition hover:text-[var(--foreground)]" title="dalsegno">
            <Image src="/dalsegno-logo.svg" alt="dalsegno" width={80} height={24} className="h-5 w-auto opacity-70" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function I18nShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <I18nProvider translations={translations} initialLocale={locale}>
      <LangSync />
      <div className="min-h-dvh flex flex-col">
        <HeaderContent locale={locale} />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <StoreHydration>{children}</StoreHydration>
        </main>
        <FooterContent locale={locale} />
      </div>
    </I18nProvider>
  );
}
