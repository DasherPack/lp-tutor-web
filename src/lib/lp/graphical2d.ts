import type { Constraint, LPProblem, ObjectiveSense } from "@/lib/lp/types";
import { EPS } from "@/lib/lp/types";

export type Point2D = { x: number; y: number };
export type HalfPlane = { a: number; b: number; c: number }; // a*x + b*y <= c

export type Graphical2DResult = {
  status: "ok" | "infeasible" | "maybe_unbounded" | "invalid";
  vertices: Point2D[];
  optimalPoint: Point2D | null;
  objectiveValue: number | null;
  warnings: string[];
  debug: {
    R: number;
    halfPlanes: HalfPlane[];
  };
};

function isFiniteNumber(x: number): boolean {
  return Number.isFinite(x) && !Number.isNaN(x);
}

function dot2(c: number[], p: Point2D): number {
  return c[0]! * p.x + c[1]! * p.y;
}

function senseCompare(sense: ObjectiveSense, v: number, best: number): boolean {
  return sense === "max" ? v > best + EPS : v < best - EPS;
}

/** Proyecta el problema sobre las dos primeras variables (x3=…=0). */
export function projectTo2D(problem: LPProblem): LPProblem {
  if (problem.numVars <= 2) return problem;
  return {
    numVars: 2,
    objective: {
      sense: problem.objective.sense,
      c: [problem.objective.c[0] ?? 0, problem.objective.c[1] ?? 0],
    },
    constraints: problem.constraints.map((c) => ({
      a: [c.a[0] ?? 0, c.a[1] ?? 0],
      op: c.op,
      b: c.b,
    })),
    bounds: [
      problem.bounds[0] ?? { lower: 0, upper: null },
      problem.bounds[1] ?? { lower: 0, upper: null },
    ],
  };
}

export function solveGraphical2D(problem: LPProblem): Graphical2DResult {
  const warnings: string[] = [];

  if (problem.numVars !== 2) {
    return {
      status: "invalid",
      vertices: [],
      optimalPoint: null,
      objectiveValue: null,
      warnings: ["El método gráfico requiere exactamente 2 variables."],
      debug: { R: 0, halfPlanes: [] },
    };
  }

  const objective = problem.objective.c;
  if (objective.length !== 2 || !objective.every(isFiniteNumber)) {
    return {
      status: "invalid",
      vertices: [],
      optimalPoint: null,
      objectiveValue: null,
      warnings: ["La función objetivo no es válida."],
      debug: { R: 0, halfPlanes: [] },
    };
  }

  const halfPlanes: HalfPlane[] = [];

  const normalizedConstraints: Constraint[] = problem.constraints.map((c) => {
    const a = [c.a[0] ?? 0, c.a[1] ?? 0] as number[];
    let b = c.b;
    let op = c.op;
    if (b < 0) {
      b = -b;
      a[0] = -a[0];
      a[1] = -a[1];
      if (op === "<=") op = ">=";
      else if (op === ">=") op = "<=";
    }
    return { a, op, b };
  });

  for (const c of normalizedConstraints) {
    if (c.a.length !== 2 || !c.a.every(isFiniteNumber) || !isFiniteNumber(c.b)) {
      return {
        status: "invalid",
        vertices: [],
        optimalPoint: null,
        objectiveValue: null,
        warnings: ["Alguna restricción no es válida (coeficientes o b)."],
        debug: { R: 0, halfPlanes: [] },
      };
    }

    if (c.op === "<=") {
      halfPlanes.push({ a: c.a[0]!, b: c.a[1]!, c: c.b });
    } else if (c.op === ">=") {
      halfPlanes.push({ a: -c.a[0]!, b: -c.a[1]!, c: -c.b });
    } else {
      halfPlanes.push({ a: c.a[0]!, b: c.a[1]!, c: c.b });
      halfPlanes.push({ a: -c.a[0]!, b: -c.a[1]!, c: -c.b });
    }
  }

  const b0 = problem.bounds[0] ?? { lower: 0, upper: null };
  const b1 = problem.bounds[1] ?? { lower: 0, upper: null };
  if (b0.lower != null) halfPlanes.push({ a: -1, b: 0, c: -b0.lower });
  if (b0.upper != null) halfPlanes.push({ a: 1, b: 0, c: b0.upper });
  if (b1.lower != null) halfPlanes.push({ a: 0, b: -1, c: -b1.lower });
  if (b1.upper != null) halfPlanes.push({ a: 0, b: 1, c: b1.upper });

  const R = chooseBoundingR(halfPlanes);
  const xMin = b0.lower ?? -R;
  const xMax = b0.upper ?? R;
  const yMin = b1.lower ?? -R;
  const yMax = b1.upper ?? R;
  let poly: Point2D[] = [
    { x: xMin, y: yMin },
    { x: xMax, y: yMin },
    { x: xMax, y: yMax },
    { x: xMin, y: yMax },
  ];

  for (const hp of halfPlanes) {
    poly = clipPolygon(poly, hp);
    if (poly.length === 0) {
      return {
        status: "infeasible",
        vertices: [],
        optimalPoint: null,
        objectiveValue: null,
        warnings: [],
        debug: { R, halfPlanes },
      };
    }
  }

  const closedPoly = dedupeClosePoints(poly);
  const touchesBoundary =
    (b0.upper == null && closedPoly.some((p) => Math.abs(p.x - xMax) < 1e-6)) ||
    (b1.upper == null && closedPoly.some((p) => Math.abs(p.y - yMax) < 1e-6)) ||
    (b0.lower == null && closedPoly.some((p) => Math.abs(p.x - xMin) < 1e-6)) ||
    (b1.lower == null && closedPoly.some((p) => Math.abs(p.y - yMin) < 1e-6));
  if (touchesBoundary) {
    warnings.push(
      "La región toca el borde artificial del recorte. Podría ser no acotada (aumenta el rango o valida con Simplex).",
    );
  }

  let bestPoint: Point2D | null = null;
  let bestVal = 0;
  for (const p of closedPoly) {
    const v = dot2(objective, p);
    if (bestPoint === null) {
      bestPoint = p;
      bestVal = v;
      continue;
    }
    if (senseCompare(problem.objective.sense, v, bestVal)) {
      bestPoint = p;
      bestVal = v;
    }
  }

  return {
    status: touchesBoundary ? "maybe_unbounded" : "ok",
    vertices: closedPoly,
    optimalPoint: bestPoint,
    objectiveValue: bestPoint ? bestVal : null,
    warnings,
    debug: { R, halfPlanes },
  };
}

