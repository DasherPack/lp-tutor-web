"use client";

export function SimplexWhatIs() {
  return (
    <section aria-labelledby="what-is-simplex-heading" className="mb-8">
      <details className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
        <summary
          id="what-is-simplex-heading"
          className="cursor-pointer list-none px-4 py-3 font-heading text-sm font-semibold text-[var(--foreground)] [&::-webkit-details-marker]:hidden"
        >
          ¿Qué es el método Simplex?
        </summary>
        <div className="border-t border-[var(--card-border)] px-4 py-3 text-sm text-[var(--muted)] leading-relaxed space-y-3">
          <p>
            El <strong className="text-[var(--foreground)]">método Simplex</strong> es un
            algoritmo para resolver problemas de programación lineal. Fue desarrollado por{" "}
            <strong className="text-[var(--foreground)]">George Dantzig</strong> y consiste
            en ir moviéndose por vértices de la región factible (en el espacio de variables)
            mejorando el valor de la función objetivo en cada paso hasta llegar al óptimo o
            detectar que el problema es no acotado o infactible.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Forma estándar.</strong> El Simplex
            trabaja con problemas en forma estándar: maximización (o minimización convertida a
            max), restricciones de igualdad y variables no negativas. Las desigualdades se
            transforman usando <strong className="text-[var(--foreground)]">variables de
            holgura</strong> (≤), <strong className="text-[var(--foreground)]">surplus</strong> y{" "}
            <strong className="text-[var(--foreground)]">variables artificiales</strong> (≥ y =).
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Método Big-M.</strong> Cuando hay
            restricciones ≥ o =, se añaden variables artificiales y se penalizan en la función
            objetivo con un coeficiente -M (en maximización) para que salgan de la base; así se
            obtiene una base factible inicial o se detecta infactibilidad.
          </p>
          <p>
            <strong className="text-[var(--foreground)]">Tableau y pivoteo.</strong> El algoritmo
            se aplica sobre un <strong className="text-[var(--foreground)]">tableau</strong> (tabla)
            que representa el sistema en forma canónica respecto a la base actual. En cada
            iteración se elige una variable entrante (por <strong className="text-[var(--foreground)]">coste
            reducido</strong> más negativo) y una variable saliente (por la regla de la{" "}
            <strong className="text-[var(--foreground)]">razón mínima</strong>), y se realiza un
            pivoteo tipo Gauss-Jordan. El proceso termina cuando no hay costes reducidos negativos
            (óptimo), cuando no hay fila saliente (no acotado) o cuando permanecen variables
            artificiales en la base (infactible).
          </p>
        </div>
      </details>
    </section>
  );
}
