import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Books from "../pages/books";
import Save from "../pages/save";
import Profile from "../pages/profile";
import { Root } from "./root";
import AdvancedForm from "../pages/advanceForm";
import PerfilBook from "../pages/PerfilBook";
import ErrorPage from "../pages/errorPage";
import Register from "../pages/register";

import Chat from "../pages/chat";
import NotFount from "../pages/notFount";
import LookFriends from "../pages/lookFriends";


const router = createBrowserRouter([
  {
    // Ruta principal que pillara la estrutura de root.jsx
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // Ejemplo de ruta anidada
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/save",
        element: <Save />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/login",
        element: <AdvancedForm />,
      },
      {
        path: "/books/PerfilBook",
        element: <PerfilBook />,

      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/*",
        element: <ErrorPage2 />,

       },{
        path: "/LookFriends",
        // element: <LookFriends/>,
         element: <LookFriends/>,
      },{
        path: "/LookFriends/chat/:roomId",
        element: <Chat/>,
      },{
        path: "/register",
        element: <Register />,
      },{
         path: "/*",
        element: <NotFount />,

      },
    ],
  },
]);

export default router;
