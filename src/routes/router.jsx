import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Books from "../pages/books";
import Save from "../pages/save";
import Profile from "../pages/profile";
import { Root } from "./root";
import AdvancedForm from "../pages/AdvanceForm";
import PerfilBook from "../pages/PerfilBook";
import ErrorPage from "../pages/ErrorPage";
import ErrorPage2 from "../pages/ErrorPage2";

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
      },{
        path: "/login",
        element: <AdvancedForm />,
      },{
        path: "/books/PerfilBook",
        element: <PerfilBook />,
       },{
         path: "/*",
        element: <ErrorPage2 />,

      },
    ],

  },
]);

export default router;
