import { useDispatch, useSelector } from "react-redux"
import { useCallback, useEffect } from "react"

import { toast } from "react-toastify"

import { useNavigate } from "react-router-dom"

import { 
  ServerError, 
  Unauthorized, 
  getAllTasksByUser
} from "../services/get-all-tasks-by-user"

import { logout } from "../../store/reducers/user/user"

import { TaskItem } from "../task-item/task-item"

import { setTasks, setLoadingData } from "../../store/reducers/task/task"
import { RootState } from "../../store/store"

import { MessageAlert } from "./message-list"

import { Container } from "./material-components"


export const TaskList = () => {
  const userState = useSelector((state: RootState) => state.user)
  const taskState = useSelector((state: RootState) => state.task)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const showMessageFromService = useCallback((error: Error) => {
    toast(error.message)
  }, [])

  const unauthorizedFromService = useCallback((error: Error) => {
    showMessageFromService(error)
    dispatch(logout())
    navigate('/login')
  }, [navigate, dispatch, showMessageFromService])

  const fetchTasks =  useCallback(async () => {
    dispatch(setLoadingData(true))
    const resp = await getAllTasksByUser(userState.user.id, userState.auth.token)
    if(resp.error) {
      if(resp.error instanceof Unauthorized) {
        unauthorizedFromService(resp.error)
      } else if( resp.error instanceof ServerError) {
        showMessageFromService(resp.error)
      } 
    } else {
      dispatch(setTasks(resp.data))
    }
    dispatch(setLoadingData(false))
  }, [dispatch, userState.auth.token, userState.user.id, unauthorizedFromService, showMessageFromService])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if(taskState.loadingData)  {
    return <MessageAlert message='Carregando tasks, aguarde!' type='warning' />
  }

  if(taskState.tasks.length === 0)  {
    return <MessageAlert message='Nenhuma task encontrada!'   type='success' />
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