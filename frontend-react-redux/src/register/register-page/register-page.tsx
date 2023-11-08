import {
  Container,
} from './material-components'

import { RegisterPageContent } from '../register-page-content/login-page-content'
import { useEffect } from 'react';

export const RegisterPage = () => {
  useEffect(() => {
    document.title = 'Se registrar'
  }, []);

  return (
    <Container>
      <RegisterPageContent />
    </Container>
  )
}