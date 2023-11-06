import { combineReducers } from '@reduxjs/toolkit'
import userSlice from './reducers/user/user'

export const reducers = combineReducers({
  user: userSlice,
})
