import { NextRequest, NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall, requireAdmin } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch(`/media/${id}`, token, { method: "DELETE" }),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
