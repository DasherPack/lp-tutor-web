"use client";

import { useEffect } from "react";
import { useProblemStore } from "@/store/problemStore";

/** Rehidrata el store desde localStorage tras el primer montaje en cliente. */
export function StoreHydration({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useProblemStore.persist.rehydrate();
  }, []);
  return <>{children}</>;
}
