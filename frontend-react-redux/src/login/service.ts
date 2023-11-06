type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  user: {
    id: string
    email: string
		createdAt: Date
		updatedAt: Date
  }
  token: string
}


export const serviceLogin = async (data: LoginRequest): Promise<LoginResponse | Error> => {
  const response = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'aaplication/json'
    },
    body: JSON.stringify(data)
  })
  if (response.status >= 400 && response.status < 500) {
    return new Error("E-mail e/ou senha incorretos")
  }
  if (response.status === 200) {
    return await response.json() as LoginResponse
  }
  return new Error("Problemas no servidor. Tente novamente mais tarde.")
}