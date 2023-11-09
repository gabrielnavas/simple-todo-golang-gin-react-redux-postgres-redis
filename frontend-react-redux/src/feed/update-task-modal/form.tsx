import { useFormik } from "formik";

import moment from "moment";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";

import {
  Container,
  UpdateTaskIcon,
  ButtonAction,
  Buttons,
  Input,
  Inputs,
  Title,
  Subtitle,
  SubtitleItem,
  CancelRemoveTaskIcon,
} from './material-components'

import { validationSchema } from './validation-schema';
import { RootState } from "../../store/store";
import { updatePartialsTask } from "../../store/reducers/task/task";
import { TaskUpdate } from "./task-update-data";
import { updateTask } from "../services/update-task";


type Props = {
  closeModal: () => void
  taskToUpdate: TaskUpdate
}

export const Form = (props: Props) => {
  const userState = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      description: props.taskToUpdate.description,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const taskToUpdateApi = {
        id: props.taskToUpdate.id,
        description: values.description,
        ownerId: userState.user.id
      }
      
      const data = await updateTask(taskToUpdateApi, userState.auth.token)
      if (data instanceof Error) {
        toast(data.message)
      } else {
        const taskToUpdateRedux = {
          id: props.taskToUpdate.id,
          description: values.description,
          createdAt: props.taskToUpdate.createdAt.toISOString(),
          updatedAt: new Date().toISOString()
        }
        setSubmitting(false)
        dispatch(updatePartialsTask(taskToUpdateRedux))
        formik.resetForm()
        toast('Task atualizada!')
        props.closeModal()
      }
    },
  });

  return (
    <Container onSubmit={formik.handleSubmit}>
      <Title>
        Atualizar task 
      </Title>
      <Subtitle>
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
      <Inputs>
        <Input 
          inputRef={input => input && input.focus()}
          rows={8}
          multiline
          label="Descrição" 
          variant="outlined"
          type="text"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description} 
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
      </Inputs>
      <Buttons>
      <ButtonAction 
        variant="contained"
        onClick={() => formik.submitForm()}>
        <UpdateTaskIcon />
        Atualizar
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