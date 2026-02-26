"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

export function GraphicalHeader() {
  const { t } = useTranslation();
  return (
    <header className="mb-4">
      <Link href="/" className="mb-3 inline-block" title="dalsegno">
        <Image src="/dalsegno-logo.svg" alt="dalsegno" width={90} height={27} className="h-6 w-auto opacity-80" />
      </Link>
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
