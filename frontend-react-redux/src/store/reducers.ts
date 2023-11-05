import { combineReducers } from '@reduxjs/toolkit'
import counterSlice from './reducers/counter/counter'
import userSlice from './reducers/user/user'

export const reducers = combineReducers({
  counter: counterSlice,
  user: userSlice,
})
