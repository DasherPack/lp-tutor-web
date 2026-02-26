import { NextRequest, NextResponse } from "next/server";
import { isValidLocale, SUPPORTED_LOCALES } from "@/lib/routing";

/** Detecta locale preferido desde Accept-Language. */
function getPreferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return "es";
  const parts = header.split(",").map((s) => s.split(";")[0].trim().toLowerCase());
  for (const part of parts) {
    const code = part.split("-")[0];
    if (SUPPORTED_LOCALES.includes(code as "es")) return code;
  }
  return "es";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // / → /es (o locale preferido)
  if (pathname === "/") {
    const locale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // /simplex, /graphical → /es/simplex, /es/graphical
  if (pathname === "/simplex" || pathname === "/graphical") {
    const locale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // /[locale] o /[locale]/... — validar locale
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 1) {
    const maybeLocale = segments[0];
    if (!isValidLocale(maybeLocale)) {
      const rest = segments.slice(1).join("/");
      const newPath = rest ? `/es/${rest}` : "/es";
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/simplex",
    "/graphical",
    "/es",
    "/es/:path*",
    "/en",
    "/en/:path*",
    "/fr",
    "/fr/:path*",
    "/de",
    "/de/:path*",
    "/ja",
    "/ja/:path*",
    "/zh",
    "/zh/:path*",
  ],
};
