import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireAdmin = vi.fn();
vi.mock("@/lib/auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth")>("@/lib/auth");
  return {
    ...actual,
    requireAdmin: () => requireAdmin(),
    authenticatedBackendCall: vi.fn(async (cb) => cb("tok")),
    getValidToken: vi.fn(async () => "tok"),
  };
});

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const adminUser = {
  id: "u",
  github_id: 42,
  github_username: "admin",
  avatar_id: 0,
  is_admin: true,
  created_at: "",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("admin-only API proxy routes", () => {
  beforeEach(() => {
    requireAdmin.mockReset();
    fetchMock.mockReset();
    process.env.BACKEND_URL = "http://backend";
  });

  describe("POST /api/posts", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { POST } = await import("@/app/api/posts/route");
      const req = new NextRequest("http://test/api/posts", {
        method: "POST",
        body: JSON.stringify({ title: "x", body: "x" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("proxies when admin", async () => {
      requireAdmin.mockResolvedValue(adminUser);
      fetchMock.mockResolvedValue(jsonResponse({ slug: "x" }, 201));
      const { POST } = await import("@/app/api/posts/route");
      const req = new NextRequest("http://test/api/posts", {
        method: "POST",
        body: JSON.stringify({ title: "x", body: "x" }),
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
      expect(fetchMock).toHaveBeenCalledOnce();
    });
  });

  describe("PUT /api/posts/[slug]", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { PUT } = await import("@/app/api/posts/[slug]/route");
      const req = new NextRequest("http://test/api/posts/x", {
        method: "PUT",
        body: JSON.stringify({ title: "y" }),
      });
      const res = await PUT(req, { params: Promise.resolve({ slug: "x" }) });
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/posts/[slug]", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { DELETE } = await import("@/app/api/posts/[slug]/route");
      const req = new NextRequest("http://test/api/posts/x", {
        method: "DELETE",
      });
      const res = await DELETE(req, { params: Promise.resolve({ slug: "x" }) });
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/posts/[slug]/restore", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { POST } = await import("@/app/api/posts/[slug]/restore/route");
      const req = new NextRequest("http://test/api/posts/x/restore", {
        method: "POST",
      });
      const res = await POST(req, { params: Promise.resolve({ slug: "x" }) });
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/posts/[slug]/purge", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { DELETE } = await import("@/app/api/posts/[slug]/purge/route");
      const req = new NextRequest("http://test/api/posts/x/purge", {
        method: "DELETE",
        body: JSON.stringify({ confirm: "x" }),
      });
      const res = await DELETE(req, { params: Promise.resolve({ slug: "x" }) });
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/media", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { GET } = await import("@/app/api/media/route");
      const res = await GET();
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/media", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { POST } = await import("@/app/api/media/route");
      const req = new NextRequest("http://test/api/media", { method: "POST" });
      const res = await POST(req);
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/media/[id]", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { DELETE } = await import("@/app/api/media/[id]/route");
      const req = new NextRequest("http://test/api/media/abc", {
        method: "DELETE",
      });
      const res = await DELETE(req, { params: Promise.resolve({ id: "abc" }) });
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/media/gc", () => {
    it("returns 403 when not admin", async () => {
      requireAdmin.mockResolvedValue(null);
      const { POST } = await import("@/app/api/media/gc/route");
      const res = await POST();
      expect(res.status).toBe(403);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
