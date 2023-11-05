import { useEffect } from 'react'
import {
  Container,
  Content,
  ContentContent,
  ContentHeader,
} from './components'

import { Form } from './form'
import { toast } from 'react-toastify'

export const Login = () => {

  useEffect(() => {
    toast("Entre com seus dados!")
  }, [toast])

  return (
    <Container>
      <Content raised>
        <ContentHeader 
          title="Autenticação"
          subheader="Entre com seus dados"
        />
        <ContentContent>
          <Form />
        </ContentContent>
      </Content>
    </Container>
  )
}