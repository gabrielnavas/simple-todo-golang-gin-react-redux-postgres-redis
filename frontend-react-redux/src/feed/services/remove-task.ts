type TaskRemove = {
  taskId: string
  ownerId: string
}

export const removeTask = async (taskToUpdate: TaskRemove, bearerToken: string): Promise<void | Error> => {
  const response = await fetch(`http://localhost:8080/api/tasks/${taskToUpdate.taskId}?userId=${taskToUpdate.ownerId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
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