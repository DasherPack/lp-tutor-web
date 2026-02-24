export type Tableau = number[][];

export type Pivot = {
  row: number;
  col: number;
};

export type SimplexStep = {
  index: number;
  pivot: Pivot | null;
  enteringVar: string | null;
  leavingVar: string | null;
  basisBefore: number[];
  basisAfter: number[];
  tableauBefore: Tableau;
  tableauAfter: Tableau;
  operations: string[];
  explanation: string;
};

export type SimplexStatus =
  | "optimal"
  | "unbounded"
  | "infeasible"
  | "iteration_limit"
  | "invalid";

export type SimplexSolution = {
  x: number[];
  z: number;
};

export type SimplexSession = {
  kind: "simplex";
  createdAt: string;
  status: SimplexStatus;
  varNames: string[];
  bigM: number;
  steps: SimplexStep[];
  cursor: number;
  solution: SimplexSolution | null;
  warnings: string[];
};

