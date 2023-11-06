import { useFormik } from "formik";
import { useDispatch } from 'react-redux';

import { FormControlLabel } from '@mui/material';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
  ActionsAfterButtons,
  ButtonAction,
  Buttons,
  ForgotPassword,
  Input,
  Inputs,
  RememberMe
} from './material-components'

import { login } from '../../store/reducers/user/user';
import { LoginResponse, serviceLogin } from '../service';
import { validationSchema } from './validation-schema';


export const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      serviceLogin({
        email: values.email,
        password: values.password,
      })
      .then(data => {
        setSubmitting(false)
        if(data instanceof Error) {
          showMessageFromService(data)
        } else {
          addDataOnStore(data)
          redirectToFeed()
        }
      })
    },
  });

  const showMessageFromService = (error: Error) => {
    toast(error.message)
  }

  const addDataOnStore = (data: LoginResponse) => {
    dispatch(login({
      id: data.user.id,
      username: data.user.email,
      token: data.token,
      isRememberMe: formik.values.rememberMe
    }))
  }

  const redirectToFeed = () => {
    navigate('/')
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Inputs>
        <Input 
          label="E-mail" 
          variant="outlined"
          type="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email} 
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Input 
          label="Senha" 
          variant="outlined" 
          type="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      </Inputs>
      <ActionsAfterButtons>
          <FormControlLabel 
            control={
              <RememberMe 
                name="rememberMe"
                onChange={formik.handleChange}
                checked={formik.values.rememberMe} />
            } 
            label="Lembrar-me" />
          <ForgotPassword to={'/forgot-password'}>
            Esqueci a senha...
          </ForgotPassword>
      </ActionsAfterButtons>
      <Buttons>
        <ButtonAction type="submit" variant="contained" disabled={formik.isSubmitting}>Entrar</ButtonAction>
        <ButtonAction variant="outlined">Fazer cadastro</ButtonAction>
      </Buttons>
    </form>
  )
}