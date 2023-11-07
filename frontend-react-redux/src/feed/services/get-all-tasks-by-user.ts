type TaskResponse = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
}

type UserFromBody = {
  id: string,
  email: string
  createdAt: string
  updatedAt: string
}

type GetAllTasksByUserBody = {
  id: string,
  description: string
  createdAt: string
  updatedAt: string
  owner: UserFromBody
}

export class Unauthorized extends Error {
  constructor(message: string ) {
     super(message)
  }
}

export class ServerError extends Error {
  constructor(message: string ) {
     super(message)
  }
}

type Response = {
  error: Unauthorized | ServerError | null
  data: TaskResponse[]
} 

export const getAllTasksByUser = async (userId: string, bearerToken: string): Promise<Response> => {
  const response = await fetch(`http://localhost:8080/api/tasks?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    }
  })
  if (response.status === 401 || response.status === 403) {
    return { error: new Unauthorized("Sem autorização"), data: []}
  }
  if (response.status === 200) {
    const data =  await response.json()
    const tasks: TaskResponse[] = data.tasks
      .map((task: GetAllTasksByUserBody) => ({
        id: task.id,
        description: task.description,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      } as TaskResponse))
    return { data: tasks, error: null}
  }
  return { error: new ServerError("Problemas no servidor. Tente novamente mais tarde."), data: [] }
}