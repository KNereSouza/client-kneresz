import { NextRequest, NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall, requireAdmin } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }
  const { slug } = await params;
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch(`/posts/${slug}/restore`, token, { method: "POST" }),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
