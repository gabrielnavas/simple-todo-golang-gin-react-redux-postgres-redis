import { useDispatch, useSelector } from "react-redux"
import { useCallback, useEffect } from "react"

import { toast } from "react-toastify"

import { TaskItem } from "../task-item/task-item"

import { addTasks } from "../../store/reducers/task/task"
import { RootState } from "../../store/store"

import { getAllTasksByUser } from "../service"

export const TaskList = () => {
  const userState = useSelector((state: RootState) => state.user)
  const taskState = useSelector((state: RootState) => state.task)

  const dispatch = useDispatch()

  const fetchTasks =  useCallback(async () => {
    const data = await getAllTasksByUser(userState.user.id, userState.auth.token)
    if(data instanceof Error) {
      showMessageFromService(data)
    } else {
      dispatch(addTasks(data))
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
    <ul>
      {
        taskState.tasks.map((task, index) => (
          <li key={index}>
            <TaskItem taskData={{...task, createdAt: new Date(task.createdAt), updatedAt: new Date(task.updatedAt)}} />
          </li>
        ))
      }
    </ul>
  )
}