import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Role, User } from "../types";
import {
  clearAuthStorage,
  readStorageItem,
  removeStorageItem,
  writeStorageItem,
  type StorageKind,
} from "../utils/storage";
import { AuthContext } from "./AuthContext";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

type AuthSnapshot = {
  token: string | null;
  user: User | null;
};

function isRole(value: unknown): value is Role {
  return value === "USER" || value === "ADMIN";
}

function normalizeUser(value: unknown): User | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const id = Number(candidate.id);
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const email = typeof candidate.email === "string" ? candidate.email.trim() : "";
  const rawRole = typeof candidate.role === "string"
    ? candidate.role.replace(/^ROLE_/, "").toUpperCase()
    : "";

  if (!Number.isInteger(id) || id <= 0 || !name || !email || !isRole(rawRole)) {
    return null;
  }

  return { id, name, email, role: rawRole };
}

function clearStorageKind(kind: StorageKind) {
  removeStorageItem(kind, TOKEN_KEY);
  removeStorageItem(kind, USER_KEY);
}

function readFromStorage(kind: StorageKind): AuthSnapshot | null {
  const token = readStorageItem(kind, TOKEN_KEY);
  const storedUser = readStorageItem(kind, USER_KEY);

  if (!token && !storedUser) return null;
  if (!token || !storedUser) {
    clearStorageKind(kind);
    return null;
  }

  try {
    const user = normalizeUser(JSON.parse(storedUser));
    if (!user) {
      clearStorageKind(kind);
      return null;
    }
    return { token, user };
  } catch {
    clearStorageKind(kind);
    return null;
  }
}

function readStoredAuth(): AuthSnapshot {
  const persistent = readFromStorage("local");
  if (persistent) {
    clearStorageKind("session");
    return persistent;
  }

  return readFromStorage("session") ?? { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialAuth] = useState<AuthSnapshot>(readStoredAuth);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const [user, setUser] = useState<User | null>(initialAuth.user);

  const loginUser = useCallback((nextToken: string, nextUser: User, remember = true) => {
    const normalizedUser = normalizeUser(nextUser);
    const normalizedToken = typeof nextToken === "string" ? nextToken.trim() : "";

    if (!normalizedToken || !normalizedUser) {
      throw new Error("The login response is missing valid account information.");
    }

    clearAuthStorage();
    const kind: StorageKind = remember ? "local" : "session";
    const tokenSaved = writeStorageItem(kind, TOKEN_KEY, normalizedToken);
    const userSaved = writeStorageItem(kind, USER_KEY, JSON.stringify(normalizedUser));

    // Storage can be disabled. The current tab should still remain signed in.
    if (!tokenSaved || !userSaved) clearStorageKind(kind);

    setToken(normalizedToken);
    setUser(normalizedUser);
  }, []);

  const logoutUser = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener("shopsflow:unauthorized", logoutUser);
    return () => {
      window.removeEventListener("shopsflow:unauthorized", logoutUser);
    };
  }, [logoutUser]);

  return (
    <AuthContext.Provider
      value={{ token, user, isLoggedIn: Boolean(token && user), loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
