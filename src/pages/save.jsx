import { useEffect, useState } from "react";
import { getSavedBooks } from "../api/BookApi";
import { useLogin } from "../context/contextLogin";
import BookCard from "../components/BookCard";


function Save() {
  const { token } = useLogin();
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        const books = await getSavedBooks(token);
        setSavedBooks(books);
      } catch (err) {
        console.error("Error al obtener libros guardados:", err);
        setSavedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSavedBooks();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div className="books-container">
      <h1 className="header">Tus libros guardados</h1>
      <div className="book-card-container">
        {savedBooks.length === 0 ? (
          <p>No tienes libros guardados aún.</p>
        ) : (
          savedBooks.map((book) => <BookCard key={book._id} book={book} />)
        )}
      </div>
    </div>
  );
}

export default Save;