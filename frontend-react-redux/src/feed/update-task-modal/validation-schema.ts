import * as yup from 'yup';

export const validationSchema = yup.object({
  description: yup
    .string()
    .max(500, 'Descrição muito grande.')
    .required('Descrição é requerida.'),
});