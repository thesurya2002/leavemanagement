import { NextRequest, NextResponse } from "next/server";
import { sessionCookieName } from "./lib/server/session-edge";

export function middleware(request: NextRequest) {
  const protectedPath = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin");
  if (protectedPath && !request.cookies.has(sessionCookieName)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
