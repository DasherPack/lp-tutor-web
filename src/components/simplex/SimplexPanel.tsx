"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { translateMessage } from "@/lib/i18n/translateMessage";
import { solveSimplex } from "@/lib/lp/simplex/solveSimplex";
import type { SimplexSession } from "@/lib/lp/simplex/types";
import { useProblemStore } from "@/store/problemStore";
import { StepControls } from "@/components/simplex/StepControls";
import { TableauView } from "@/components/simplex/TableauView";
import { OperationsLog } from "@/components/simplex/OperationsLog";

export function SimplexPanel() {
  const { t } = useTranslation();
  const problem = useProblemStore((s) => s.problem);
  const simplex = useProblemStore((s) => s.simplex as SimplexSession | null);
  const setSimplex = useProblemStore((s) => s.setSimplex);

  const [bigM, setBigM] = useState<number>(1e6);
  const [maxIter, setMaxIter] = useState<number>(50);
  const [bland, setBland] = useState<boolean>(false);

  const step = useMemo(() => {
    if (!simplex) return null;
    return simplex.steps[simplex.cursor] ?? null;
  }, [simplex]);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">{t("simplex.runTitle")}</h2>
            <p className="mt-1 text-xs text-zinc-600">{t("simplex.runHint")}</p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            onClick={() => {
              const session = solveSimplex(problem, {
                bigM,
                maxIterations: maxIter,
                bland,
              });
              setSimplex({ ...session, cursor: 0 });
            }}
          >
            {t("simplex.generateSteps")}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-medium text-zinc-800">
            Big‑M
            <input
              className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm"
              type="number"
              step="any"
              value={bigM}
              onChange={(e) => setBigM(Number(e.target.value))}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-zinc-800">
            {t("simplex.maxIterations")}
            <input
              className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm"
              type="number"
              step={1}
              min={1}
              value={maxIter}
              onChange={(e) => setMaxIter(Math.max(1, Number(e.target.value)))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
            <input
              type="checkbox"
              checked={bland}
              onChange={(e) => setBland(e.target.checked)}
            />
            {t("simplex.blandRule")}
          </label>
        </div>

        {simplex ? (
          <div className="mt-4 grid gap-2 text-sm text-zinc-800">
            <div>
              <span className="font-semibold">{t("simplex.status")}</span>: {t(`status.${simplex.status}`)}
            </div>
            {simplex.solution ? (
              <div className="font-mono text-xs text-zinc-800">
                x = [{simplex.solution.x.map((v) => v.toFixed(6)).join(", ")}], z
                = {simplex.solution.z.toFixed(6)}
              </div>
            ) : null}
            {simplex.warnings.length ? (
              <ul className="list-disc pl-5 text-amber-900">
                {simplex.warnings.map((w, i) => (
                  <li key={i}>{translateMessage(w, t)}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 text-sm text-zinc-700">{t("simplex.generateHint")}</div>
        )}
      </div>

      {simplex && step ? (
        <>
          <StepControls
            cursor={simplex.cursor}
            total={simplex.steps.length}
            onFirst={() => setSimplex({ ...simplex, cursor: 0 })}
            onPrev={() =>
              setSimplex({ ...simplex, cursor: Math.max(0, simplex.cursor - 1) })
            }
            onNext={() =>
              setSimplex({
                ...simplex,
                cursor: Math.min(simplex.steps.length - 1, simplex.cursor + 1),
              })
            }
            onLast={() =>
              setSimplex({ ...simplex, cursor: simplex.steps.length - 1 })
            }
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="grid gap-6">
              <TableauView
                tableau={step.tableauAfter}
                varNames={simplex.varNames}
                basis={step.basisAfter}
                pivot={step.pivot}
              />
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="text-sm font-semibold text-zinc-900">{t("simplex.explanationTitle")}</div>
                <div className="mt-2 text-sm text-zinc-700">{t(step.explanation)}</div>
                {step.pivot ? (
                  <div className="mt-3 text-xs text-zinc-700">
                    {t("simplex.pivotInfo", {
                      row: step.pivot.row + 1,
                      col: step.pivot.col + 1,
                      entering: step.enteringVar ?? "",
                      leaving: step.leavingVar ?? "",
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <OperationsLog operations={step.operations} />
          </div>
        </>
      ) : null}
    </div>
  );
}

