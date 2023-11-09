import moment from "moment";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";

import {
  Container,
  RemoveTaskIcon,
  ButtonAction,
  Buttons,
  Title,
  Subtitle,
  SubtitleItem,
  QuestionToRemoveTaskText,
  CancelRemoveTaskIcon,
} from './material-components'

import { RootState } from "../../store/store";
import { removeTaskById } from "../../store/reducers/task/task";
import { TaskUpdate } from "./task-update-data";
import { removeTask } from "../services/remove-task";
import { useCallback } from "react";


type Props = {
  closeModal: () => void
  taskToUpdate: TaskUpdate
}

export const QuestionToRemoveTask = (props: Props) => {
  const userState = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  const confirmRemoveTaskOnClick = useCallback(async () => {
    const removeTaskApiData = {
        ownerId: userState.user.id, 
        taskId: props.taskToUpdate.id
      }
    const data = await removeTask(removeTaskApiData, userState.auth.token)
    if (data instanceof Error) {
      toast(data.message)
    } else {
      dispatch(removeTaskById({ taskId: props.taskToUpdate.id}))
      toast('Task removida!')
      props.closeModal()
    }
  }, [dispatch, userState.auth.token, userState.user.id, props])

  return (
    <Container>
      <Title>
        Atualizar task 
      </Title>
      <Subtitle>
        <QuestionToRemoveTaskText>
          Tem certeza que deseja remover essa task?
        </QuestionToRemoveTaskText>
        <SubtitleItem>
          criada em {moment(props.taskToUpdate.createdAt).format('DD/MM/YYYY, h:mm:ss a') }
        </SubtitleItem>
        {
          props.taskToUpdate.createdAt.toISOString() !== props.taskToUpdate.updatedAt.toISOString() && (
            <SubtitleItem>
              atualizada em {moment(props.taskToUpdate.updatedAt).format('DD/MM/YYYY, h:mm:ss a') }
            </SubtitleItem>
          )
        }
      </Subtitle>
     
      <Buttons>
        <ButtonAction 
          variant="contained"
          onClick={() => confirmRemoveTaskOnClick()}>
          <RemoveTaskIcon />
          Confirmar
        </ButtonAction>
        <ButtonAction 
          variant="outlined"
          onClick={props.closeModal}>
            <CancelRemoveTaskIcon />
            Fechar
        </ButtonAction>
      </Buttons>
      
    </Container>
  )
}