import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "./scss/style.scss";

import Login from "./pages/login";
import Page404 from "./pages/page404";
import Register from "./pages/register";
import ChatPage from "./pages/chatPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: localStorage.getItem("token") ? (
      <ChatPage />
    ) : (
      <Navigate to="/login" />
    ),
    errorElement: <Page404 />,
  },
  {
    path: "/login",
    element: localStorage.getItem("token") ? <Navigate to="/" /> : <Login />,
  },
  {
    path: "/register",
    element: localStorage.getItem("token") ? <Navigate to="/" /> : <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
