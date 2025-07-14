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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center font-serif">
      <h1 className="text-4xl font-serif font-bold text-indigo-800 mb-8">Tus libros guardados</h1>
      {savedBooks.length === 0 ? (
        <p className="text-center text-gray-500">No tienes libros guardados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-10">
          {savedBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Save;
