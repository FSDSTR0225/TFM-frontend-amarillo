import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import "../styles/Books.css";

function Books() {
  const [book, setBook] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => {
        console.log("Libros:", data);
        setBook(data);
        console.log("Libro recomendado:", data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener libro:", err);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (currentIndex < book.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;
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
