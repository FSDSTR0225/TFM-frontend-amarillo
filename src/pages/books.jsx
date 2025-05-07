import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

const mockBook = {
  image: "https://via.placeholder.com/150",
  title: "Cien Años de Soledad",
  author: "Gabriel García Márquez",
  genre: "Ficción",
  language: "Español",
  description: "Una obra maestra de la literatura latinoamericana.",
};

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
