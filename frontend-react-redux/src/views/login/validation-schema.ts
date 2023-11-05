import * as yup from 'yup';

export const validationSchema = yup.object({
  email: yup
    .string()
    .email('E-mail inválido.')
    .max(100, 'E-mail muito grande.')
    .required('Entre com um e-mail válido.'),
  password: yup
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres.')
    .max(100, 'Senha muito grande.')
    .required('Password is required'),
});