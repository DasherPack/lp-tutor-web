"use client";

import { useState } from "react";

/** Input numérico que permite campo vacío (no fuerza 0) y mejora la edición. */
export function NumberInput(props: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  "aria-label"?: string;
  disabled?: boolean;
}) {
  const { value, onChange, className, disabled } = props;
  const [local, setLocal] = useState(() =>
    value === 0 ? "" : String(value),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    if (s !== "" && s !== "-" && !/^-?\d*\.?\d*$/.test(s)) return;
    setLocal(s);
    const n = parseFloat(s);
    onChange(Number.isFinite(n) ? n : 0);
  };

  const handleBlur = () => {
    if (local === "" || local === "-") {
      onChange(0);
      return;
    }
    const n = parseFloat(local);
    if (Number.isFinite(n)) onChange(n);
  };

  return (
    <input
      className={className}
      type="text"
      inputMode="decimal"
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      aria-label={props["aria-label"]}
    />
  );
}
