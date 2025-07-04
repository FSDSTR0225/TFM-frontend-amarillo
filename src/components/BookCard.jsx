import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVoteBooks } from "../api/BookApi";
import "../styles/BookCard.css";

//nuevo callback a Books
function BookCard({ book, onVoteUpdate }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // estado inicia los valores de like/dislike del libro
  const [likeCount, setLikeCount] = useState(book.like || 0);
  const [dislikeCount, setDislikeCount] = useState(book.dislike || 0);

  // Llamado a la APi, actualiza estado local de cada libro, pedimos a books que actualice lista
  const handleVote = async (voteType) => {
    try {
      const updated = await getVoteBooks(token, book._id, voteType);
      setLikeCount(updated.like);
      setDislikeCount(updated.dislike);
      onVoteUpdate(book._id, updated.like, updated.dislike); // ⬅️ avisa al padre
    } catch (err) {
      console.error("Error al votar:", err);
    }
  };

  const handlePerfil = () => navigate("/books/PerfilBook", { state: { book } });

  return (
    <div className="book-card">
      <img src={book.imgBook} alt={book.name} className="book-img" />
      <h2 className="book-title">{book.name}</h2>
      <p className="book-author">
        <strong>Autor:</strong> {book.author}
      </p>
      <p className="book-genre">
        <strong>Género:</strong> {book.genre}
      </p>
      <p className="book-language">
        <strong>Idioma:</strong> {book.language}
      </p>
      <p className="book-synopsis">
        <strong>Sinopsis:</strong> {book.synopsis}
      </p>

      <div className="book-card-actions">
        <button className="action-btn" onClick={() => handleVote("like")}>
          👍 Me gusta ({likeCount})
        </button>
        <button className="action-btn" onClick={() => handleVote("dislike")}>
          👎 No me gusta ({dislikeCount})
        </button>
        <button className="action-btn">💾 Guardar</button>
        <button className="action-btn" onClick={handlePerfil}>
          📖 Saber más
        </button>
      </div>
    </div>
  );
}

export default BookCard;
