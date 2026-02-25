"use client";

import type { VariableBounds } from "@/lib/lp/types";
import { useTranslation } from "@/lib/i18n";

function parseBound(value: string): number | null {
  const t = value.replace(",", ".").trim();
  if (t === "" || t === "-" || t === "−") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function BoundsForm(props: {
  numVars: number;
  bounds: VariableBounds[];
  onChange: (next: VariableBounds[]) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { numVars, bounds, onChange, disabled } = props;

  const update = (index: number, field: "lower" | "upper", value: number | null) => {
    const next = bounds.map((b, i) =>
      i === index ? { ...b, [field]: value } : b,
    );
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      <h2 className="font-heading text-sm font-semibold text-[var(--foreground)]">
        {t("bounds.title")}
      </h2>
      <p className="text-xs text-[var(--muted)]">{t("bounds.hint")}</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: numVars }).map((_, i) => {
          const b = bounds[i] ?? { lower: null, upper: null };
          const lowerStr = b.lower === null ? "" : String(b.lower);
          const upperStr = b.upper === null ? "" : String(b.upper);
          return (
            <div
              key={i}
              className="flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] p-2"
            >
              <label className="sr-only">{t("bounds.lower", { i: i + 1 })}</label>
              <input
                type="text"
                inputMode="decimal"
                className="w-16 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] px-2 py-1 text-sm font-mono placeholder:text-[var(--muted)]"
                placeholder={t("bounds.placeholderLower")}
                value={lowerStr}
                onChange={(e) => update(i, "lower", parseBound(e.target.value))}
                disabled={disabled}
                aria-label={t("bounds.lower", { i: i + 1 })}
              />
              <span className="text-[var(--muted)]">≤</span>
              <span className="text-sm font-mono font-medium text-[var(--foreground)]">
                x{i + 1}
              </span>
              <span className="text-[var(--muted)]">≤</span>
              <label className="sr-only">{t("bounds.upper", { i: i + 1 })}</label>
              <input
                type="text"
                inputMode="decimal"
                className="w-16 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] px-2 py-1 text-sm font-mono placeholder:text-[var(--muted)]"
                placeholder={t("bounds.placeholderUpper")}
                value={upperStr}
                onChange={(e) => update(i, "upper", parseBound(e.target.value))}
                disabled={disabled}
                aria-label={t("bounds.upper", { i: i + 1 })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
