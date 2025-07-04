// src/pages/Books.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/BookCard";
import FiltersPanel from "../components/FiltersPanel";
import { getBooks, getGenres, getAuthors, getLanguages } from "../api/BookApi";
import { useLogin } from "../context/contextLogin";
import "../styles/Books.css";

function Books() {
  const { token, isLoggedIn } = useLogin();

  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    genre: [],
    language: "",
    author: [],
  });
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  const location = useLocation();
  const { idBook } = location.state || {};

  /* --- Cargar listas de géneros, autores e idiomas --- */
  useEffect(() => {
    if (!token) return;
    (async () => {
      const [g, a, l] = await Promise.all([
        getGenres(token),
        getAuthors(token),
        getLanguages(token),
      ]);
      setGenres(g);
      setAuthors(a);
      setLanguages(["", ...l]);
    })();
  }, [token]);

  /* --- Descargar libros con filtros --- */
  const fetchBooks = useCallback(
    async (currentFilters, resetIndex = true) => {
      if (!token) return;
      const data = await getBooks(token, currentFilters);
      if (!Array.isArray(data)) return setBooks([]);

      setBooks(data);

      const filtersEmpty =
        !currentFilters.name &&
        !currentFilters.genre.length &&
        !currentFilters.language &&
        !currentFilters.author.length;

      if (idBook && filtersEmpty) {
        const idx = data.findIndex((b) => b._id === idBook);
        setCurrentIndex(idx >= 0 ? idx : 0);
      } else if (resetIndex) {
        setCurrentIndex(0);
      }
    },
    [token, idBook]
  );

  /* --- Primera carga --- */
  useEffect(() => {
    fetchBooks({});
    setFiltersApplied(false);
  }, [token, fetchBooks]);

  /* --- Aplicar filtros --- */
  useEffect(() => {
    const active =
      filters.name ||
      filters.genre.length ||
      filters.language ||
      filters.author.length;

    if (active) {
      fetchBooks(filters, true);
      setFiltersApplied(true);
    } else if (filtersApplied) {
      fetchBooks({}, true);
      setFiltersApplied(false);
    }
  }, [filters, fetchBooks, filtersApplied]);

  //Actualiza los votos de contador
  const handleVoteUpdate = (id, like, dislike) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === id ? { ...b, like, dislike } : b))
    );
  };

  //Navegar al siguiente libro
  const handleNext = () => {
    if (books.length) {
      setCurrentIndex((i) => (i + 1) % books.length);
    }
  };

  const handlePrev = () => {
    if (books.length) {
      setCurrentIndex((i) => (i - 1 + books.length) % books.length);
    }
  };

  const handleClearFilters = () =>
    setFilters({ name: "", genre: [], language: "", author: [] });

  if (!isLoggedIn) return <p className="loading">Cargando...</p>;

  return (
    <div className="books-container">
      <h1 className="header">Te apetece leer...</h1>

      <div className="filters-section">
        <h2>Filtra tus recomendaciones</h2>
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          genres={genres}
          authors={authors}
          languages={languages}
        />
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </div>

      <div className="book-card-container">
        {books.length === 0 && filtersApplied && (
          <p>No hay resultados para estos criterios de búsqueda.</p>
        )}
        {books.length === 0 && !filtersApplied && (
          <p>
            No se encontró ningún libro recomendado en nuestra base de datos.
          </p>
        )}

        {books[currentIndex] && (
          <>
            <BookCard
              key={books[currentIndex]._id}
              book={books[currentIndex]}
              onVoteUpdate={handleVoteUpdate}
            />

            {/* NUEVO BOTÓN “Anterior” */}
            <button className="prev-btn" onClick={handlePrev}>
              Anterior
            </button>

            <button className="next-btn" onClick={handleNext}>
              Siguiente
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Books;
