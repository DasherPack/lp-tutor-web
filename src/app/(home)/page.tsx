"use client";

import Link from "next/link";
import { MainFlow } from "@/components/MainFlow";

export default function Home() {
  return (
    <>
      <MainFlow />
      <section aria-labelledby="tools-heading" className="mt-10 border-t border-[var(--card-border)] pt-8">
        <h2
          id="tools-heading"
          className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          Calculadora de programación lineal
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
          Herramienta educativa para resolver problemas de optimización lineal con
          el <strong>método Simplex</strong> (paso a paso) y el{" "}
          <strong>método gráfico</strong> en 2D.
        </p>
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          <li>
            <Link
              href="/simplex"
              className="font-medium text-[var(--primary)] underline underline-offset-4 hover:no-underline"
            >
              Método Simplex paso a paso
            </Link>
            <span className="ml-1 text-[var(--muted)]">
              — Tableau, Big-M, pivoteo y detección de óptimo, infactibilidad o no acotación.
            </span>
          </li>
          <li>
            <Link
              href="/graphical"
              className="font-medium text-[var(--primary)] underline underline-offset-4 hover:no-underline"
            >
              Método gráfico 2D
            </Link>
            <span className="ml-1 text-[var(--muted)]">
              — Región factible, vértices y punto óptimo para problemas con dos variables.
            </span>
          </li>
        </ul>
      </section>
    </>
  );
}
