import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type LoginState = {
  id: string
  username: string
  token: string
  isRememberMe: boolean
}

type UserState = {
  user: {
    id: string
    username: string
  },
  auth: {
    token: string
    isAuth: boolean
  }
  isRememberMe: boolean
}

const initialState: UserState = {
  user: {
    id: '',
    username: '',
  },
  auth: {
    token: '',
    isAuth: false,
  },
  isRememberMe: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {...initialState},
  reducers: {
    login: (state, action: PayloadAction<LoginState>) => {
      state.user.id = action.payload.id
      state.user.username = action.payload.username
      state.auth.token = action.payload.token
      state.auth.isAuth = true
      state.isRememberMe = action.payload.isRememberMe
    },
    logout: state => {
      state.user = {...initialState.user}
      state.auth = {...initialState.auth}
      state.isRememberMe = initialState.isRememberMe
    },
  }
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer