import { useFormik } from "formik";
import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
  ButtonAction,
  Buttons,
  Input,
  Inputs,
} from './material-components'

import { login } from '../../store/reducers/user/user';
import {  RegisterResponse, serviceRegister } from '../service';
import { validationSchema } from './validation-schema';


export const Form = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      serviceRegister({
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      })
      .then(data => {
        setSubmitting(false)
        if(data instanceof Error) {
          showMessageFromService(data)
        } else {
          addDataOnStore(data)
          redirectToFeed()
          toast('Registrado com sucesso!')
          toast('Você já pode criar suas tasks!')
        }
      })
    },
  });

  const showMessageFromService = (error: Error) => {
    toast(error.message)
  }

  const addDataOnStore = (data: RegisterResponse) => {
    dispatch(login({
      id: data.user.id,
      username: data.user.email,
      token: data.token,
      isRememberMe: formik.values.rememberMe
    }))
    formik.resetForm()
  }

  const redirectToFeed = () => {
    navigate('/')
  }

  const redirectToLogin = () => {
    navigate('/login')
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
         <Input 
          label="Confirmação de senha" 
          variant="outlined" 
          type="password"
          name="passwordConfirmation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.passwordConfirmation}
          error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
          helperText={
            formik.touched.passwordConfirmation && formik.errors.passwordConfirmation 
            || formik.values.password !== formik.values.passwordConfirmation && (
              <div style={{color: '#f44336'}}>Senha está diferente da confirmação de senha</div>
            ) 
          }
        />
      </Inputs>
      <Buttons>
        <ButtonAction type="submit" variant="contained" disabled={formik.isSubmitting}>Registrar</ButtonAction>
        <ButtonAction variant="outlined" onClick={redirectToLogin}>Fazer login</ButtonAction>
      </Buttons>
    </form>
  )
}