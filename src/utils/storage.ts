export type StorageKind = "local" | "session";

function resolveStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    const storage = kind === "local" ? window.localStorage : window.sessionStorage;
    const probeKey = "__shopsflow_storage_probe__";
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
}

export function readStorageItem(kind: StorageKind, key: string) {
  try {
    return resolveStorage(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorageItem(kind: StorageKind, key: string, value: string) {
  const storage = resolveStorage(kind);
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(kind: StorageKind, key: string) {
  try {
    resolveStorage(kind)?.removeItem(key);
  } catch {
    // Storage may be blocked by browser privacy settings. Treat it as empty.
  }
}

export function clearAuthStorage() {
  for (const kind of ["local", "session"] as const) {
    removeStorageItem(kind, "accessToken");
    removeStorageItem(kind, "user");
  }
}
