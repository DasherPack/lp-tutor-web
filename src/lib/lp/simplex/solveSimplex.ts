import type { LPProblem } from "@/lib/lp/types";
import { defaultBoundsForVar, EPS } from "@/lib/lp/types";
import type {
  Pivot,
  SimplexSession,
  SimplexSolution,
  SimplexStatus,
  SimplexStep,
  Tableau,
} from "@/lib/lp/simplex/types";

type StandardForm = {
  tableau: Tableau; // (m + 1) x (nVars + 1); last row is objective, last col is RHS
  varNames: string[];
  basis: number[]; // length m, column index per constraint row
  artificialCols: Set<number>;
  originalSense: "max" | "min";
  canonicalizationOps: string[];
};

function cloneTableau(t: Tableau): Tableau {
  return t.map((r) => [...r]);
}

function cloneBasis(b: number[]): number[] {
  return [...b];
}

function isFiniteNumber(x: number): boolean {
  return Number.isFinite(x) && !Number.isNaN(x);
}

function fmt(x: number): string {
  if (!Number.isFinite(x)) return String(x);
  const ax = Math.abs(x);
  if (ax !== 0 && (ax < 1e-6 || ax > 1e6)) return x.toExponential(6);
  return x.toFixed(6).replace(/\.?0+$/, "");
}

function pivotGaussJordan(
  tableau: Tableau,
  pivot: Pivot,
  operations: string[],
): void {
  const m = tableau.length - 1;
  const lastCol = tableau[0]!.length - 1;

  const p = tableau[pivot.row]![pivot.col]!;
  if (Math.abs(p) < EPS) return;

  // Normalize pivot row
  if (Math.abs(p - 1) > EPS) {
    for (let j = 0; j <= lastCol; j++) {
      tableau[pivot.row]![j] = tableau[pivot.row]![j]! / p;
    }
    operations.push(`R${pivot.row + 1} <- R${pivot.row + 1} / ${fmt(p)}`);
  }

  // Eliminate pivot column in other rows (including objective)
  for (let i = 0; i <= m; i++) {
    if (i === pivot.row) continue;
    const factor = tableau[i]![pivot.col]!;
    if (Math.abs(factor) < EPS) continue;
    for (let j = 0; j <= lastCol; j++) {
      tableau[i]![j] = tableau[i]![j]! - factor * tableau[pivot.row]![j]!;
    }
    const rName = i === m ? "Rz" : `R${i + 1}`;
    operations.push(`${rName} <- ${rName} - (${fmt(factor)})*R${pivot.row + 1}`);
  }
}

function chooseEnteringCol(objectiveRow: number[], bland: boolean): number | null {
  const lastCol = objectiveRow.length - 1;
  let bestCol: number | null = null;
  let bestVal = 0;
  for (let j = 0; j < lastCol; j++) {
    const v = objectiveRow[j]!;
    if (v < -EPS) {
      if (bestCol === null) {
        bestCol = j;
        bestVal = v;
      } else if (!bland && v < bestVal - EPS) {
        bestCol = j;
        bestVal = v;
      } else if (bland && j < bestCol) {
        bestCol = j;
        bestVal = v;
      }
    }
  }
  return bestCol;
}

function chooseLeavingRow(tableau: Tableau, enteringCol: number): number | null {
  const m = tableau.length - 1;
  const lastCol = tableau[0]!.length - 1;
  let bestRow: number | null = null;
  let bestRatio = 0;

  for (let i = 0; i < m; i++) {
    const a = tableau[i]![enteringCol]!;
    const rhs = tableau[i]![lastCol]!;
    if (a > EPS) {
      const ratio = rhs / a;
      if (bestRow === null || ratio < bestRatio - EPS || (Math.abs(ratio - bestRatio) <= EPS && i < bestRow)) {
        bestRow = i;
        bestRatio = ratio;
      }
    }
  }
  return bestRow;
}

function extractSolution(
  std: StandardForm,
  originalNumVars: number,
): SimplexSolution {
  const tableau = std.tableau;
  const m = tableau.length - 1;
  const lastCol = tableau[0]!.length - 1;

  const x = Array.from({ length: originalNumVars }, () => 0);
  for (let i = 0; i < m; i++) {
    const basicCol = std.basis[i]!;
    if (basicCol >= 0 && basicCol < originalNumVars) {
      x[basicCol] = tableau[i]![lastCol]!;
    }
  }

  const transformedZ = tableau[m]![lastCol]!;
  const z = std.originalSense === "min" ? -transformedZ : transformedZ;
  return { x, z };
}

