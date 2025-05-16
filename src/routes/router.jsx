import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Books from "../pages/books";
import Save from "../pages/save";
import Profile from "../pages/profile";
import { Root } from "./root";
import AdvancedForm from "../pages/AdvanceForm";
import Register from "../pages/register";

const router = createBrowserRouter([

  {
    // Ruta principal que pillara la estrutura de root.jsx
    path: "/",
    element: <Root />,
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
      },{
        path: "/login",
        element: <AdvancedForm />,
      },{
        path: "/register",
        element: <Register />,
      }
    ],
  },
]);


export default router;
