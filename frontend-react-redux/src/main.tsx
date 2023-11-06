import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Provider, useSelector } from 'react-redux'
import { RootState, store } from './store/store.ts'

import './index.css'

import { Login } from './login/login.tsx'
import { FeedPage } from './feed/feed.tsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';

type PropsGuardRoute = {
  component: JSX.Element
}

const GuardRoute = ({ component }: PropsGuardRoute) => {
  const userAuthenticated = useSelector((state: RootState) => state.user)
  if(!userAuthenticated.isAuth) {
    return <Login />
  }
  return component
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <GuardRoute component={<FeedPage />} />
  }
])

let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <ToastContainer />
        <RouterProvider router={router}/>
      </React.StrictMode>
    </PersistGate>
  </Provider>
)
