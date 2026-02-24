"use client";

import type { LPProblem } from "@/lib/lp/types";

function boundStr(lower: number | null, upper: number | null, varLabel: string): string {
  const l = lower === null ? "−∞" : String(lower);
  const u = upper === null ? "+∞" : String(upper);
  return `${l} ≤ ${varLabel} ≤ ${u}`;
}

export function ProblemSummary(props: { problem: LPProblem }) {
  const { problem } = props;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-zinc-900">Resumen</h2>
      <div className="mt-3 grid gap-2 text-sm text-zinc-800">
        <div>
          <span className="font-semibold">Variables</span>: {problem.numVars}
        </div>
        <div>
          <span className="font-semibold">Cotas</span>:{" "}
          {problem.bounds
            ?.slice(0, problem.numVars)
            .map((b, i) => boundStr(b.lower, b.upper, `x${i + 1}`))
            .join("; ") ?? "—"}
        </div>
        <div className="mt-2 rounded-xl bg-zinc-50 p-3 font-mono text-xs text-zinc-800">
          <div>
            {problem.objective.sense} z ={" "}
            {problem.objective.c
              .map((coef, idx) => `${coef}·x${idx + 1}`)
              .join(" + ")}
          </div>
          <div className="mt-2 grid gap-1">
            {problem.constraints.map((c, i) => (
              <div key={i}>
                {c.a.map((coef, idx) => `${coef}·x${idx + 1}`).join(" + ")}{" "}
                {c.op} {c.b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

