import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { reducers } from './reducers'


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

export const persistedReducer = persistReducer(persistConfig, reducers)