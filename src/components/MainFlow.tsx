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

/** Chart.js usa canvas; cargar solo en cliente para evitar errores SSR */
const FeasibleChart = dynamic(
  () => import("@/components/graph/FeasibleChart").then((m) => m.FeasibleChart),
  { ssr: false }
);
import { ResultSection } from "@/components/lp/ResultSection";

export function MainFlow() {
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
        warnings: [err instanceof Error ? err.message : "Error en método gráfico."],
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
        warnings: [err instanceof Error ? err.message : "Error al resolver Simplex."],
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
          Plantear el problema
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          Introduce la función objetivo y las restricciones. Con 2 variables se
          mostrará la región factible y el óptimo; con más variables se usará
          Simplex y, si aplica, la proyección sobre x₁, x₂.
        </p>
        <div className="mt-6">
          <ProblemEditor mode="simplex" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--card-border)] pt-6">
          <span className="text-sm font-medium text-[var(--muted)]">Ver:</span>
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
              Método gráfico
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
              Simplex
            </button>
          </div>
        </div>
      </section>

      <ResultSection problem={problem} graphical={graphical} simplex={simplex} />

      {viewMode === "graphical" && canShowGraphical && (
        <section>
          <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
            {twoVars ? "Región factible y óptimo" : "Proyección sobre x₁, x₂"}
          </h2>
          {hasProjection ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              Proyección fijando x₃ = … = xₙ = 0.
            </p>
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
                    ? "No hay región factible (el problema es infactible)."
                    : hasProjection
                      ? "La proyección sobre x₁, x₂ (x₃ = … = 0) no tiene región con área en el plano."
                      : "No hay región factible (el problema es infactible)."}
                </p>
              </div>
            )}
          </div>
          {graphical.warnings.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--warning)]">
              {graphical.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {viewMode === "simplex" && problem.constraints.length > 0 && (
        <section>
          {!simplex ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              Calculando Simplex…
            </div>
          ) : simplex.steps.length > 0 ? (
            <SimplexStackView session={simplex} />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
              <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
                Método Simplex
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Estado: <span className="font-medium text-[var(--foreground)]">{simplex.status}</span>
              </p>
              {simplex.warnings.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm text-[var(--warning)]">
                  {simplex.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
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
