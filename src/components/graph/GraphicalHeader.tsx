"use client";

import { useTranslation } from "@/lib/i18n";

export function GraphicalHeader() {
  const { t } = useTranslation();
  return (
    <header className="mb-4">
      <h1
        id="graphical-heading"
        className="font-heading text-2xl font-semibold tracking-tight text-[var(--foreground)]"
      >
        {t("graphical.pageTitle")}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)] max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t("graphical.pageIntro") }} />
    </header>
  );
}
