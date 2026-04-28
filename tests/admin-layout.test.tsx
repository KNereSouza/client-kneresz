import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getAccessToken = vi.fn();
const getCurrentUser = vi.fn();
const isAdmin = vi.fn();
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
const redirect = vi.fn(() => {
  throw new Error("NEXT_REDIRECT");
});

vi.mock("@/lib/auth", () => ({
  getAccessToken: () => getAccessToken(),
  getCurrentUser: () => getCurrentUser(),
  isAdmin: (u: unknown) => isAdmin(u),
}));

vi.mock("next/navigation", () => ({
  notFound,
  redirect,
}));

vi.mock("@/components/admin-nav", () => ({
  AdminNav: () => null,
}));

const adminUser = {
  id: "u",
  github_id: 42,
  github_username: "admin",
  avatar_id: 0,
  is_admin: true,
  created_at: "",
};

describe("AdminLayout", () => {
  beforeEach(() => {
    getAccessToken.mockReset();
    getCurrentUser.mockReset();
    isAdmin.mockReset();
    notFound.mockClear();
    redirect.mockClear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("redirects to login when no access token", async () => {
    getAccessToken.mockResolvedValue(undefined);
    const { default: AdminLayout } = await import("@/app/admin/layout");

    await expect(AdminLayout({ children: null })).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/api/auth/login?redirect=/admin");
    expect(getCurrentUser).not.toHaveBeenCalled();
  });

  it("calls notFound() when authenticated but not admin", async () => {
    getAccessToken.mockResolvedValue("tok");
    getCurrentUser.mockResolvedValue({ ...adminUser, github_id: 99 });
    isAdmin.mockReturnValue(false);
    const { default: AdminLayout } = await import("@/app/admin/layout");

    await expect(AdminLayout({ children: null })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalledOnce();
  });

  it("renders children when admin", async () => {
    getAccessToken.mockResolvedValue("tok");
    getCurrentUser.mockResolvedValue(adminUser);
    isAdmin.mockReturnValue(true);
    const { default: AdminLayout } = await import("@/app/admin/layout");

    const result = await AdminLayout({ children: "ok" });
    expect(result).toBeTruthy();
    expect(notFound).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
