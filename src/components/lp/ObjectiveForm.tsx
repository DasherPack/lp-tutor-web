"use client";

import type { ObjectiveSense } from "@/lib/lp/types";
import { NumberInput } from "@/components/lp/NumberInput";

export function ObjectiveForm(props: {
  sense: ObjectiveSense;
  c: number[];
  onChange: (next: { sense: ObjectiveSense; c: number[] }) => void;
  disabled?: boolean;
}) {
  const { sense, c, onChange, disabled } = props;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-sm font-semibold text-[var(--foreground)]">Función objetivo</h2>
        <select
          className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-sm"
          value={sense}
          onChange={(e) => onChange({ sense: e.target.value as ObjectiveSense, c })}
          disabled={disabled}
          aria-label="Sentido de optimización"
        >
          <option value="max">Maximizar</option>
          <option value="min">Minimizar</option>
        </select>
      </div>

      <div className="grid gap-2">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <div className="text-sm font-medium text-[var(--foreground)] font-mono">z =</div>
          <div className="flex flex-wrap items-center gap-2">
            {c.map((coef, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <NumberInput
                  value={coef}
                  onChange={(v) => {
                    const next = [...c];
                    next[idx] = v;
                    onChange({ sense, c: next });
                  }}
                  className="w-24 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-sm font-mono"
                  disabled={disabled}
                  aria-label={`Coeficiente de x${idx + 1}`}
                />
                <span className="text-sm text-[var(--foreground)] font-mono">
                  x{idx + 1}
                  {idx < c.length - 1 ? " +" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

