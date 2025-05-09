import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Books from "../pages/books";
import Save from "../pages/save";
import Profile from "../pages/profile";
import { Root } from "./root";

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
      },
    ],
  },
]);

export default router;
