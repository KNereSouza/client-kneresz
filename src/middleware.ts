import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hasAccess = req.cookies.get("access_token")?.value;
  const hasRefresh = req.cookies.get("refresh_token")?.value;
  if (!hasAccess && !hasRefresh) {
    const loginUrl = new URL("/api/auth/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