function hasInfeasibleArtificial(std: StandardForm): boolean {
  const tableau = std.tableau;
  const m = tableau.length - 1;
  const lastCol = tableau[0]!.length - 1;
  for (let i = 0; i < m; i++) {
    const basicCol = std.basis[i]!;
    if (std.artificialCols.has(basicCol)) {
      const v = tableau[i]![lastCol]!;
      if (v > EPS) return true;
    }
  }
  return false;
}

/** Convierte cotas de variables en restricciones explícitas (x_i ≥ l, x_i ≤ u). */
function expandBoundsToConstraints(problem: LPProblem): LPProblem {
  const n = problem.numVars;
  const extra = [];
  for (let i = 0; i < n; i++) {
    const b = problem.bounds?.[i] ?? defaultBoundsForVar();
    if (b.lower != null) {
      const a = Array.from({ length: n }, (_, j) => (j === i ? 1 : 0));
      extra.push({ a, op: ">=" as const, b: b.lower });
    }
    if (b.upper != null) {
      const a = Array.from({ length: n }, (_, j) => (j === i ? 1 : 0));
      extra.push({ a, op: "<=" as const, b: b.upper });
    }
  }
  if (extra.length === 0) return problem;
  return {
    ...problem,
    constraints: [...problem.constraints, ...extra],
  };
}

function standardFormBigM(problem: LPProblem, bigM: number): StandardForm | null {
  const problemExpanded = expandBoundsToConstraints(problem);
  const n = problemExpanded.numVars;
  if (!Number.isInteger(n) || n < 2 || n > 8) return null;
  if (problemExpanded.objective.c.length !== n) return null;

  const m = problemExpanded.constraints.length;
  if (m < 1) return null;

  const varNames: string[] = [];
  for (let j = 0; j < n; j++) varNames.push(`x${j + 1}`);

  const rows: Array<{ a: number[]; rhs: number; op: "<=" | ">=" | "=" }> = [];
  for (const c of problemExpanded.constraints) {
    if (c.a.length !== n) return null;
    if (!c.a.every(isFiniteNumber) || !isFiniteNumber(c.b)) return null;
    let a = [...c.a];
    let rhs = c.b;
    let op = c.op;
    if (rhs < 0) {
      rhs = -rhs;
      a = a.map((v) => -v);
      if (op === "<=") op = ">=";
      else if (op === ">=") op = "<=";
    }
    rows.push({ a, rhs, op });
  }

  // Count auxiliary vars
  const slackCols: number[] = [];
  const surplusCols: number[] = [];
  const artificialCols: number[] = [];

  for (let i = 0; i < m; i++) {
    const op = rows[i]!.op;
    if (op === "<=") {
      slackCols.push(varNames.length);
      varNames.push(`s${slackCols.length}`);
    } else if (op === ">=") {
      surplusCols.push(varNames.length);
      varNames.push(`e${surplusCols.length}`);
      artificialCols.push(varNames.length);
      varNames.push(`a${artificialCols.length}`);
    } else {
      artificialCols.push(varNames.length);
      varNames.push(`a${artificialCols.length}`);
    }
  }

  const totalVars = varNames.length;
  const lastCol = totalVars; // RHS
  const tableau: Tableau = Array.from({ length: m + 1 }, () =>
    Array.from({ length: totalVars + 1 }, () => 0),
  );
  const basis: number[] = Array.from({ length: m }, () => -1);
  const artificialSet = new Set<number>(artificialCols);

  // Fill constraint rows
  let slackIdx = 0;
  let surplusIdx = 0;
  let artificialIdx = 0;
  for (let i = 0; i < m; i++) {
    const r = rows[i]!;
    for (let j = 0; j < n; j++) tableau[i]![j] = r.a[j]!;
    tableau[i]![lastCol] = r.rhs;

    if (r.op === "<=") {
      const col = slackCols[slackIdx++]!;
      tableau[i]![col] = 1;
      basis[i] = col;
    } else if (r.op === ">=") {
      const eCol = surplusCols[surplusIdx++]!;
      tableau[i]![eCol] = -1;
      const aCol = artificialCols[artificialIdx++]!;
      tableau[i]![aCol] = 1;
      basis[i] = aCol;
    } else {
      const aCol = artificialCols[artificialIdx++]!;
      tableau[i]![aCol] = 1;
      basis[i] = aCol;
    }
  }

  // Objective row: z - c^T x - M * sum(artificial) = 0 (for max)
  const originalSense = problemExpanded.objective.sense;
  const cForMax =
    originalSense === "max"
      ? problemExpanded.objective.c
      : problemExpanded.objective.c.map((v) => -v);

  const objRow = tableau[m]!;
  for (let j = 0; j < n; j++) objRow[j] = -cForMax[j]!;
  for (const col of artificialCols) objRow[col] = -bigM;
  objRow[lastCol] = 0;

  // Canonicalize objective row w.r.t. initial basis
  const operations: string[] = [];
  for (let i = 0; i < m; i++) {
    const basicCol = basis[i]!;
    const factor = objRow[basicCol]!;
    if (Math.abs(factor) < EPS) continue;
    for (let j = 0; j <= lastCol; j++) {
      objRow[j] = objRow[j]! - factor * tableau[i]![j]!;
    }
    operations.push(`Rz <- Rz - (${fmt(factor)})*R${i + 1}`);
  }

  return {
    tableau,
    varNames,
    basis,
    artificialCols: artificialSet,
    originalSense,
    canonicalizationOps: operations,
  };
}

