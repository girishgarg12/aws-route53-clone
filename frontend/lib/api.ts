const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

interface ApiOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, ...fetchOptions } = options;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...fetchOptions,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );

  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();

      message = data.detail || message;
    } catch {
      // Ignore invalid error responses.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}