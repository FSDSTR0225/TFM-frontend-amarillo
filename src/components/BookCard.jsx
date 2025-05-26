// src/components/BookCard.jsx

import { useNavigate } from "react-router-dom";
import "../styles/BookCard.css";
import { useState } from "react";
import { getVoteBooks } from "../api/BookApi";
import { saveBook } from "../api/BookApi";

function BookCard({ book }) {
  const navigate = useNavigate();

  function handlePerfil() {
    navigate(`/books/PerfilBook`, { state: { book: book } });
  }

  const [likeCount, setLikeCount] = useState(book.like || 0);
  const [dislikeCount, setDislikeCount] = useState(book.dislike || 0);
  console.log("contador dislike", book.dislike);
  console.log("contador like", book.like);
  const token = localStorage.getItem("token");

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

  const handleSave = async () => {
    if (!token) {
      alert("Debes iniciar sesión para guardar libros.");
      return;
    }

    try {
      const res = await saveBook(token, book._id);
      alert(res.message);
    } catch (error) {
      console.error("Error al guardar el libro:", error);
      alert("No se pudo guardar el libro");
    }
  };

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
        <button
          className="action-btn"
          onClick={() => {
            handleVote("like");
          }}
        >
          👍 Me gusta ({likeCount})
        </button>
        <button
          className="action-btn"
          onClick={() => {
            handleVote("dislike");
          }}
        >
          👎 No me gusta ({dislikeCount})
        </button>

        <button className="action-btn" onClick={handleSave}>
          💾 Guardar
        </button>
        <button className="action-btn" onClick={handlePerfil}>
          📖 Saber más
        </button>
      </div>
    </div>
  );
}

export default BookCard;
