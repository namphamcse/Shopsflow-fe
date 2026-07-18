import axios, { AxiosError } from "axios";
import type { ApiError } from "../types";
import { clearAuthStorage, readStorageItem } from "../utils/storage";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

function getStoredToken() {
  return readStorageItem("local", "accessToken") || readStorageItem("session", "accessToken");
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && getStoredToken()) {
      clearAuthStorage();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("shopsflow:unauthorized"));
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (axios.isAxiosError<ApiError>(error)) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) return serverMessage;
    if (error.code === "ECONNABORTED") return "The request timed out. Check the backend connection.";
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
