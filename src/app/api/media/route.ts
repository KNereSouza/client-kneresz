import { NextRequest, NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall, getValidToken, requireAdmin } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch("/media", token),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }
  const token = await getValidToken();
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const res = await fetch(`${BACKEND_URL}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
