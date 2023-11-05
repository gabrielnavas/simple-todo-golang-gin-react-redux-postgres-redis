type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  id: string
  email: string
  password: string
  token: string
}

export const serviceLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  return ({email: data.email, password: data.password, id: '1', token: '!@123'})
}