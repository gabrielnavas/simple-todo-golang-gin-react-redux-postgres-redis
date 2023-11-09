type TaskUpdate = {
  id: string
  description: string
  ownerId: string
}

export const updateTask = async (taskToUpdate: TaskUpdate, bearerToken: string): Promise<void | Error> => {
  const payload = { 
    description: taskToUpdate.description,
   }
  const response = await fetch(`http://localhost:8080/api/tasks/${taskToUpdate.id}?userId=${taskToUpdate.ownerId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
    body: JSON.stringify(payload)
  })
  if (response.status === 404) {
    return new Error("Task não encontrada")
  }
  if (response.status === 401 || response.status === 403) {
    return new Error("Sem autorização")
  }
  if (response.status !== 204) {
    return new Error("Problemas no servidor. Tente novamente mais tarde.")
  }
}