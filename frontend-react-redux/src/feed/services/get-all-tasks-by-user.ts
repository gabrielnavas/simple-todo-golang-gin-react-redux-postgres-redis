export type TaskResponse = {
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

export const getAllTasksByUser = async (userId: string, bearerToken: string): Promise<TaskResponse[] | Error> => {
  const response = await fetch(`http://localhost:8080/api/tasks?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    }
  })
  if (response.status >= 401 || response.status >= 403) {
    return new Error("Sem autorização")
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
    return tasks
  }
  return new Error("Problemas no servidor. Tente novamente mais tarde.")
}