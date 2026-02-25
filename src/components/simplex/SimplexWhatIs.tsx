"use client";

import { useTranslation } from "@/lib/i18n";

export function SimplexWhatIs() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="what-is-simplex-heading" className="mb-8">
      <details className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
        <summary
          id="what-is-simplex-heading"
          className="cursor-pointer list-none px-4 py-3 font-heading text-sm font-semibold text-[var(--foreground)] [&::-webkit-details-marker]:hidden"
        >
          {t("simplex.whatIsTitle")}
        </summary>
        <div className="border-t border-[var(--card-border)] px-4 py-3 text-sm text-[var(--muted)] leading-relaxed space-y-3">
          <p dangerouslySetInnerHTML={{ __html: t("simplex.whatIsP1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("simplex.whatIsP2") }} />
          <p dangerouslySetInnerHTML={{ __html: t("simplex.whatIsP3") }} />
          <p dangerouslySetInnerHTML={{ __html: t("simplex.whatIsP4") }} />
        </div>
      </details>
    </section>
  );
}
