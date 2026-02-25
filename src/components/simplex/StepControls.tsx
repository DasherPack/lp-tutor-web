"use client";

import { useTranslation } from "@/lib/i18n";

export function StepControls(props: {
  cursor: number;
  total: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { cursor, total, onFirst, onPrev, onNext, onLast, disabled } = props;
  const atStart = cursor <= 0;
  const atEnd = cursor >= total - 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-700">
        {t("simplex.stepOf", { current: cursor + 1, total }).split(/(\d+)/).map((part, i) =>
          /^\d+$/.test(part) ? (
            <span key={i} className="font-semibold text-zinc-900">{part}</span>
          ) : (
            part
          )
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onFirst}
          disabled={disabled || atStart}
        >
          {t("simplex.first")}
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onPrev}
          disabled={disabled || atStart}
        >
          {t("simplex.prev")}
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onNext}
          disabled={disabled || atEnd}
        >
          {t("simplex.next")}
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
          onClick={onLast}
          disabled={disabled || atEnd}
        >
          {t("simplex.last")}
        </button>
      </div>
    </div>
  );
}

