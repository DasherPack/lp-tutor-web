import { redirect } from "next/navigation";

/**
 * Fallback: el middleware ya redirige / a /es.
 * Si se llega aquí, redirigir por seguridad.
 */
export default function RootPage() {
  redirect("/es");
}