export function solveSimplex(problem: LPProblem, opts?: {
  bigM?: number;
  maxIterations?: number;
  bland?: boolean;
}): SimplexSession {
  const bigM = opts?.bigM ?? 1e6;
  const maxIterations = opts?.maxIterations ?? 50;
  const bland = opts?.bland ?? false;

  const createdAt = new Date().toISOString();

  const std = standardFormBigM(problem, bigM);
  if (!std) {
    return {
      kind: "simplex",
      createdAt,
      status: "invalid",
      varNames: [],
      bigM,
      steps: [],
      cursor: 0,
      solution: null,
      warnings: ["simplex.warnings.invalidProblem"],
    };
  }

  const steps: SimplexStep[] = [];
  const warnings: string[] = [];

  // Step 0: initial tableau
  steps.push({
    index: 0,
    pivot: null,
    enteringVar: null,
    leavingVar: null,
    basisBefore: cloneBasis(std.basis),
    basisAfter: cloneBasis(std.basis),
    tableauBefore: cloneTableau(std.tableau),
    tableauAfter: cloneTableau(std.tableau),
    operations: std.canonicalizationOps,
    explanation: "simplex.explanations.initialTableau",
  });

  let status: SimplexStatus = "iteration_limit";

  for (let iter = 1; iter <= maxIterations; iter++) {
    const m = std.tableau.length - 1;
    const objRow = std.tableau[m]!;

    const enteringCol = chooseEnteringCol(objRow, bland);
    if (enteringCol == null) {
      status = "optimal";
      break;
    }

    const leavingRow = chooseLeavingRow(std.tableau, enteringCol);
    if (leavingRow == null) {
      status = "unbounded";
      steps.push({
        index: iter,
        pivot: null,
        enteringVar: std.varNames[enteringCol] ?? `col${enteringCol}`,
        leavingVar: null,
        basisBefore: cloneBasis(std.basis),
        basisAfter: cloneBasis(std.basis),
        tableauBefore: cloneTableau(std.tableau),
        tableauAfter: cloneTableau(std.tableau),
        operations: [],
        explanation: "simplex.explanations.unbounded",
      });
      break;
    }

    const pivot: Pivot = { row: leavingRow, col: enteringCol };
    const leavingCol = std.basis[leavingRow]!;
    const enteringVar = std.varNames[enteringCol] ?? `col${enteringCol}`;
    const leavingVar = std.varNames[leavingCol] ?? `col${leavingCol}`;

    const tableauBefore = cloneTableau(std.tableau);
    const basisBefore = cloneBasis(std.basis);
    const operations: string[] = [];

    pivotGaussJordan(std.tableau, pivot, operations);
    std.basis[leavingRow] = enteringCol;

    const tableauAfter = cloneTableau(std.tableau);
    const basisAfter = cloneBasis(std.basis);

    steps.push({
      index: iter,
      pivot,
      enteringVar,
      leavingVar,
      basisBefore,
      basisAfter,
      tableauBefore,
      tableauAfter,
      operations,
      explanation: "simplex.explanations.pivotStep",
    });
  }

  let solution: SimplexSolution | null = null;
  if (status === "optimal") {
    if (hasInfeasibleArtificial(std)) {
      status = "infeasible";
    } else {
      solution = extractSolution(std, problem.numVars);
    }
  }

  if (status === "iteration_limit") {
    warnings.push({ key: "simplex.warnings.iterationLimit", params: { max: maxIterations } });
  }
  if (status === "infeasible") {
    warnings.push("simplex.warnings.infeasible");
  }

  return {
    kind: "simplex",
    createdAt,
    status,
    varNames: std.varNames,
    bigM,
    steps,
    cursor: 0,
    solution,
    warnings,
  };
}

