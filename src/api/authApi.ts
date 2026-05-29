import axios from "axios";
import type { User } from "../context/AuthContext";

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

export async function login(request: LoginRequest) {
  const response = await axios.post<LoginResponse>("/api/auth/login", request);
  return response.data;
}

export async function register(request: RegisterRequest) {
  const response = await axios.post<RegisterRequest>(
    "/api/auth/register",
    request,
  );
  return response.data;
}
