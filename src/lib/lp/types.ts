export type ObjectiveSense = "max" | "min";
export type ConstraintOp = "<=" | ">=" | "=";

export type Objective = {
  sense: ObjectiveSense;
  c: number[];
};

export type Constraint = {
  a: number[];
  op: ConstraintOp;
  b: number;
};

/** Cota inferior y/o superior por variable. null = sin cota. */
export type VariableBounds = {
  lower: number | null;
  upper: number | null;
};

export type LPProblem = {
  numVars: number;
  objective: Objective;
  constraints: Constraint[];
  /** Por defecto: lower 0, upper null (x_i ≥ 0 sin cota superior). */
  bounds: VariableBounds[];
};

export const EPS = 1e-9;

export function defaultBoundsForVar(): VariableBounds {
  return { lower: 0, upper: null };
}

export function defaultLPProblem2D(): LPProblem {
  return {
    numVars: 2,
    objective: { sense: "max", c: [3, 2] },
    constraints: [
      { a: [1, 1], op: "<=", b: 4 },
      { a: [1, 0], op: "<=", b: 2 },
      { a: [0, 1], op: "<=", b: 3 },
    ],
    bounds: [
      defaultBoundsForVar(),
      defaultBoundsForVar(),
    ],
  };
}

/** Convierte problema antiguo (nonNegativity) a forma con bounds. */
export function migrateProblemToBounds(p: {
  numVars: number;
  objective: Objective;
  constraints: Constraint[];
  nonNegativity?: boolean;
  bounds?: VariableBounds[];
}): LPProblem {
  if (p.bounds != null && Array.isArray(p.bounds) && p.bounds.length === p.numVars) {
    return {
      numVars: p.numVars,
      objective: p.objective,
      constraints: p.constraints,
      bounds: p.bounds.map((b) => ({
        lower: b.lower ?? null,
        upper: b.upper ?? null,
      })),
    };
  }
  const defaultLower = p.nonNegativity !== false ? 0 : null;
  const bounds: VariableBounds[] = Array.from({ length: p.numVars }, () => ({
    lower: defaultLower,
    upper: null,
  }));
  return {
    numVars: p.numVars,
    objective: p.objective,
    constraints: p.constraints,
    bounds,
  };
}

