import { useSelector } from 'react-redux'
import { RootState } from './store/store.ts'
import { LoginPage } from './login/login-page/login-page.tsx'

type PropsGuardRoute = {
  component: JSX.Element
}
export const GuardRoute = ({ component }: PropsGuardRoute) => {
  const userAuthenticated = useSelector((state: RootState) => state.user)
  if(!userAuthenticated.auth.isAuth) {
    return <LoginPage />
  }
  return component
}