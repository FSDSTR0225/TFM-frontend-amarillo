// src/components/BookCard.jsx

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import {
  deleteSaveBook,
  getSavedBooks,
  getVoteBooks,
  saveBook,
  voteBooks,
} from "../api/BookApi";
import { postPreferences } from "../api/UserApi";
import {
  ThumbsUp,
  ThumbsDown,
  BookmarkPlus,
  BookOpen,
  BookmarkX,
} from "lucide-react";

function BookCard({ book }) {
  const navigate = useNavigate();

  function handlePerfil() {
    navigate(`/books/PerfilBook`, { state: { book: book } });
  }

  const [likeCount, setLikeCount] = useState(book.like || 0);
  const [dislikeCount, setDislikeCount] = useState(book.dislike || 0);
  const [saved, setSaved] = useState(false);
  console.log("name del libro:", book.name);
  console.log("contador dislike", book.dislike);
  console.log("contador like", book.like);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Función para manejar el voto al cargar el componente
    const handleVote = async () => {
      try {
        const res = await voteBooks(token, book._id);
        if (!res) {
          throw new Error(res.message || `Error al obtener los votos`);
        }
        setLikeCount(res.like);
        setDislikeCount(res.dislike);
      } catch (error) {
        console.error("Error al manejar el voto:", error);
      }
    };
    handleVote();
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    const savedBooks = await getSavedBooks(token);
    console.log("Libros guardados:", savedBooks);
    console.log("Libro actual:", book._id);

    const isSaved = savedBooks.some(
      (id) => id._id.toString() === book._id.toString()
    );
    console.log("ID del libro actual:", isSaved);
    setSaved(isSaved);
  };

  const handleVote = async (voteType) => {
    try {
      const res = await getVoteBooks(token, book._id, voteType);

      if (!res) {
        throw new Error(res.message || `Error al enviar el voto`);
      }
      console.log("Voto enviado:", res);
      const updatedBook = res;
      setLikeCount(updatedBook.like);
      setDislikeCount(updatedBook.dislike);
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };
  const preferences = async (voteType) => {
    const res = await postPreferences(token, book._id, voteType);

    console.log("preferncia enviada", res);
  };
  const handleSaveBook = async () => {
    try {
      const saved = await saveBook(token, book._id);
      console.log("Libro guardado:", saved);
      fetchSaved();
    } catch (err) {
      console.error("Error al votar:", err);
    }
    
  };
  const handleRemoveSavedBook = async () => {
    try {
      const deletesaved = await deleteSaveBook(token, book._id);
      console.log("Libro guardado eliminadio:", deletesaved);
      fetchSaved();
    } catch (err) {
      console.error("Error al votar:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      {/* Imagen del libro */}
      <div className="md:w-1/3 w-full">
        <img
          src={book.imgBook}
          alt={book.name}
          className="object-cover w-full h-full md:h-auto"
        />
      </div>
      {/* Contenido */}
      <div className="md:w-2/3 w-full p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">{book.name}</h2>
          <p className="text-gray-700">
            <strong>Autor:</strong> {book.author}
          </p>
          <p className="text-gray-700">
            <strong>Género:</strong> {book.genre}
          </p>
          <p className="text-gray-700">
            <strong>Idioma:</strong> {book.language}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            <strong>Sinopsis:</strong> {book.synopsis}
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => {
              handleVote("like");
              preferences("like");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg hover:bg-green-200 transition"
          >
            <ThumbsUp size={16} /> ({likeCount})
          </button>

          <button
            onClick={() => {
              handleVote("dislike");
              preferences("dislike");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-lg hover:bg-red-200 transition"
          >
            <ThumbsDown size={16} /> ({dislikeCount})
          </button>

          {saved ? (
            <button
              onClick={handleRemoveSavedBook}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition"
            >
              <BookmarkX size={16} />
            </button>
          ) : (
            <button
              onClick={handleSaveBook}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition"
            >
              <BookmarkPlus size={16} />
            </button>
          )}

          <button
            onClick={handlePerfil}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-lg hover:bg-indigo-200 transition"
          >
            <BookOpen size={16} /> Saber más
          </button>
        </div>
      </div>
    </div>
  );
}
export default BookCard;
