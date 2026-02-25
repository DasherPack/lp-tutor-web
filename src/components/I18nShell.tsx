"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/seo/site";
import { I18nProvider, useTranslation } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import { StoreHydration } from "@/components/StoreHydration";
import { LocaleSelector } from "@/components/LocaleSelector";
import { LangSync } from "@/components/LangSync";

function HeaderContent() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--card-border)] bg-[var(--card)]/98 shadow-[var(--shadow-sm)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)] transition hover:text-[var(--primary)]"
        >
          {siteConfig.brandShort}
        </Link>
        <nav className="flex items-center gap-2" aria-label={t("common.nav.main")}>
          <Link
            href="/graphical"
            className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
          >
            {t("common.nav.graphical")}
          </Link>
          <Link
            href="/simplex"
            className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
          >
            {t("common.nav.simplex")}
          </Link>
          <LocaleSelector />
        </nav>
      </div>
    </header>
  );
}

function FooterContent() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card)]">
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <p className="font-heading text-xs text-[var(--muted)]">{t("layout.footer")}</p>
      </div>
    </footer>
  );
}

export function I18nShell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider translations={translations}>
      <LangSync />
      <div className="min-h-dvh flex flex-col">
        <HeaderContent />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <StoreHydration>{children}</StoreHydration>
        </main>
        <FooterContent />
      </div>
    </I18nProvider>
  );
}
