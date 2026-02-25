"use client";

import { useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  Chart as ChartJS,
  type ChartData,
  type ScriptableContext,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

export type Point2D = { x: number; y: number };

function getObjectiveLineSegment(
  c1: number,
  c2: number,
  z: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): Point2D[] {
  const pts: Point2D[] = [];
  const eps = 1e-9;
  if (Math.abs(c2) > eps) {
    const yAt0 = z / c2;
    const yAtXmax = (z - c1 * xMax) / c2;
    const yAtXmin = (z - c1 * xMin) / c2;
    if (Number.isFinite(yAt0) && yAt0 >= yMin - 1 && yAt0 <= yMax + 1)
      pts.push({ x: 0, y: yAt0 });
    if (Number.isFinite(yAtXmax) && yAtXmax >= yMin - 1 && yAtXmax <= yMax + 1)
      pts.push({ x: xMax, y: yAtXmax });
    if (Number.isFinite(yAtXmin) && yAtXmin >= yMin - 1 && yAtXmin <= yMax + 1)
      pts.push({ x: xMin, y: yAtXmin });
  }
  if (Math.abs(c1) > eps) {
    const xAt0 = z / c1;
    if (Number.isFinite(xAt0) && xAt0 >= xMin - 1 && xAt0 <= xMax + 1)
      pts.push({ x: xAt0, y: 0 });
  }
  if (pts.length < 2) {
    pts.push({ x: xMin, y: yMin }, { x: xMax, y: yMax });
  }
  const deduped = pts.filter(
    (p, i) => pts.findIndex((q) => Math.abs(q.x - p.x) < 1e-6 && Math.abs(q.y - p.y) < 1e-6) === i,
  );
  if (deduped.length >= 2) {
    const [p1, p2] = deduped;
    const dx = (p2?.x ?? 0) - (p1?.x ?? 0);
    const dy = (p2?.y ?? 0) - (p1?.y ?? 0);
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const scale = Math.max(xMax - xMin, yMax - yMin) / len;
    return [
      { x: (p1?.x ?? 0) - dx * scale, y: (p1?.y ?? 0) - dy * scale },
      { x: (p2?.x ?? 0) + dx * scale, y: (p2?.y ?? 0) + dy * scale },
    ];
  }
  return [{ x: xMin, y: yMin }, { x: xMax, y: yMax }];
}

export function FeasibleChart(props: {
  vertices: Point2D[];
  optimalPoint: Point2D | null;
  objectiveCoeffs?: [number, number];
  objectiveValue?: number | null;
  sense?: "max" | "min";
}) {
  const {
    vertices,
    optimalPoint,
    objectiveCoeffs,
    objectiveValue,
    sense = "max",
  } = props;
  const { t } = useTranslation();

  const data = useMemo((): ChartData<"line", Point2D[], unknown> => {
    const polygon =
      vertices.length > 0 ? [...vertices, vertices[0]!] : ([] as Point2D[]);

    const xVals = vertices.map((p) => p.x);
    const yVals = vertices.map((p) => p.y);
    const xMin = Math.min(0, ...xVals);
    const xMax = Math.max(1, ...xVals);
    const yMin = Math.min(0, ...yVals);
    const yMax = Math.max(1, ...yVals);
    const pad = Math.max((xMax - xMin) * 0.1, (yMax - yMin) * 0.1, 0.5);
    const Xmin = xMin - pad;
    const Xmax = xMax + pad;
    const Ymin = yMin - pad;
    const Ymax = yMax + pad;

    const feasibleLabel = t("graphical.feasibleRegion");
    const objectiveLabel = t("graphical.objectiveLine");
    const improvementLabel = t("graphical.improvementDir");
    const optimalLabel = t("graphical.optimal");

    const datasets: ChartData<"line", Point2D[], unknown>["datasets"] = [
      {
        label: feasibleLabel,
        data: polygon,
        parsing: false as const,
        showLine: true,
        fill: "shape" as const,
        borderWidth: 1,
        backgroundColor: (ctx: ScriptableContext<"line">) => {
          const chart = ctx.chart;
          const area = chart.chartArea;
          const canvasCtx = chart.ctx;
          if (!area || !canvasCtx) return "rgba(30, 58, 95, 0.12)";
          const g = canvasCtx.createLinearGradient(
            area.left,
            area.top,
            area.right,
            area.bottom,
          );
          g.addColorStop(0, "rgba(30, 58, 95, 0.18)");
          g.addColorStop(0.5, "rgba(30, 58, 95, 0.12)");
          g.addColorStop(1, "rgba(30, 58, 95, 0.08)");
          return g;
        },
        borderColor: "rgb(30 58 95)",
        pointRadius: 2,
        pointHoverRadius: 4,
        tension: 0,
      },
    ];

    if (
      objectiveCoeffs &&
      objectiveValue != null &&
      Number.isFinite(objectiveValue) &&
      optimalPoint
    ) {
      const [c1, c2] = objectiveCoeffs;
      const lineSegment = getObjectiveLineSegment(
        c1,
        c2,
        objectiveValue,
        Xmin,
        Xmax,
        Ymin,
        Ymax,
      );
      datasets.push({
        label: objectiveLabel,
        data: lineSegment,
        parsing: false as const,
        showLine: true,
        fill: false,
        borderColor: "rgb(87 83 78)",
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0,
      });

      const dir = sense === "max" ? 1 : -1;
      const nx = c1 * dir;
      const ny = c2 * dir;
      const norm = Math.sqrt(nx * nx + ny * ny) || 1;
      const L = Math.min(Xmax - Xmin, Ymax - Ymin) * 0.2;
      const arrowEnd: Point2D = {
        x: optimalPoint.x + (nx / norm) * L,
        y: optimalPoint.y + (ny / norm) * L,
      };
      datasets.push({
        label: improvementLabel,
        data: [optimalPoint, arrowEnd],
        parsing: false as const,
        showLine: true,
        fill: false,
        borderColor: "rgb(87 83 78)",
        borderWidth: 1.5,
        pointRadius: [0, 0],
        tension: 0,
      });
    }

    if (optimalPoint) {
      datasets.push({
        label: optimalLabel,
        data: [optimalPoint],
        parsing: false as const,
        showLine: false,
        pointRadius: 6,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(185 28 28)",
        pointBorderColor: "rgb(185 28 28)",
        borderColor: "rgb(185 28 28)",
      });
    }

    return { datasets };
  }, [
    vertices,
    optimalPoint,
    objectiveCoeffs,
    objectiveValue,
    sense,
    t,
  ]);

  const arrowPlugin = useMemo(
    () => ({
      id: "arrowHead",
      afterDatasetsDraw(chart: ChartJS) {
        const idx = chart.data.datasets.findIndex((d) => {
          const pr = (d as Record<string, unknown>).pointRadius;
          return Array.isArray(d.data) && d.data.length === 2 && Array.isArray(pr) && pr[0] === 0;
        });
        if (idx < 0) return;
        const meta = chart.getDatasetMeta(idx);
        if (!meta?.data?.[1]) return;
        const end = meta.data[1];
        const start = meta.data[0];
        if (!end || !start) return;
        const ctx = chart.ctx;
        const endX = end.x;
        const endY = end.y;
        const startX = start.x;
        const startY = start.y;
        const dx = endX - startX;
        const dy = endY - startY;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const headLen = 12;
        const ctx2 = ctx as CanvasRenderingContext2D;
        ctx2.save();
        ctx2.fillStyle = "rgb(87 83 78)";
        ctx2.beginPath();
        ctx2.moveTo(endX, endY);
        ctx2.lineTo(
          endX - headLen * ux - headLen * 0.4 * uy,
          endY - headLen * uy + headLen * 0.4 * ux,
        );
        ctx2.lineTo(
          endX - headLen * ux + headLen * 0.4 * uy,
          endY - headLen * uy - headLen * 0.4 * ux,
        );
        ctx2.closePath();
        ctx2.fill();
        ctx2.restore();
      },
    }),
    [],
  );

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="font-heading text-sm font-semibold text-[var(--foreground)]">{t("graphical.planeTitle")}</div>
      <div className="mt-3 h-[360px]">
        <Chart
          type="line"
          data={data}
          plugins={[arrowPlugin]}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { position: "bottom" as const },
              tooltip: { intersect: false },
            },
            scales: {
              x: {
                type: "linear",
                title: { display: true, text: "x₁" },
                grid: { color: "rgba(0,0,0,0.06)" },
              },
              y: {
                type: "linear",
                title: { display: true, text: "x₂" },
                grid: { color: "rgba(0,0,0,0.06)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
