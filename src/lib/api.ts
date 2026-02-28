const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export class BackendError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
  }
}

export async function backendFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${BACKEND_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
}

export async function authenticatedFetch(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  return backendFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
