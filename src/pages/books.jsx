// src/pages/Books.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/BookCard";
import FiltersPanel from "../components/FiltersPanel";
import { getBooks, getGenres, getAuthors, getLanguages } from "../api/BookApi";
import { useLogin } from "../context/contextLogin";
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

  useEffect(() => {
    const booksAll = async () => {
      try {
        // mado el token al api
        const response = await getBooks(token);

        setBooks(response);
        // Si venimos desde la vista de detalle con un idBook,
        if (idBook) {
          const idx = response.findIndex((b) => b._id === idBook);
          if (idx >= 0) setCurrentIndex(idx);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooks({});
    setFiltersApplied(false);
    booksAll();
  }, []);

  const filtro = async (response) => {
    try {
      const prefe = await getPreferences(token, id);

      // obtenemos la lista de autores preferidos
      const autoresPref = prefe.authors || [];
      const genresPref = prefe.genres || [];
      const languagePref = prefe.language || [];

      console.log("Autores preferidos:", autoresPref);
      // filtramos por autor (primero)
      const filtrados = response.filter((libro) => autoresPref.some((autorPref) => libro.author?.includes(autorPref)) || genresPref.some((genresPref) => libro.genre?.includes(genresPref)) || languagePref.some((languagePref) => libro.language?.includes(languagePref)));
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
      const [g, a, l] = await Promise.all([getGenres(token), getAuthors(token), getLanguages(token)]);
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
      } else {
        setBooks(data);
      }

      const filtersEmpty = !currentFilters.name && !currentFilters.genre.length && !currentFilters.language && !currentFilters.author.length;

      if (idBook && filtersEmpty) {
        const idx = data.findIndex((b) => b._id === idBook);
        setCurrentIndex(idx >= 0 ? idx : 0);
      } else if (resetIndex) {
        setCurrentIndex(0);
      }
    },
    [token, idBook]
  );

  /* --- Aplicar filtros --- */
  useEffect(() => {
    const active = filters.name || filters.genre.length || filters.language || filters.author.length;

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
    setBooks((prev) => prev.map((b) => (b._id === id ? { ...b, like, dislike } : b)));
  };

  // Recalcula los libros filtrados según las preferencias del usuario
  // Si el usuario tiene al menos 3 libros "gustados", aplica el filtro de preferencias
  const recalcFiltered = async (baseBooks) => {
    const likes = await getLikes(token, id);
    console.log("Likes:", likes);
    if (likes.length >= 3) {
      console.log("Aplicando filtro de preferencias");
      return await filtro(baseBooks);
    } else {
      console.log("No se aplican filtros de preferencias", baseBooks);
      return baseBooks;
    }
  };

  // navegación entre libros
  const handleNext = async () => {
    const base = await getBooks(token, filters); // o usar books si ya lo tienes
    const newBooks = await recalcFiltered(base);
    setBooks(newBooks);
    if (newBooks.length) {
      setCurrentIndex((i) => (i + 1) % newBooks.length);
    }
  };

  // Navegación hacia el libro anterior
  const handlePrev = async () => {
    const base = await getBooks(token, filters);
    const newBooks = await recalcFiltered(base);
    setBooks(newBooks);
    if (newBooks.length) {
      setCurrentIndex((i) => (i - 1 + newBooks.length) % newBooks.length);
    }
  };

  const handleClearFilters = () => setFilters({ name: "", genre: [], language: "", author: [] });

  if (!isLoggedIn) return <p className="loading">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center font-serif">
      <h1 className="text-4xl font-serif font-bold text-indigo-800 mb-8">¿Qué te apetece leer?</h1>

      <section className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 mb-8 font-serif">
        <FiltersPanel filters={filters} setFilters={setFilters} genres={genres} authors={authors} languages={languages} />

        <button className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif rounded-full p-[10px] mt-4 mx-auto block" onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </section>

      <section className="w-full max-w-3xl flex flex-col items-center relative">
        {books.length === 0 && filtersApplied && <p className="text-center text-gray-500 font-serif">No hay resultados para estos criterios de búsqueda.</p>}
        {books.length === 0 && !filtersApplied && <p className="text-center text-gray-500 font-serif">No se encontró ningún libro recomendado en nuestra base de datos.</p>}

        {books[currentIndex] && (
          <>
            {/* Contenedor relativo para posicionar botones */}
            <div className="relative w-full flex justify-center items-center">
              {/* Botón Anterior */}
              <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#280f91] hover:bg-[#dce1f9] hover:text-[#280f91] text-[#dce1f9] font-bold rounded-full p-[10px] z-10" onClick={handlePrev}>
                ←
              </button>

              {/* Tarjeta del libro */}
              <BookCard key={books[currentIndex]._id} book={books[currentIndex]} onVoteUpdate={handleVoteUpdate} />

              {/* Botón Siguiente */}
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#280f91] hover:bg-[#dce1f9] hover:text-[#280f91] text-[#dce1f9] font-bold rounded-full p-[10px] z-10" onClick={handleNext}>
                →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Books;
