// src/components/BookCard.jsx

import "../styles/BookCard.css";
import { useState } from "react";

function BookCard({ book }) {
  const [likeCount, setLikeCount] = useState(book.like || 0);
  const [dislikeCount, setDislikeCount] = useState(book.dislike || 0);
  console.log("contador dislike", book.dislike);
  console.log("contador like", book.like);
  const token = localStorage.getItem("token");

  const handleVote = async (voteType) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${book._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vote: voteType }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al enviar el voto: ${response.status} ${errorText}`);
      }

      const updatedBook = await response.json();
      setLikeCount(updatedBook.like);
      setDislikeCount(updatedBook.dislike);
    } catch (error) {
      console.error("Error al votar:", error);
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

        <button className="action-btn">💾 Guardar</button>
        <button className="action-btn">📖 Saber más</button>
      </div>
    </div>
  );
}

export default BookCard;
