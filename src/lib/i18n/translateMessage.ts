import type { TranslatableMessage } from "@/lib/lp/simplex/types";

export function translateMessage(
  msg: TranslatableMessage | string,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  if (typeof msg === "string") return t(msg);
  return t(msg.key, msg.params);
}
