import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin/* routes except /admin/login and /api/admin/* (API routes)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login") && !request.nextUrl.pathname.startsWith("/api/admin")) {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
