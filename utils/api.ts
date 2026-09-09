import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

const TOKEN_KEY = "safeguard.token";

let cachedToken: string | null | undefined; // undefined = not loaded yet

export async function getToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken;
  cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
  return cachedToken;
}

export async function setToken(token: string | null): Promise<void> {
  cachedToken = token;
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  status: number;
  errors?: { msg: string; path?: string }[];

  constructor(message: string, status: number, errors?: { msg: string; path?: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean; // defaults to true - almost every route requires a bearer token
};

/**
 * Thin JSON fetch wrapper around the backend's `{ ...data }` /
 * `{ error }` / `{ errors: [...] }` response shapes (see
 * src/server.js's central error handler and express-validator usage).
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError(
      "Couldn't reach the SafeGuard server. Check your connection and that the backend is running.",
      0
    );
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      throw new ApiError(data.errors[0].msg, response.status, data.errors);
    }
    throw new ApiError(data.error || "Something went wrong", response.status);
  }

  return data as T;
}

/**
 * Uploads local image URIs (from expo-image-picker) as multipart/form-data
 * to POST /api/uploads/images, returning the server-hosted URLs to attach
 * to a report. See report.tsx / uploads.routes.js.
 */
export async function uploadImages(uris: string[]): Promise<string[]> {
  if (uris.length === 0) return [];

  const token = await getToken();
  const form = new FormData();
  uris.forEach((uri, i) => {
    const ext = uri.split(".").pop()?.split("?")[0] || "jpg";
    // @ts-expect-error - React Native's FormData accepts this file-like shape
    form.append("images", { uri, name: `photo-${i}.${ext}`, type: `image/${ext === "jpg" ? "jpeg" : ext}` });
  });

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/uploads/images`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Deliberately no Content-Type here - fetch sets the multipart
        // boundary itself when the body is a FormData instance.
      },
      body: form,
    });
  } catch (err) {
    throw new ApiError("Couldn't upload images. Check your connection.", 0);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new ApiError(data.error || "Image upload failed", response.status);
  }

  return data.urls as string[];
}
