import type { Role, User } from "../types";
import { apiClient } from "./client";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { name: string; email: string; password: string };
export type LoginResponse = { token: string; user: User };

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function normalizeRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const role = value.replace(/^ROLE_/, "").toUpperCase();
  return role === "USER" || role === "ADMIN" ? role : null;
}

function normalizeLoginResponse(value: unknown): LoginResponse {
  const source = record(value);
  const wrapped = record(source.data);
  const payload = Object.keys(wrapped).length > 0 ? wrapped : source;
  const rawUser = record(payload.user);
  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  const id = Number(rawUser.id);
  const name = typeof rawUser.name === "string" ? rawUser.name.trim() : "";
  const email = typeof rawUser.email === "string" ? rawUser.email.trim() : "";
  const role = normalizeRole(rawUser.role);

  if (!token || !Number.isInteger(id) || id <= 0 || !name || !email || !role) {
    throw new Error("The backend returned an invalid login response.");
  }

  return { token, user: { id, name, email, role } };
}

export async function login(request: LoginRequest) {
  const response = await apiClient.post<unknown>("/auth/login", request);
  return normalizeLoginResponse(response.data);
}

export async function register(request: RegisterRequest) {
  await apiClient.post<void>("/auth/register", request);
}
