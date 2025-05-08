import React from "react";
import { Outlet } from "react-router-dom";
import { LoginProvider } from '../context/contextLogin';
export const Root = () => {
  return (
    //Estructura de la pagina principal, donde se puede añadir un header y un footer
    <>
    <LoginProvider>
      <main>
        <Outlet />
      </main>
      </LoginProvider>
    </>
  );
};