import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdmin } from "@/lib/auth";
import type { UserOut } from "@/lib/types";

const baseUser: UserOut = {
  id: "u1",
  github_id: 42,
  github_username: "x",
  avatar_id: 0,
  is_admin: false,
  created_at: "2026-01-01T00:00:00Z",
};

describe("isAdmin", () => {
  const originalEnv = process.env.ADMIN_GITHUB_ID;

  beforeEach(() => {
    process.env.ADMIN_GITHUB_ID = "42";
  });

  afterEach(() => {
    process.env.ADMIN_GITHUB_ID = originalEnv;
  });

  it("returns false for null user", () => {
    expect(isAdmin(null)).toBe(false);
  });

  it("returns false for non-matching github_id", () => {
    expect(isAdmin({ ...baseUser, github_id: 99 })).toBe(false);
  });

  it("returns true when github_id matches ADMIN_GITHUB_ID", () => {
    expect(isAdmin(baseUser)).toBe(true);
  });

  it("ignores client-side is_admin field", () => {
    expect(isAdmin({ ...baseUser, github_id: 99, is_admin: true })).toBe(false);
  });

  it("returns false when ADMIN_GITHUB_ID is unset", () => {
    delete process.env.ADMIN_GITHUB_ID;
    expect(isAdmin(baseUser)).toBe(false);
  });
});
