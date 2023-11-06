export type TaskResponse = {
  id: string
  description: string
  createdAt: Date
  updatedAt: Date
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
      .map((task: any) => ({
        id: task.id,
        description: task.description,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.createdAt),
      } as TaskResponse))
    return tasks
  }
  return new Error("Problemas no servidor. Tente novamente mais tarde.")
}