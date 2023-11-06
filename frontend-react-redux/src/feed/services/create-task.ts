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

type CreateTaskFromBody = {
  task: {
    id: string,
    description: string
    createdAt: string
    updatedAt: string
    owner: UserFromBody
  }
}

export const createTask = async (description: string, ownerId: string, bearerToken: string): Promise<TaskResponse | Error> => {
  const response = await fetch(`http://localhost:8080/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
    body: JSON.stringify({ 
      description,
      ownerId
     })
  })
  if (response.status >= 401 || response.status >= 403) {
    return new Error("Sem autorização")
  }
  if (response.status === 201) {
    const data =  await response.json() as CreateTaskFromBody
    const task: TaskResponse = {
      id: data.task.id,
      description: data.task.description,
      createdAt: data.task.createdAt,
      updatedAt: data.task.updatedAt,
    } as TaskResponse
    return task
  }
  return new Error("Problemas no servidor. Tente novamente mais tarde.")
}