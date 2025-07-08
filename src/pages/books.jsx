// src/pages/Books.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/BookCard";
import FiltersPanel from "../components/FiltersPanel";
import { getBooks, getGenres, getAuthors, getLanguages } from "../api/BookApi";
import { useLogin } from "../context/contextLogin";
import "../styles/Books.css";
import { getLikes, getPreferences } from "../api/UserApi";

function Books() {
  const { token, isLoggedIn, id } = useLogin();

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




  const filtro = async (response) => {
      try {
        const prefe = await getPreferences(token, id);
  
        // obtenemos la lista de autores preferidos
        const autoresPref = prefe.authors || [];
        const genresPref = prefe.genres || [];
        const languagePref = prefe.language || [];
  
        console.log("Autores preferidos:", autoresPref);
        // filtramos por autor (primero)
        const filtrados = response.filter(
          (libro) =>
            autoresPref.some((autorPref) => libro.author?.includes(autorPref))  ||
          genresPref.some((genresPref) => libro.genre?.includes(genresPref)) ||
          languagePref.some((languagePref) =>
            libro.language?.includes(languagePref)
          )
        );
        console.log("Libros filtrados1:", filtrados);
        return filtrados;
      } catch (err) {
        console.log(err);
  
       
      }
    };

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
       const likes = await getLikes(token, id);
              console.log("Likes:", likes);
              if (likes.length >= 3) {
                const filtrados = await filtro(data);
                setBooks(filtrados);
              }else {

            setBooks(data);
              }

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
   
  }, []);


   


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

  const recalcFiltered = async (baseBooks) => {
  const likes = await getLikes(token, id);
  if (likes.length >= 3) {
    console.log("Aplicando filtro de preferencias");
    return await filtro(baseBooks);
  } else {
    console.log("No se aplican filtros de preferencias",baseBooks);
    return baseBooks;
  }
};

// navegación entre libros
const handleNext = async () => {
  const base = await getBooks(token, filters); // o usar books si ya lo tienes
  const newBooks = await recalcFiltered(base);
  setBooks(newBooks);
  if (newBooks.length) {
    setCurrentIndex(i => (i + 1) % newBooks.length);
  }
};

const handlePrev = async () => {
  const base = await getBooks(token, filters);
  const newBooks = await recalcFiltered(base);
  setBooks(newBooks);
  if (newBooks.length) {
    setCurrentIndex(i => (i - 1 + newBooks.length) % newBooks.length);
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
