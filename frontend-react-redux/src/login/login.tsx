import { useEffect } from 'react'
import {
  Container,
  Content,
  ContentContent,
  ContentHeader,
} from './components'

import { Form } from './form'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useNavigate } from 'react-router-dom'

export const Login = () => {

  const userAuthenticated = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    verifyIsUserAlreadyAuth()
  }, [userAuthenticated])

  const verifyIsUserAlreadyAuth = () => {
    if(userAuthenticated.isAuth) {
      navigate('/')
      toast("Você já está autenticado!")
    } else {
      toast("Entre com seus dados!")
    }
  }

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