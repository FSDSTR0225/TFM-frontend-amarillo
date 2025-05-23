import React from "react";

function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">500</h1>
        <h2 className="text-3xl">Error Interno</h2>
        <p className="text-xl">
          Lo sentimos, ha ocurrido un error interno en el servidor.
        </p>
        <p className="text-lg">
          Por favor, intente de nuevo más tarde o comuníquese con el administrador del sitio.
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;