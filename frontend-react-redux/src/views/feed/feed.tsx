import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"


export const FeedPage = () => {
  const userAuthenticated = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if(!userAuthenticated.isAuth) {
      toast("Se entre com seus dados!")
      navigate('/login')
    }
  }, [userAuthenticated.isAuth])

  return (
    <div>
      {
        userAuthenticated.id
      }
    </div>
  )
}