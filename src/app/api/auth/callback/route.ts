import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch } from "@/lib/api";
import { setTokenCookies } from "@/lib/auth";
import type { TokenResponse } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(`${APP_URL}/?error=missing_code`);
  }

  const res = await backendFetch(`/auth/github/callback?code=${code}`);
  if (!res.ok) {
    return NextResponse.redirect(`${APP_URL}/?error=auth_failed`);
  }

  const tokens: TokenResponse = await res.json();
  await setTokenCookies(tokens);

  const store = await cookies();
  const redirectTo = store.get("auth_redirect")?.value || "/";
  store.delete("auth_redirect");

  return NextResponse.redirect(`${APP_URL}${redirectTo}`);
}
