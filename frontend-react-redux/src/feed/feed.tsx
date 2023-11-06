import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import { useEffect, useState } from "react"
import { TaskResponse, getAllTasksByUser } from "./service"
import { toast } from "react-toastify"


export const FeedPage = () => {
  const userAuthenticated = useSelector((state: RootState) => state.user)
  
  const [tasks, setTasks] = useState<TaskResponse[]>([])
  
  useEffect(() => {
    (async () => {
      const data = await getAllTasksByUser(userAuthenticated.id, userAuthenticated.token)
      if(data instanceof Error) {
        showMessageFromService(data)
      } else {
        setTasks(data)
      }
    })()
  }, [])

  const showMessageFromService = (error: Error) => {
    toast(error.message)
  }
  
  return (
    <ul>
      {
        tasks.length > 0 && tasks.map(task => (
          <li>{task.id} {task.description} {task.createdAt.toISOString()} {task.updatedAt.toISOString()}</li>
        ))
      }
    </ul>
  )
}