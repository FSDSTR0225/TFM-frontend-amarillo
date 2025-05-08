import { createBrowserRouter } from "react-router-dom";

import { Root } from "./root";

const router = createBrowserRouter([
    {
        // Ruta principal que pillara la estrutura de root.jsx
      path: "/",
      element: <Root />,
      children: [
        // Ejemplo de ruta anidada
        //   {
        //   path: "/",
        //   element: <Home />,
        // },

      ],
    },
  ]);

export default router