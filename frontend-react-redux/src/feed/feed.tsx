import { useSelector } from "react-redux"
import { RootState } from "../store/store"


export const FeedPage = () => {
  const userAuthenticated = useSelector((state: RootState) => state.user)
  return (
    <div>
      {
        userAuthenticated.id
      }
    </div>
  )
}