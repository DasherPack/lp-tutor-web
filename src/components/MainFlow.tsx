"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useProblemStore } from "@/store/problemStore";
import { solveGraphical2D, solveGraphical2DProjected } from "@/lib/lp/graphical2d";
import { solveSimplex } from "@/lib/lp/simplex/solveSimplex";
import type { SimplexSession } from "@/lib/lp/simplex/types";
import type { GraphicalRunResult } from "@/store/problemStore";
import { ProblemEditor } from "@/components/lp/ProblemEditor";
import { SimplexStackView } from "@/components/simplex/SimplexStackView";
import { ResultSection } from "@/components/lp/ResultSection";
import { useTranslation } from "@/lib/i18n";
import { translateMessage } from "@/lib/i18n/translateMessage";

/** Chart.js usa canvas; cargar solo en cliente para evitar errores SSR */
const FeasibleChart = dynamic(
  () => import("@/components/graph/FeasibleChart").then((m) => m.FeasibleChart),
  { ssr: false }
);

export function MainFlow() {
  const { t } = useTranslation();
  const problem = useProblemStore((s) => s.problem);
  const setGraphical = useProblemStore((s) => s.setGraphical);
  const setSimplex = useProblemStore((s) => s.setSimplex);

  const [viewMode, setViewMode] = useState<"graphical" | "simplex">("graphical");

  const problemKey = useMemo(
    () => JSON.stringify(problem),
    [problem],
  );

  const derived = useMemo((): {
    graphical: GraphicalRunResult | null;
    simplex: SimplexSession | null;
  } => {
    if (problem.constraints.length === 0) {
      return { graphical: null, simplex: null };
    }

    let graphical: GraphicalRunResult | null = null;
    try {
      if (problem.numVars >= 2) {
        const graphResult =
          problem.numVars === 2
            ? solveGraphical2D(problem)
            : solveGraphical2DProjected(problem);
        graphical = {
          kind: "graphical2d",
          createdAt: new Date().toISOString(),
          status: graphResult.status,
          vertices: graphResult.vertices,
          optimalPoint: graphResult.optimalPoint,
          objectiveValue: graphResult.objectiveValue,
          warnings: graphResult.warnings,
        };
      }
    } catch (err) {
      graphical = {
        kind: "graphical2d",
        createdAt: new Date().toISOString(),
        status: "invalid",
        vertices: [],
        optimalPoint: null,
        objectiveValue: null,
        warnings: [err instanceof Error ? err.message : "mainFlow.errorGraphical"],
      };
    }

    let simplex: SimplexSession | null = null;
    try {
      const session = solveSimplex(problem, {
        bigM: 1e6,
        maxIterations: 80,
        bland: false,
      });
      simplex = { ...session, cursor: 0 };
    } catch (err) {
      simplex = {
        kind: "simplex",
        createdAt: new Date().toISOString(),
        status: "invalid",
        varNames: [],
        bigM: 1e6,
        steps: [],
        cursor: 0,
        solution: null,
        warnings: [err instanceof Error ? err.message : "mainFlow.errorSimplex"],
      };
    }

    return { graphical, simplex };
  }, [problemKey]);

  useEffect(() => {
    setGraphical(derived.graphical);
    setSimplex(derived.simplex);
  }, [derived, setGraphical, setSimplex]);

  const graphical = derived.graphical;
  const simplex = derived.simplex;

  const twoVars = problem.numVars === 2;
  const hasProjection = problem.numVars > 2 && graphical;
  const canShowGraphical =
    graphical &&
    (graphical.vertices.length > 0 ||
      graphical.status === "infeasible" ||
      graphical.status === "maybe_unbounded" ||
      graphical.status === "invalid" ||
      hasProjection);

  return (
    <div className="grid gap-10">
      <section>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {t("mainFlow.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          {t("mainFlow.intro")}
        </p>
        <div className="mt-6">
          <ProblemEditor mode="simplex" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--card-border)] pt-6">
          <span className="text-sm font-medium text-[var(--muted)]">{t("common.view")}:</span>
          <div className="flex rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--muted-bg)] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("graphical")}
              className={`rounded-[var(--radius)] px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "graphical"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t("mainFlow.viewGraphical")}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("simplex")}
              className={`rounded-[var(--radius)] px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === "simplex"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t("mainFlow.viewSimplex")}
            </button>
          </div>
        </div>
      </section>

      <ResultSection problem={problem} graphical={graphical} simplex={simplex} />

      {viewMode === "graphical" && canShowGraphical && (
        <section>
          <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
            {twoVars ? t("mainFlow.regionTitle") : t("mainFlow.projectionTitle")}
          </h2>
          {hasProjection ? (
            <p className="mt-1 text-sm text-[var(--muted)]">{t("mainFlow.projectionHint")}</p>
          ) : null}
          <div className="mt-4">
            {graphical.vertices.length > 0 ? (
              <FeasibleChart
                vertices={graphical.vertices}
                optimalPoint={graphical.optimalPoint}
                objectiveCoeffs={
                  problem.numVars >= 2
                    ? [
                        problem.objective.c[0] ?? 0,
                        problem.objective.c[1] ?? 0,
                      ]
                    : undefined
                }
                objectiveValue={graphical.objectiveValue}
                sense={problem.objective.sense}
              />
            ) : (
              <div className="rounded-[var(--radius-lg)] border border-[var(--warning)]/30 bg-[var(--warning-bg)] p-4">
                <p className="text-sm text-[var(--warning)]">
                  {graphical.status === "infeasible"
                    ? t("mainFlow.infeasible")
                    : hasProjection
                      ? t("mainFlow.projectionEmpty")
                      : t("mainFlow.infeasible")}
                </p>
              </div>
            )}
          </div>
          {graphical.warnings.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--warning)]">
              {graphical.warnings.map((w, i) => (
                <li key={i}>{t(w)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {viewMode === "simplex" && problem.constraints.length > 0 && (
        <section>
          {!simplex ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              {t("mainFlow.calculatingSimplex")}
            </div>
          ) : simplex.steps.length > 0 ? (
            <SimplexStackView session={simplex} />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
              <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
                {t("mainFlow.simplexTitle")}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {t("mainFlow.status")}: <span className="font-medium text-[var(--foreground)]">{t(`status.${simplex.status}`)}</span>
              </p>
              {simplex.warnings.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm text-[var(--warning)]">
                  {simplex.warnings.map((w, i) => (
                    <li key={i}>{translateMessage(w, t)}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
