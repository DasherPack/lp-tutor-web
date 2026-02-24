"use client";

import type { Constraint, ConstraintOp } from "@/lib/lp/types";
import { NumberInput } from "@/components/lp/NumberInput";

const OPS: Array<{ value: ConstraintOp; label: string }> = [
  { value: "<=", label: "≤" },
  { value: ">=", label: "≥" },
  { value: "=", label: "=" },
];

export function ConstraintForm(props: {
  numVars: number;
  constraints: Constraint[];
  onChange: (next: Constraint[]) => void;
  disabled?: boolean;
}) {
  const { numVars, constraints, onChange, disabled } = props;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-sm font-semibold text-[var(--foreground)]">Restricciones</h2>
        <button
          type="button"
          className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-sm font-semibold hover:bg-[var(--muted-bg)]"
          onClick={() =>
            onChange([
              ...constraints,
              { a: Array.from({ length: numVars }, () => 0), op: "<=", b: 0 },
            ])
          }
          disabled={disabled}
        >
          Añadir
        </button>
      </div>

      <div className="grid gap-2">
        {constraints.map((c, rowIdx) => (
          <div
            key={rowIdx}
            className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: numVars }).map((_, colIdx) => (
                <div key={colIdx} className="flex items-center gap-2">
                  <NumberInput
                    value={c.a[colIdx] ?? 0}
                    onChange={(v) => {
                      const next = constraints.map((r) => ({
                        a: [...r.a],
                        op: r.op,
                        b: r.b,
                      }));
                      next[rowIdx]!.a[colIdx] = v;
                      onChange(next);
                    }}
                    className="w-24 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-sm font-mono"
                    disabled={disabled}
                    aria-label={`Restricción ${rowIdx + 1}, coeficiente de x${colIdx + 1}`}
                  />
                  <span className="text-sm text-[var(--foreground)] font-mono">
                    x{colIdx + 1}
                    {colIdx < numVars - 1 ? " +" : ""}
                  </span>
                </div>
              ))}

              <select
                className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-sm"
                value={c.op}
                onChange={(e) => {
                  const next = constraints.map((r) => ({
                    a: [...r.a],
                    op: r.op,
                    b: r.b,
                  }));
                  next[rowIdx]!.op = e.target.value as ConstraintOp;
                  onChange(next);
                }}
                disabled={disabled}
                aria-label={`Restricción ${rowIdx + 1}, operador`}
              >
                {OPS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              <NumberInput
                value={c.b}
                onChange={(v) => {
                  const next = constraints.map((r) => ({
                    a: [...r.a],
                    op: r.op,
                    b: r.b,
                  }));
                  next[rowIdx]!.b = v;
                  onChange(next);
                }}
                className="w-28 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-sm font-mono"
                disabled={disabled}
                aria-label={`Restricción ${rowIdx + 1}, término independiente`}
              />

              <button
                type="button"
                className="ml-auto rounded-[var(--radius)] px-2 py-1 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                onClick={() => onChange(constraints.filter((_, i) => i !== rowIdx))}
                disabled={disabled || constraints.length <= 1}
                aria-label={`Eliminar restricción ${rowIdx + 1}`}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

