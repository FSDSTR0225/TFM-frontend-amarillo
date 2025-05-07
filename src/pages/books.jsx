// src/pages/books.jsx (o donde estés mostrando los libros)
import BookCard from "../components/BookCard";
function Books() {
const mockBook = {
  image: "https://via.placeholder.com/150",
  title: "Cien Años de Soledad",
  author: "Gabriel García Márquez",
  genre: "Ficción",
  language: "Español",
  description: "Una obra maestra de la literatura latinoamericana.",
};

  return (
    <div>
      <h1>Libro Recomendado</h1>
      <BookCard book={mockBook} />
    </div>
  );
}


export default Books;
