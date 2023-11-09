import { useFormik } from "formik";

import {
  Container,
  AddTaskIcon,
  ButtonAction,
  Buttons,
  Input,
  Inputs,
  Title,
  CancelRemoveTaskIcon,
} from './material-components'

import { validationSchema } from './validation-schema';
import { createTask } from "../services/create-task";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { addTask } from "../../store/reducers/task/task";

type Props = {
  closeModal: () => void
}

export const Form = (props: Props) => {
  const userState = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = await createTask(values.description, userState.user.id, userState.auth.token)
      if (data instanceof Error) {
        toast(data.message)
      } else {
        setSubmitting(false)
        dispatch(addTask(data))
        formik.resetForm()
        toast('Task adicionada!')
      }
    },
  });

  return (
    <Container onSubmit={formik.handleSubmit}>
      <Title>
        Nova task
      </Title>
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
        <AddTaskIcon />
        Adicionar
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