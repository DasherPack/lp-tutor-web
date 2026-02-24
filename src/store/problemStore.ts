import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LPProblem } from "@/lib/lp/types";
import { defaultLPProblem2D, migrateProblemToBounds } from "@/lib/lp/types";
import type { SimplexSession } from "@/lib/lp/simplex/types";

export type Point2D = { x: number; y: number };

export type ProblemSnapshot = {
  problem: LPProblem;
  createdAt: string;
  label?: string;
};

export type GraphicalRunResult = {
  kind: "graphical2d";
  createdAt: string;
  status: "ok" | "infeasible" | "maybe_unbounded" | "invalid";
  vertices: Point2D[];
  objectiveValue: number | null;
  optimalPoint: Point2D | null;
  warnings: string[];
};

export type ProblemState = {
  problem: LPProblem;
  history: ProblemSnapshot[];
  cursor: number;

  graphical: GraphicalRunResult | null;
  simplex: SimplexSession | null;

  commitProblem: (problem: LPProblem, label?: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;

  clearDerived: () => void;
  setGraphical: (result: GraphicalRunResult | null) => void;
  setSimplex: (session: SimplexSession | null) => void;
};

const STORAGE_NAME = "lp-tutor-v1";

/** Storage seguro para SSR: localStorage solo en cliente; noop en servidor */
function getStorage(): { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void } {
  if (typeof window === "undefined") {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
}

function isSimplexSession(value: unknown): value is SimplexSession {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return v.kind === "simplex";
}

function cloneProblem(problem: LPProblem): LPProblem {
  return structuredClone(problem);
}

function snapshot(problem: LPProblem, label?: string): ProblemSnapshot {
  return {
    problem: cloneProblem(problem),
    createdAt: new Date().toISOString(),
    ...(label ? { label } : {}),
  };
}

const initialProblem = defaultLPProblem2D();
const initialSnapshot = snapshot(initialProblem, "Inicial");

export const useProblemStore = create<ProblemState>()(
  persist(
    (set, get) => ({
      problem: cloneProblem(initialProblem),
      history: [initialSnapshot],
      cursor: 0,

      graphical: null,
      simplex: null,

      commitProblem: (problem, label) => {
        const normalized = migrateProblemToBounds(problem as Parameters<typeof migrateProblemToBounds>[0]);
        const s = snapshot(normalized, label);
        set((state) => {
          const nextHistory = state.history.slice(0, state.cursor + 1);
          nextHistory.push(s);
          return {
            problem: cloneProblem(normalized),
            history: nextHistory,
            cursor: nextHistory.length - 1,
            graphical: null,
            simplex: null,
          };
        });
      },

      undo: () => {
        const { cursor, history } = get();
        if (cursor <= 0) return;
        const nextCursor = cursor - 1;
        const nextProblem = history[nextCursor]?.problem;
        if (!nextProblem) return;
        set({
          cursor: nextCursor,
          problem: cloneProblem(nextProblem),
          graphical: null,
          simplex: null,
        });
      },

      redo: () => {
        const { cursor, history } = get();
        if (cursor >= history.length - 1) return;
        const nextCursor = cursor + 1;
        const nextProblem = history[nextCursor]?.problem;
        if (!nextProblem) return;
        set({
          cursor: nextCursor,
          problem: cloneProblem(nextProblem),
          graphical: null,
          simplex: null,
        });
      },

      reset: () => {
        const p = defaultLPProblem2D();
        const s = snapshot(p, "Reiniciar");
        set({
          problem: cloneProblem(p),
          history: [s],
          cursor: 0,
          graphical: null,
          simplex: null,
        });
      },

      clearDerived: () => set({ graphical: null, simplex: null }),
      setGraphical: (result) => set({ graphical: result }),
      setSimplex: (session) => set({ simplex: session }),
    }),
    {
      name: STORAGE_NAME,
      version: 3,
      getStorage,
      migrate: (persistedState) => {
        const s = persistedState as Partial<ProblemState> & {
          simplex?: unknown;
          graphical?: unknown;
          problem?: unknown;
          history?: Array<{ problem?: unknown }>;
        };
        const migrateProblem = (p: unknown): LPProblem => {
          if (p && typeof p === "object" && "numVars" in p)
            return migrateProblemToBounds(p as Parameters<typeof migrateProblemToBounds>[0]);
          return defaultLPProblem2D();
        };
        const problem = s.problem ? migrateProblem(s.problem) : defaultLPProblem2D();
        const history: ProblemSnapshot[] = Array.isArray(s.history)
          ? s.history.map((snap: { problem?: unknown; createdAt?: string; label?: string }) => ({
              problem: cloneProblem(snap.problem ? migrateProblem(snap.problem) : problem),
              createdAt: snap.createdAt ?? new Date().toISOString(),
              ...(snap.label ? { label: snap.label } : {}),
            }))
          : [snapshot(problem, "Inicial")];
        return {
          ...(s as ProblemState),
          problem: cloneProblem(problem),
          history,
          cursor: Math.min(s.cursor ?? 0, Math.max(0, history.length - 1)),
          graphical: (s.graphical as ProblemState["graphical"]) ?? null,
          simplex: isSimplexSession(s.simplex) ? (s.simplex as SimplexSession) : null,
        };
      },
      partialize: (state) => ({
        problem: state.problem,
        history: state.history,
        cursor: state.cursor,
        graphical: state.graphical,
        simplex: state.simplex,
      }),
    },
  ),
);

