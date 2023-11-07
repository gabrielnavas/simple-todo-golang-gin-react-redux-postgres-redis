import {
  createBrowserRouter,
} from "react-router-dom";

import { GuardRoute } from './guard-route.tsx';

import { LoginPage } from './login/login-page/login-page.tsx'
import { FeedPage } from './feed/feed-page/feed-page.tsx';
import { RegisterPage } from "./register/register-page/register-page.tsx";

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  }, {
    path: "/register",
    element: <RegisterPage />
  }, {
    path: "/",
    element: <GuardRoute component={<FeedPage />} />
  }
])