// src/components/BookCard.jsx
function BookCard({ book }) {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} />
      <h2>{book.title}</h2>
      <p>
        <strong>Autor:</strong> {book.author}
      </p>
      <p>
        <strong>Género:</strong> {book.genre}
      </p>
      <p>
        <strong>Idioma:</strong> {book.language}
      </p>
      <p>
        <strong>Sinopsis:</strong> {book.description}
      </p>

      <div className="book-card-actions">
        <button>👍 Me gusta</button>
        <button>💾 Guardar</button>
        <button>📖 Saber más</button>
      </div>
    </div>
  );
}

export default BookCard;
