"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import type { LPProblem, VariableBounds } from "@/lib/lp/types";
import { defaultBoundsForVar, defaultLPProblem2D, migrateProblemToBounds } from "@/lib/lp/types";
import { useProblemStore } from "@/store/problemStore";
import { useTranslation } from "@/lib/i18n";
import { ObjectiveForm } from "@/components/lp/ObjectiveForm";
import { ConstraintForm } from "@/components/lp/ConstraintForm";
import { BoundsForm } from "@/components/lp/BoundsForm";

const variableBoundsSchema = z.object({
  lower: z.number().finite().nullable(),
  upper: z.number().finite().nullable(),
});

function buildSchema(
  t: (key: string, params?: Record<string, string | number>) => string,
) {
  return z
    .object({
      numVars: z.number().int().min(2).max(8),
      objective: z.object({
        sense: z.enum(["max", "min"]),
        c: z.array(z.number().finite()),
      }),
      constraints: z.array(
        z.object({
          a: z.array(z.number().finite()),
          op: z.enum(["<=", ">=", "="]),
          b: z.number().finite(),
        }),
      ),
      bounds: z.array(variableBoundsSchema),
    })
    .superRefine((val, ctx) => {
      if (val.objective.c.length !== val.numVars) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.objectiveCoeffs"),
          path: ["objective", "c"],
        });
      }
      if (val.constraints.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.minConstraints"),
          path: ["constraints"],
        });
      }
      for (let i = 0; i < val.constraints.length; i++) {
        if (val.constraints[i]!.a.length !== val.numVars) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.constraintCoeffs", { i: i + 1, n: val.numVars }),
            path: ["constraints", i, "a"],
          });
        }
      }
      if (val.bounds.length !== val.numVars) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.boundsCount"),
          path: ["bounds"],
        });
      }
      for (let i = 0; i < val.bounds.length; i++) {
        const b = val.bounds[i]!;
        if (b.lower != null && b.upper != null && b.lower > b.upper) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.boundsOrder", { i: i + 1 }),
            path: ["bounds", i],
          });
        }
      }
    });
}

function normalizeDraft(p: LPProblem): LPProblem {
  const migrated = migrateProblemToBounds(p as Parameters<typeof migrateProblemToBounds>[0]);
  const numVars = migrated.numVars;
  const objectiveC = Array.from({ length: numVars }, (_, i) => migrated.objective.c[i] ?? 0);
  const constraints = migrated.constraints.map((c) => ({
    a: Array.from({ length: numVars }, (_, i) => c.a[i] ?? 0),
    op: c.op,
    b: c.b,
  }));
  const bounds: VariableBounds[] = Array.from({ length: numVars }, (_, i) => {
    const b = migrated.bounds[i] ?? defaultBoundsForVar();
    return { lower: b.lower ?? null, upper: b.upper ?? null };
  });
  return {
    numVars,
    objective: { sense: migrated.objective.sense, c: objectiveC },
    constraints: constraints.length > 0 ? constraints : [{ a: Array(numVars).fill(0), op: "<=", b: 0 }],
    bounds,
  };
}

export function ProblemEditor(props: {
  mode?: "graphical2d" | "simplex";
}) {
  const mode = props.mode ?? "simplex";
  const { t } = useTranslation();

  const problem = useProblemStore((s) => s.problem);
  const commitProblem = useProblemStore((s) => s.commitProblem);
  const undo = useProblemStore((s) => s.undo);
  const redo = useProblemStore((s) => s.redo);
  const reset = useProblemStore((s) => s.reset);
  const cursor = useProblemStore((s) => s.cursor);
  const history = useProblemStore((s) => s.history);

  const draftKey = history[cursor]?.createdAt ?? String(cursor);

  const schema = useMemo(() => buildSchema(t), [t]);

  return (
    <ProblemEditorInner
      key={draftKey}
      mode={mode}
      problem={problem}
      schema={schema}
      commitProblem={commitProblem}
      undo={undo}
      redo={redo}
      reset={reset}
      cursor={cursor}
      historyLength={history.length}
    />
  );
}

