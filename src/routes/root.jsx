import Header from "../components/Header";
import Footer from "../components/Footer";
import React from "react";
import { Outlet } from "react-router-dom";
import { LoginProvider } from "../context/contextLogin";
export const Root = () => {
  return (
    //Estructura de la pagina principal, donde se puede añadir un header y un footer
    <>
    
{/* para que el useffet funcione  */}
      <LoginProvider>
        <div className="flex flex-col min-h-screen bg-base-100">
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>

          <Footer />
        </div>
      </LoginProvider>
    </>
  );
};

export default Root;
