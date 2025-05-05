// src/components/BookCard.jsx

import "../styles/BookCard.css";
function BookCard({ book }) {
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
        <button className="action-btn">👍 Me gusta</button>
        <button className="action-btn">💾 Guardar</button>
        <button className="action-btn">📖 Saber más</button>
      </div>
    </div>
  );
}

export default BookCard;
