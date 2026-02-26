"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MainFlow } from "@/components/MainFlow";
import { useTranslation } from "@/lib/i18n";
import { pathWithLocale } from "@/lib/routing";
import type { Locale } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as Locale) ?? "es";

  return (
    <>
      <MainFlow />
      <section aria-labelledby="what-is-lp-heading" className="mt-10 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
        <h2
          id="what-is-lp-heading"
          className="font-heading text-lg font-semibold tracking-tight text-[var(--foreground)]"
        >
          {t("home.whatIsLpTitle")}
        </h2>
        <div className="mt-3 space-y-3 text-sm text-[var(--muted)] leading-relaxed">
          <p dangerouslySetInnerHTML={{ __html: t("home.whatIsLpP1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("home.whatIsLpP2") }} />
        </div>
      </section>
      <section aria-labelledby="tools-heading" className="mt-10 border-t border-[var(--card-border)] pt-8">
        <h2
          id="tools-heading"
          className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          {t("home.title")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: t("home.description") }} />
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          <li>
            <Link
              href={pathWithLocale(locale, "simplex")}
              className="font-medium text-[var(--primary)] underline underline-offset-4 hover:no-underline"
            >
              {t("home.simplexLink")}
            </Link>
            <span className="ml-1 text-[var(--muted)]">{t("home.simplexDesc")}</span>
          </li>
          <li>
            <Link
              href={pathWithLocale(locale, "graphical")}
              className="font-medium text-[var(--primary)] underline underline-offset-4 hover:no-underline"
            >
              {t("home.graphicalLink")}
            </Link>
            <span className="ml-1 text-[var(--muted)]">{t("home.graphicalDesc")}</span>
          </li>
        </ul>
      </section>
    </>
  );
}
