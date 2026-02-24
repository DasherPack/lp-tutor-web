"use client";

export function StepControls(props: {
  cursor: number;
  total: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  disabled?: boolean;
}) {
  const { cursor, total, onFirst, onPrev, onNext, onLast, disabled } = props;
  const atStart = cursor <= 0;
  const atEnd = cursor >= total - 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-700">
        Paso <span className="font-semibold text-zinc-900">{cursor + 1}</span> de{" "}
        <span className="font-semibold text-zinc-900">{total}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onFirst}
          disabled={disabled || atStart}
        >
          Inicio
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onPrev}
          disabled={disabled || atStart}
        >
          Anterior
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onNext}
          disabled={disabled || atEnd}
        >
          Siguiente
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onLast}
          disabled={disabled || atEnd}
        >
          Final
        </button>
      </div>
    </div>
  );
}

