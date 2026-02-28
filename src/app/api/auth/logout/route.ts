import { NextResponse } from "next/server";
import { clearTokenCookies } from "@/lib/auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET() {
  await clearTokenCookies();
  return NextResponse.redirect(`${APP_URL}/`);
}

export async function POST() {
  await clearTokenCookies();
  return NextResponse.json({ ok: true });
}
