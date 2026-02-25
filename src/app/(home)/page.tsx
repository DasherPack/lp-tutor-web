"use client";

import Link from "next/link";
import { MainFlow } from "@/components/MainFlow";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <MainFlow />
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
              href="/simplex"
              className="font-medium text-[var(--primary)] underline underline-offset-4 hover:no-underline"
            >
              {t("home.simplexLink")}
            </Link>
            <span className="ml-1 text-[var(--muted)]">{t("home.simplexDesc")}</span>
          </li>
          <li>
            <Link
              href="/graphical"
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
