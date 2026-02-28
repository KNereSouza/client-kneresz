import { NextResponse } from "next/server";
import { getValidToken } from "@/lib/auth";

export async function POST() {
  const token = await getValidToken();
  if (!token) {
    return NextResponse.json({ detail: "Refresh failed" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
