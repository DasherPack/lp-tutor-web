"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MainFlow } from "@/components/MainFlow";
import { useTranslation } from "@/lib/i18n";
import { pathWithLocale } from "@/lib/routing";
import type { Locale } from "@/lib/i18n";

export default function GraphicalPage() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as Locale) ?? "es";

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={pathWithLocale(locale, "")}
          className="text-sm font-semibold text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
        >
          {t("common.backHome")}
        </Link>
      </div>
      <MainFlow />
    </div>
  );
}
