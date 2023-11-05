import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type LoginState = {
  id: string
  username: string
  token: string
  isRememberMe: boolean
}

type UserState = {
  id: string
  username: string
  token: string
  isAuth: boolean
  isRememberMe: boolean
}

const initialState: UserState = {
  id: "",
  username: "",
  token: "",
  isAuth: false,
  isRememberMe: false
}

export const userSlice = createSlice({
  name: 'counter',
  initialState: {...initialState},
  reducers: {
    login: (state, action: PayloadAction<LoginState>) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.token = action.payload.token
      state.isAuth = true
      state.isRememberMe = action.payload.isRememberMe
    },
    logout: state => {
      state = {...initialState}
    },
  }
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer