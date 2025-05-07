import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    //Estructura de la pagina principal, donde se puede añadir un header y un footer
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
