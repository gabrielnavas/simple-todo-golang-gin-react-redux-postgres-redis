import { useDispatch, useSelector } from "react-redux"
import { useCallback, useEffect } from "react"

import { toast } from "react-toastify"

import { TaskItem } from "../task-item/task-item"

import { setTasks } from "../../store/reducers/task/task"
import { RootState } from "../../store/store"

import { getAllTasksByUser } from "../services/get-all-tasks-by-user"
import { Container } from "./material-components"

export const TaskList = () => {
  const userState = useSelector((state: RootState) => state.user)
  const taskState = useSelector((state: RootState) => state.task)

  const dispatch = useDispatch()

  const fetchTasks =  useCallback(async () => {
    const data = await getAllTasksByUser(userState.user.id, userState.auth.token)
    if(data instanceof Error) {
      showMessageFromService(data)
    } else {
      dispatch(setTasks(data))
    }
  }, [dispatch, userState.auth.token, userState.user.id])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const showMessageFromService = (error: Error) => {
    toast(error.message)
  }

  if(taskState.tasks.length === 0)  {
    return <span>Buscando tasks, aguarde!</span>
  }

  return (
    <Container>
      {
        taskState.tasks.map((task, index) => (
          <li key={index}>
            <TaskItem taskData={{...task, createdAt: new Date(task.createdAt), updatedAt: new Date(task.updatedAt)}} />
          </li>
        ))
      }
    </Container>
  )
}