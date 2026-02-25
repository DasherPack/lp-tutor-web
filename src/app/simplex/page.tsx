"use client";

import Link from "next/link";
import { MainFlow } from "@/components/MainFlow";
import { useTranslation } from "@/lib/i18n";

export default function SimplexPage() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-semibold text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
        >
          {t("common.backHome")}
        </Link>
      </div>
      <MainFlow />
    </div>
  );
}
