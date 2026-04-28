import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cookieGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet, set: vi.fn(), delete: vi.fn() }),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("requireAdmin", () => {
  beforeEach(() => {
    process.env.ADMIN_GITHUB_ID = "42";
    process.env.BACKEND_URL = "http://backend";
    cookieGet.mockReset();
    fetchMock.mockReset();
  });

  afterEach(() => {
    delete process.env.ADMIN_GITHUB_ID;
    delete process.env.BACKEND_URL;
  });

  it("returns null when no token cookie", async () => {
    cookieGet.mockReturnValue(undefined);
    const { requireAdmin } = await import("@/lib/auth");
    expect(await requireAdmin()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null when /auth/me returns non-admin user", async () => {
    cookieGet.mockReturnValue({ value: "tok" });
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ id: "u", github_id: 99, github_username: "x", avatar_id: 0, is_admin: false, created_at: "" }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    const { requireAdmin } = await import("@/lib/auth");
    expect(await requireAdmin()).toBeNull();
  });

  it("returns user when /auth/me returns admin github_id", async () => {
    cookieGet.mockReturnValue({ value: "tok" });
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ id: "u", github_id: 42, github_username: "admin", avatar_id: 0, is_admin: true, created_at: "" }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    const { requireAdmin } = await import("@/lib/auth");
    const user = await requireAdmin();
    expect(user).not.toBeNull();
    expect(user?.github_id).toBe(42);
  });

  it("ignores tampered is_admin=true on a non-admin github_id", async () => {
    cookieGet.mockReturnValue({ value: "tok" });
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ id: "u", github_id: 999, github_username: "fake", avatar_id: 0, is_admin: true, created_at: "" }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    const { requireAdmin } = await import("@/lib/auth");
    expect(await requireAdmin()).toBeNull();
  });
});
