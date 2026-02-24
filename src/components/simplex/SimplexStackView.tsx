"use client";

import type { SimplexSession, SimplexStep } from "@/lib/lp/simplex/types";
import { TableauView } from "@/components/simplex/TableauView";
import { OperationsLog } from "@/components/simplex/OperationsLog";

export function SimplexStackView(props: { session: SimplexSession }) {
  const { session } = props;

  return (
    <div className="grid gap-8">
      <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
        <h2 className="font-heading text-lg font-semibold text-[var(--foreground)]">
          Método Simplex — Todas las iteraciones
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Estado: <span className="font-medium text-[var(--foreground)]">{session.status}</span>
          {session.solution
            ? ` · z = ${session.solution.z.toFixed(6)}`
            : null}
        </p>
        {session.warnings.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-[var(--warning)]">
            {session.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {session.steps.map((step: SimplexStep, k: number) => (
        <div
          key={step.index}
          className="grid gap-4 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--muted-bg)]/60 p-4"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[var(--card-border)] pb-2">
            <span className="font-heading font-semibold text-[var(--foreground)]">
              Iteración {step.index}
            </span>
            {step.pivot ? (
              <span className="text-xs font-mono text-[var(--muted)]">
                Pivote: fila {step.pivot.row + 1}, columna {step.pivot.col + 1}{" "}
                ({step.enteringVar} entra, {step.leavingVar} sale)
              </span>
            ) : null}
          </div>
          <p className="text-sm text-[var(--foreground)]">{step.explanation}</p>
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <TableauView
              tableau={step.tableauAfter}
              varNames={session.varNames}
              basis={step.basisAfter}
              pivot={step.pivot}
            />
            <OperationsLog operations={step.operations} />
          </div>
        </div>
      ))}
    </div>
  );
}
