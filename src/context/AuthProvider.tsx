import { useState } from "react"
import { AuthContext, type User } from "./AuthContext"


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  

  function loginUser(token: string, user: User) {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  function logoutUser() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoggedIn: !!token,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


