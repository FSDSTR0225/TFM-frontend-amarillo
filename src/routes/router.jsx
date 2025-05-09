import { createBrowserRouter } from "react-router-dom";
//import Home from "../pages/home";
//import About from "../pages/about";
//import Contact from "../pages/contact";
import Root from "../routes/Root";
import Register from "../pages/register";

const router = createBrowserRouter([
  {
    // Ruta principal que pillara la estrutura de root.jsx
    path: "/",
    element: <Root />,
    children: [
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