function chooseBoundingR(halfPlanes: HalfPlane[]): number {
  const candidates: number[] = [];
  for (const hp of halfPlanes) {
    if (Math.abs(hp.a) > EPS) {
      const x = hp.c / hp.a;
      if (Number.isFinite(x) && x > 0) candidates.push(x);
    }
    if (Math.abs(hp.b) > EPS) {
      const y = hp.c / hp.b;
      if (Number.isFinite(y) && y > 0) candidates.push(y);
    }
  }
  const max = candidates.length > 0 ? Math.max(...candidates) : 10;
  const R = Math.max(5, max * 1.25);
  return Number.isFinite(R) ? R : 10;
}

function inside(p: Point2D, hp: HalfPlane): boolean {
  return hp.a * p.x + hp.b * p.y <= hp.c + 1e-9;
}

function intersectSegmentWithLine(p1: Point2D, p2: Point2D, hp: HalfPlane): Point2D {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const denom = hp.a * dx + hp.b * dy;
  if (Math.abs(denom) < EPS) {
    return p2;
  }
  const t = (hp.c - hp.a * p1.x - hp.b * p1.y) / denom;
  return { x: p1.x + t * dx, y: p1.y + t * dy };
}

function clipPolygon(poly: Point2D[], hp: HalfPlane): Point2D[] {
  if (poly.length === 0) return [];
  const out: Point2D[] = [];
  for (let i = 0; i < poly.length; i++) {
    const curr = poly[i]!;
    const prev = poly[(i + poly.length - 1) % poly.length]!;
    const currInside = inside(curr, hp);
    const prevInside = inside(prev, hp);

    if (currInside) {
      if (!prevInside) {
        out.push(intersectSegmentWithLine(prev, curr, hp));
      }
      out.push(curr);
    } else if (prevInside) {
      out.push(intersectSegmentWithLine(prev, curr, hp));
    }
  }
  return out;
}

/** Resuelve la proyección 2D (x3=…=0). Útil cuando numVars > 2. */
export function solveGraphical2DProjected(problem: LPProblem): Graphical2DResult {
  if (problem.numVars <= 2) return solveGraphical2D(problem);
  const projected = projectTo2D(problem);
  const result = solveGraphical2D(projected);
  return {
    ...result,
    warnings: [
      "Proyección sobre x₁, x₂ (resto de variables = 0).",
      ...result.warnings,
    ],
  };
}

function dedupeClosePoints(points: Point2D[]): Point2D[] {
  const out: Point2D[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last) {
      out.push(p);
      continue;
    }
    const d2 = (p.x - last.x) ** 2 + (p.y - last.y) ** 2;
    if (d2 > 1e-18) out.push(p);
  }
  if (out.length >= 2) {
    const first = out[0]!;
    const last = out[out.length - 1]!;
    const d2 = (first.x - last.x) ** 2 + (first.y - last.y) ** 2;
    if (d2 <= 1e-18) out.pop();
  }
  return out;
}

