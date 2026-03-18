const API_BASE = "http://localhost:4000/api/v1";

export async function apiGet<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) throw new Error("Something went wrong. Please try again later.");

  return res.json();
}

export async function uploadFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);

  if (!res.ok) {
    let message = "Upload failed";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore JSON parse failure
    }

    throw new Error(message);
  }

  return res.json();
}
