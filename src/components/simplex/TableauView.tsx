"use client";

import { useTranslation } from "@/lib/i18n";

import type { Pivot, Tableau } from "@/lib/lp/simplex/types";

function fmt(x: number): string {
  if (!Number.isFinite(x)) return String(x);
  const ax = Math.abs(x);
  if (ax !== 0 && (ax < 1e-6 || ax > 1e6)) return x.toExponential(4);
  return x.toFixed(4).replace(/\.?0+$/, "");
}

export function TableauView(props: {
  tableau: Tableau;
  varNames: string[];
  basis: number[];
  pivot: Pivot | null;
}) {
  const { t } = useTranslation();
  const { tableau, varNames, basis, pivot } = props;
  const m = tableau.length - 1;
  const lastCol = tableau[0]?.length ? tableau[0].length - 1 : 0;
  const basisSet = new Set(basis);

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="font-heading text-sm font-semibold text-[var(--foreground)]">{t("simplex.tableauTitle")}</div>
      <table className="mt-3 w-full border-collapse text-xs font-mono">
        <thead>
          <tr className="text-left text-[var(--muted)]">
            <th className="border-b-2 border-[var(--card-border)] bg-[var(--muted-bg)] px-2 py-2 font-semibold">{t("simplex.base")}</th>
            {varNames.map((v, j) => (
              <th
                key={j}
                className={`border-b-2 border-[var(--card-border)] px-2 py-2 ${basisSet.has(j) ? "bg-[var(--muted-bg)]" : ""}`}
              >
                {v}
              </th>
            ))}
            <th className="border-b-2 border-[var(--card-border)] bg-[var(--muted-bg)] px-2 py-2">{t("simplex.rhs")}</th>
          </tr>
        </thead>
        <tbody>
          {tableau.map((row, i) => {
            const isObj = i === m;
            const baseName = isObj
              ? "z"
              : varNames[basis[i] ?? -1] ?? `col${basis[i]}`;

            return (
              <tr
                key={i}
                className={isObj ? "bg-[var(--muted-bg)]/80 font-semibold" : undefined}
              >
                <td className="border-b border-[var(--card-border)] px-2 py-2 text-[var(--foreground)]">
                  {baseName}
                </td>
                {row.slice(0, lastCol).map((val, j) => {
                  const isPivotCell = pivot && pivot.row === i && pivot.col === j;
                  const inPivotCol = pivot && pivot.col === j;
                  const inPivotRow = pivot && pivot.row === i;
                  const inBasis = basisSet.has(j);
                  const bg = isPivotCell
                    ? "bg-[var(--primary)]/20"
                    : inPivotCol || inPivotRow
                      ? "bg-[var(--primary)]/8"
                      : inBasis
                        ? "bg-[var(--muted-bg)]"
                        : "";
                  return (
                    <td
                      key={j}
                      className={`border-b border-[var(--card-border)] px-2 py-2 text-right text-[var(--foreground)] ${bg}`}
                    >
                      {fmt(val)}
                    </td>
                  );
                })}
                <td
                  className={`border-b border-[var(--card-border)] px-2 py-2 text-right ${
                    pivot && pivot.row === i ? "bg-[var(--primary)]/8" : ""
                  }`}
                >
                  {fmt(row[lastCol] ?? 0)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

