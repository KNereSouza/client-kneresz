import { NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall, requireAdmin } from "@/lib/auth";

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch("/admin/media/gc", token, { method: "POST" }),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
