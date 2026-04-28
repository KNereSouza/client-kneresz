import { NextRequest, NextResponse } from "next/server";
import { backendFetch, authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall, getValidToken, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.toString();
  const path = search ? `/posts?${search}` : "/posts";
  const token = await getValidToken();
  const res = token
    ? await authenticatedFetch(path, token)
    : await backendFetch(path);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch("/posts", token, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
