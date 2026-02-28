import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";

export async function GET(req: NextRequest) {
  const redirectTo = req.nextUrl.searchParams.get("redirect") || "/";
  const store = await cookies();
  store.set("auth_redirect", redirectTo, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: "read:user",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}
