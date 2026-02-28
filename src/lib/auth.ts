import { cookies } from "next/headers";
import { backendFetch } from "@/lib/api";
import type { TokenResponse } from "@/lib/types";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("access_token")?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("refresh_token")?.value;
}

export async function setTokenCookies(tokens: TokenResponse) {
  const store = await cookies();
  store.set("access_token", tokens.access_token, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60,
  });
  store.set("refresh_token", tokens.refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function clearTokenCookies() {
  const store = await cookies();
  store.delete("access_token");
  store.delete("refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await backendFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    await clearTokenCookies();
    return null;
  }

  const tokens: TokenResponse = await res.json();
  await setTokenCookies(tokens);
  return tokens.access_token;
}

/**
 * Returns a valid access token, refreshing if needed.
 * Returns null if no tokens exist or refresh fails.
 */
export async function getValidToken(): Promise<string | null> {
  const accessToken = await getAccessToken();
  if (accessToken) return accessToken;
  return refreshAccessToken();
}

/**
 * Calls the backend with auth. If 401, tries refresh and retries once.
 */
export async function authenticatedBackendCall(
  backendCall: (token: string) => Promise<Response>,
): Promise<Response | null> {
  const token = await getValidToken();
  if (!token) return null;

  const res = await backendCall(token);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return res;
    return backendCall(newToken);
  }

  return res;
}
