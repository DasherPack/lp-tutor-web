"use client";

export function OperationsLog(props: { operations: string[] }) {
  const { operations } = props;
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
      <div className="font-heading text-sm font-semibold text-[var(--foreground)]">Operaciones</div>
      {operations.length ? (
        <ul className="mt-3 grid gap-1 text-xs font-mono text-[var(--foreground)]">
          {operations.map((op, i) => (
            <li key={i}>
              {op}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 text-sm text-[var(--muted)]">Sin operaciones.</div>
      )}
    </div>
  );
}

