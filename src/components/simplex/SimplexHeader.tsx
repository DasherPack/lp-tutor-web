"use client";

import { useTranslation } from "@/lib/i18n";

export function SimplexHeader() {
  const { t } = useTranslation();
  return (
    <header className="mb-4">
      <h1
        id="simplex-heading"
        className="font-heading text-2xl font-semibold tracking-tight text-[var(--foreground)]"
      >
        {t("simplex.pageTitle")}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)] max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: t("simplex.pageIntro") }} />
    </header>
  );
}
