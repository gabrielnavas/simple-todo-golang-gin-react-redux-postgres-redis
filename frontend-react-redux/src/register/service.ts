type RegisterRequest = {
  email: string
  password: string
  passwordConfirmation: string
}

export type RegisterResponse = {
  user: {
    id: string
    email: string
		createdAt: Date
		updatedAt: Date
  }
  token: string
}


export const serviceRegister = async (data: RegisterRequest): Promise<RegisterResponse | Error> => {
  const response = await fetch('http://localhost:8080/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'aaplication/json'
    },
    body: JSON.stringify(data)
  })
  if (response.status === 400) {
    const data = await response.json() as { details: string }
    console.log(data);
    return new Error("Email já utilizado.")
  }
  if (response.status === 201) {
    return await response.json() as RegisterResponse
  }
  return new Error("Problemas no servidor. Tente novamente mais tarde.")
}