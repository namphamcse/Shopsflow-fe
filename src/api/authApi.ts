import axios from "axios"

type LoginRequest = {
  email: string
  password: string
}

export async function login(request: LoginRequest) {
  const response = await axios.post("/api/auth/login", request)

  return response.data
}
