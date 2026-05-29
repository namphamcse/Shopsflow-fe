import { createContext } from "react";

type Role = "ADMIN" | "USER";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
