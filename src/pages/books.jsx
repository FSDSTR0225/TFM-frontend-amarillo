import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import "../styles/Books.css";
import { getBooks } from "../api/BookApi";
import { useLogin } from "../context/contextLogin";
import { useLocation } from "react-router-dom";

function Books() {
  const [book, setBook] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  //conexion con el contexto
  const { token, isLoggedIn } = useLogin();
    const location = useLocation();
  const { idBook } = location.state || {};

  useEffect(() => {
    const booksAll = async () => {
      try {
        // mado el token al api
        const response = await getBooks(token);
        setBook(response);
// Si venimos desde la vista de detalle con un idBook, 
// buscamos en el array de libros (response) la posición 
// que coincide con ese ID. Si lo encontramos (idx >= 0), 
// actualizamos currentIndex para mostrar ese libro en el carrusel.
         if (idBook) {
          const idx = response.findIndex(b => b._id === idBook);
          if (idx >= 0) setCurrentIndex(idx);
        }
      } catch (err) {
        console.log(err);

        //  navigate("/error500");
      }
    };
    booksAll();
  }, []);

  const handleNext = () => {
    if (currentIndex < book.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };
// si no hay token no se puede acceder a la pagina
  if (!isLoggedIn) return <p className="loading">Cargando...</p>;
  if (!book) return <p>No se encontró ningún libro recomendado.</p>;

  return (
    <div className="books-container">
      <h1 className="header">Te apetece leer...</h1>
      <div className="book-card-container">
        {/* Mostrar el libro actual */}
        {book[currentIndex] && (
          <>
            <BookCard book={book[currentIndex]} />
            {/* Mostrar el botón solo si hay más libros */}
            {currentIndex < book.length - 1 && (
              <button className="next-btn" onClick={handleNext}>
                Siguiente
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Books;
