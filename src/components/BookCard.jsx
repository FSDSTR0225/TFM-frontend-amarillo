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
import { confirmDeleteAlert, showAlert } from "./Sweetalerts"; // asegúrate que este archivo esté creado

function BookCard({ book, onRemove }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [likeCount, setLikeCount] = useState(book.like || 0);
  const [dislikeCount, setDislikeCount] = useState(book.dislike || 0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleVote = async () => {
      try {
        const res = await voteBooks(token, book._id);
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
    const isSaved = savedBooks.some(
      (id) => id._id.toString() === book._id.toString()
    );
    setSaved(isSaved);
  };

  const handleVote = async (voteType) => {
    try {
      const res = await getVoteBooks(token, book._id, voteType);
      setLikeCount(res.like);
      setDislikeCount(res.dislike);
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };

  const preferences = async (voteType) => {
    await postPreferences(token, book._id, voteType);
  };

  const handleSaveBook = async () => {
    try {
      await saveBook(token, book._id);
      fetchSaved();
    } catch (err) {
      console.error("Error al guardar libro:", err);
    }
  };

  const handleRemoveSavedBook = async () => {
    const result = await confirmDeleteAlert("este libro guardado");
    if (!result.isConfirmed) return;

    try {
      await deleteSaveBook(token, book._id);
      setSaved(false);
      showAlert("Eliminado", "Libro eliminado de guardados", "success");

      // Si BookCard fue usado desde Save.jsx, notificar que debe eliminarse de pantalla
      if (onRemove) {
        onRemove(book._id);
      } else {
        fetchSaved(); // Si no está en Save.jsx, solo actualizamos estado local
      }
    } catch (err) {
      console.error("Error al eliminar libro guardado:", err);
      showAlert("Error", "No se pudo eliminar el libro", "error");
    }
  };

  const handlePerfil = () => {
    navigate(`/books/PerfilBook`, { state: { book: book } });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 flex flex-col">
      <div className="w-full h-120">
        <img
          src={book.imgBook}
          alt={book.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
            {book.name}
          </h2>
          <p className="text-gray-700 text-sm">
            <strong>Autor:</strong> {book.author}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Género:</strong> {book.genre}
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Idioma:</strong> {book.language}
          </p>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            <strong>Sinopsis:</strong> {book.synopsis}
          </p>
        </div>

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
