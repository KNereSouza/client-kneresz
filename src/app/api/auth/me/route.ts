import { NextResponse } from "next/server";
import { authenticatedFetch } from "@/lib/api";
import { authenticatedBackendCall } from "@/lib/auth";

export async function GET() {
  const res = await authenticatedBackendCall((token) =>
    authenticatedFetch("/auth/me", token),
  );

  if (!res || !res.ok) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const user = await res.json();
  const adminGithubId = process.env.ADMIN_GITHUB_ID;
  const isAdmin = adminGithubId ? user.github_id === Number(adminGithubId) : false;
  return NextResponse.json({ ...user, is_admin: isAdmin });
}
