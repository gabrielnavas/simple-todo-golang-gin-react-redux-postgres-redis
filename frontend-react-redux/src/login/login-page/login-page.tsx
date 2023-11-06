import { useCallback, useEffect } from 'react'

import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../../store/store'

import {
  Container,
} from './material-components'

import { LoginPageContent } from '../login-page-content/login-page-content'


export const LoginPage = () => {
  const userAuthenticated = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  const verifyIsUserAlreadyAuth = useCallback(() => {
    if(userAuthenticated.auth.isAuth) {
      navigate('/')
      toast("Você já está autenticado!")
    } else {
      toast("Entre com seus dados!")
    }
  }, [userAuthenticated.auth.isAuth, navigate])

  useEffect(() => {
    verifyIsUserAlreadyAuth()
  }, [verifyIsUserAlreadyAuth])

  return (
    <Container>
      <LoginPageContent />
    </Container>
  )
}