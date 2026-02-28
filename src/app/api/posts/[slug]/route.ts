import { NextRequest, NextResponse } from "next/server";
import { backendFetch, authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const res = await backendFetch(`/posts/${slug}`);

  if (res.status === 301) {
    const location = res.headers.get("location");
    return NextResponse.json(
      { redirect: location },
      { status: 301, headers: location ? { location } : {} },
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await req.json();
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch(`/posts/${slug}`, token, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch(`/posts/${slug}`, token, { method: "DELETE" }),
  );

  if (!res) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
