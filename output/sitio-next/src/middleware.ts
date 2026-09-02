import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
 * Mientras el sitio vive en *.vercel.app (staging) no debe indexarse, para
 * no competir con dgdesignmodeling.com (WordPress actual). Cuando el
 * dominio definitivo apunte aquí, esas peticiones no llevan la cabecera y
 * el sitio se indexa normalmente — sin tocar código.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const host = request.headers.get("host") ?? "";
  if (host.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
