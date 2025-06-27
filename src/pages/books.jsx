import { useEffect, useState, useCallback } from "react";
import BookCard from "../components/BookCard";
import "../styles/Books.css";
import { getBooks, getGenres, getAuthors, getLanguages } from "../api/BookApi";
import { useLogin } from "../context/contextLogin";
import { useLocation } from "react-router-dom";
import FiltersPanel from "../components/FiltersPanel";

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
  const [filtersCurrentlyApplied, setFiltersCurrentlyApplied] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const location = useLocation();
  const { idBook } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresData, authorsData, languagesData] = await Promise.all([
          getGenres(token),
          getAuthors(token),
          getLanguages(token),
        ]);
        console.log("Genres desde la API:", genresData);
        console.log("Languages desde la API:", languagesData);
        setGenres(genresData);
        setAuthors(authorsData);
        setLanguages(["", ...languagesData]);
      } catch (error) {
        console.error(
          "Error al obtener datos de filtros (géneros/autores/idiomas):",
          error
        );
      }
    };
    if (token) fetchData();
  }, [token]);

  const fetchBooks = useCallback(
    async (currentFilters, shouldResetIndex = true) => {
      if (!token) return;
      try {
        const response = await getBooks(token, currentFilters);

        if (!Array.isArray(response)) {
          console.error("getBooks no devolvió un array:", response);
          setBooks([]);
          return;
        }

        setBooks(response);

        const isInitialOrClearedFilter =
          !currentFilters.name &&
          Array.isArray(currentFilters.genre) &&
          currentFilters.genre.length === 0 &&
          !currentFilters.language &&
          Array.isArray(currentFilters.author) &&
          currentFilters.author.length === 0;

        if (idBook && isInitialOrClearedFilter) {
          const idx = response.findIndex((b) => b._id === idBook);
          setCurrentIndex(idx >= 0 ? idx : 0);
        } else if (shouldResetIndex) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error al obtener los libros:", err);
        setBooks([]);
      }
    },
    [token, idBook]
  );

  useEffect(() => {
    fetchBooks({});
    setFiltersCurrentlyApplied(false);
  }, [token, fetchBooks]);

  useEffect(() => {
    const areFiltersActive =
      filters.name ||
      (Array.isArray(filters.genre) && filters.genre.length > 0) ||
      filters.language ||
      (Array.isArray(filters.author) && filters.author.length > 0);

    if (areFiltersActive) {
      fetchBooks(filters, true);
      setFiltersCurrentlyApplied(true);
    } else {
      if (filtersCurrentlyApplied) {
        fetchBooks({}, true);
        setFiltersCurrentlyApplied(false);
      }
    }
  }, [filters, fetchBooks, filtersCurrentlyApplied]);

  const handleNext = () => {
    if (books.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      genre: [],
      language: "",
      author: [],
    });
  };

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
        {books?.length === 0 && filtersCurrentlyApplied && (
          <p>No hay resultados para estos criterios de búsqueda.</p>
        )}
        {books?.length === 0 && !filtersCurrentlyApplied && (
          <p>
            No se encontró ningún libro recomendado en nuestra base de datos.
          </p>
        )}

        {books?.[currentIndex] && (
          <>
            <BookCard book={books[currentIndex]} />
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
