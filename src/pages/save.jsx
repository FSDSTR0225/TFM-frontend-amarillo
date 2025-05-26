/*function Save() {
  return <h1>Página de libros guardados</h1>;
}

export default Save;*/

import { useEffect, useState } from "react";
import { getSavedBooks } from "../api/BookApi";

function SavePage() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getSavedBooks(token)
      .then((data) => setLibros(data))
      .catch((err) => console.error("Error al obtener libros guardados:", err));
  }, []);

  return (
    <div>
      <h2>Mis libros guardados</h2>
      <ul>
        {libros.map((libro) => (
          <li key={libro._id}>
            <strong>{libro.name}</strong> - {libro.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavePage;
