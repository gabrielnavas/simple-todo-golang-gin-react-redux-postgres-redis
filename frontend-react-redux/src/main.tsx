import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Provider } from 'react-redux'
import { store } from './store/store.ts'


import { LoginPage } from './login/login-page/login-page.tsx'
import { FeedPage } from './feed/feed-page/feed-page.tsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';

import './index.css'
import { GuardRoute } from './guard-route.tsx';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <GuardRoute component={<FeedPage />} />
  }
])

const persistor = persistStore(store);

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
