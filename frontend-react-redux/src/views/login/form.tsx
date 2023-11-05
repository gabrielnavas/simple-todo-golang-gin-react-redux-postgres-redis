import {
  ActionsAfterButtons,
  ButtonAction,
  Buttons,
  ForgotPassword,
  Input,
  Inputs,
  RememberMe
} from './components'

import { useFormik } from "formik";
import { validationSchema } from './validation-schema';
import { FormControlLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../../store/reducers/user/user';
import { serviceLogin } from './service';

export const Form = () => {
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      email: 'foobar@example.com',
      password: 'foobar',
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      serviceLogin({
        email: values.email,
        password: values.password,
      })
      .then(user => {
        setSubmitting(false)
        dispatch(login({
          id: user.id,
          username: user.email,
          token: user.token,
          isRememberMe: values.rememberMe
        }))
      })
    },
  });

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