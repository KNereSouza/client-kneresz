import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("@/lib/auth", () => ({
  requireAdmin: () => requireAdmin(),
}));

vi.mock("next/navigation", () => ({
  notFound,
}));

vi.mock("@/components/admin-nav", () => ({
  AdminNav: () => null,
}));

describe("AdminLayout", () => {
  beforeEach(() => {
    requireAdmin.mockReset();
    notFound.mockClear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("calls notFound() when requireAdmin returns null", async () => {
    requireAdmin.mockResolvedValue(null);
    const { default: AdminLayout } = await import("@/app/admin/layout");

    await expect(AdminLayout({ children: null })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
  });

  it("renders children when requireAdmin returns a user", async () => {
    requireAdmin.mockResolvedValue({
      id: "u",
      github_id: 42,
      github_username: "admin",
      avatar_id: 0,
      is_admin: true,
      created_at: "",
    });
    const { default: AdminLayout } = await import("@/app/admin/layout");

    const result = await AdminLayout({ children: "ok" });
    expect(result).toBeTruthy();
    expect(notFound).not.toHaveBeenCalled();
  });
});
