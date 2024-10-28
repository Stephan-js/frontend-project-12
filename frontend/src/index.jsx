import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './scss/styleLogin.scss';

import Login from './pages/login';
import Page404 from './pages/page404';
import Register from './pages/register';
import ChatPage from './pages/chatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatPage />,
    errorElement: <Page404 />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
