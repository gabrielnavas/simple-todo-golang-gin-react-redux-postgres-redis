import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './reducers/user/user'
import taskReducer from './reducers/task/task'

export const reducers = combineReducers({
  user: userReducer,
  task: taskReducer
})
