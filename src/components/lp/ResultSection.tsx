"use client";

import type { LPProblem } from "@/lib/lp/types";
import type { GraphicalRunResult } from "@/store/problemStore";
import type { SimplexSession } from "@/lib/lp/simplex/types";

export function ResultSection(props: {
  problem: LPProblem;
  graphical: GraphicalRunResult | null;
  simplex: SimplexSession | null;
}) {
  const { problem, graphical, simplex } = props;

  const solution = simplex?.solution ?? null;
  const status = simplex?.status ?? graphical?.status ?? null;
  const hasResult = status === "optimal" && (solution || (graphical?.optimalPoint && graphical?.objectiveValue != null));

  if (!status && !graphical && !simplex) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
      <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">Resultado</h2>
      <div className="mt-4 grid gap-3 text-sm">
        <div>
          <span className="font-medium text-[var(--muted)]">Estado: </span>
          <span className="font-semibold text-[var(--foreground)]">{status ?? "—"}</span>
        </div>
        {hasResult && solution && (
          <>
            <div className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] p-4 font-mono text-[var(--foreground)]">
              <div className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Valor óptimo</div>
              <div className="mt-1 text-lg font-semibold">
                z* = {solution.z.toFixed(6)}
              </div>
              <div className="mt-3 font-heading text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Solución</div>
              <div className="mt-1">
                x* = ({solution.x.map((v) => v.toFixed(6)).join(", ")})
              </div>
              <div className="mt-2 text-xs text-[var(--muted)]">
                {solution.x.map((v, i) => `x${i + 1}* = ${v.toFixed(6)}`).join("; ")}
              </div>
            </div>
          </>
        )}
        {hasResult && !solution && graphical?.optimalPoint && graphical?.objectiveValue != null && (
          <div className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--muted-bg)] p-4 font-mono text-[var(--foreground)]">
            <div className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Valor óptimo</div>
            <div className="mt-1 text-lg font-semibold">z* = {graphical.objectiveValue.toFixed(6)}</div>
            <div className="mt-3 font-heading text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Solución (2D)</div>
            <div className="mt-1">
              x₁* = {graphical.optimalPoint.x.toFixed(6)}, x₂* = {graphical.optimalPoint.y.toFixed(6)}
            </div>
          </div>
        )}
        {status === "infeasible" && (
          <p className="text-[var(--warning)]">El problema no tiene solución factible.</p>
        )}
        {status === "unbounded" && (
          <p className="text-[var(--warning)]">El problema es no acotado.</p>
        )}
      </div>
    </div>
  );
}
