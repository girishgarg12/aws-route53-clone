import { api } from "./api";

export interface User {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login(
  data: LoginRequest
) {
  return api<User>("/api/auth/login", {
    method: "POST",
    credentials: "include",
    body: data,
  });
}

export async function getCurrentUser() {
  return api<User>("/api/auth/me", {
    credentials: "include",
  });
}

export async function logout() {
  return api<{ message: string }>(
    "/api/auth/logout",
    {
      method: "POST",
      credentials: "include",
    }
  );
}