function ProblemEditorInner(props: {
  mode: "graphical2d" | "simplex";
  problem: LPProblem;
  schema: z.ZodType<LPProblem>;
  commitProblem: (p: LPProblem, label?: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  cursor: number;
  historyLength: number;
}) {
  const { t } = useTranslation();
  const { mode, problem, schema, commitProblem, undo, redo, reset, cursor, historyLength } =
    props;

  const [draft, setDraft] = useState<LPProblem>(() => normalizeDraft(problem));
  const [error, setError] = useState<string | null>(null);
  const [numVarsInput, setNumVarsInput] = useState(() => String(problem.numVars));

  const isGraphicalIncompatible = mode === "graphical2d" && draft.numVars !== 2;

  const applyNumVars = (raw: string) => {
    const parsed = Number(raw.replace(",", ".").trim());
    const numVars = Number.isFinite(parsed)
      ? Math.max(2, Math.min(8, Math.round(parsed)))
      : draft.numVars;
    setNumVarsInput(String(numVars));
    setDraft((prev) =>
      normalizeDraft({
        ...prev,
        numVars,
        objective: {
          ...prev.objective,
          c: Array.from({ length: numVars }, (_, i) => prev.objective.c[i] ?? 0),
        },
        constraints: prev.constraints.map((c) => ({
          ...c,
          a: Array.from({ length: numVars }, (_, i) => c.a[i] ?? 0),
        })),
        bounds: Array.from({ length: numVars }, (_, i) =>
          prev.bounds[i] ?? defaultBoundsForVar(),
        ),
      }),
    );
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-sm font-semibold text-[var(--foreground)]">{t("editor.title")}</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">{t("editor.applyHint")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold hover:bg-[var(--muted-bg)] disabled:opacity-50"
              onClick={undo}
              disabled={cursor <= 0}
            >
              {t("editor.undo")}
            </button>
            <button
              type="button"
              className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold hover:bg-[var(--muted-bg)] disabled:opacity-50"
              onClick={redo}
              disabled={cursor >= historyLength - 1}
            >
              {t("editor.redo")}
            </button>
            <button
              type="button"
              className="rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold hover:bg-[var(--muted-bg)]"
              onClick={() => {
                reset();
                const defaultProblem = normalizeDraft(defaultLPProblem2D());
                setDraft(defaultProblem);
                setNumVarsInput(String(defaultProblem.numVars));
                setError(null);
              }}
            >
              {t("editor.reset")}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-[var(--radius)] border border-[var(--error)]/40 bg-[var(--error-bg)] p-3 text-sm text-[var(--error)]">
            {error}
          </div>
        ) : null}

        {isGraphicalIncompatible ? (
          <div className="mt-4 rounded-[var(--radius)] border border-[var(--warning)]/40 bg-[var(--warning-bg)] p-3 text-sm text-[var(--warning)]">
            {t("editor.graphical2DWarning")}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
              {t("editor.numVarsShort")}
              <input
                className="w-20 rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-2 py-1 text-sm font-mono"
                type="number"
                min={2}
                max={8}
                step={1}
                value={numVarsInput}
                onChange={(e) => setNumVarsInput(e.target.value)}
                onBlur={() => applyNumVars(numVarsInput)}
                aria-label={t("editor.numVars")}
              />
            </label>
          </div>

          <BoundsForm
            numVars={draft.numVars}
            bounds={draft.bounds}
            onChange={(next) => setDraft((prev) => ({ ...prev, bounds: next }))}
          />

          <ObjectiveForm
            sense={draft.objective.sense}
            c={draft.objective.c}
            onChange={(next) =>
              setDraft((prev) => ({
                ...prev,
                objective: { sense: next.sense, c: [...next.c] },
              }))
            }
          />

          <ConstraintForm
            numVars={draft.numVars}
            constraints={draft.constraints}
            onChange={(next) => setDraft((prev) => ({ ...prev, constraints: next }))}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-[var(--radius)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:opacity-50"
              onClick={() => {
                setError(null);
                const parsed = schema.safeParse(draft);
                if (!parsed.success) {
                  setError(parsed.error.issues[0]?.message ?? t("editor.invalidInput"));
                  return;
                }
                commitProblem(parsed.data, t("history.edit"));
              }}
            >
              {t("editor.applyChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

