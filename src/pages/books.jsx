import { useEffect, useState, useCallback } from "react";
import BookCard from "../components/BookCard";

import { getBooks, getGenres, getAuthors, getLanguages } from "../api/BookApi"; // <--- Importar getLanguages
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
    language: "", // Sigue siendo una cadena para el select simple
    author: [],
  });
  const [filtersCurrentlyApplied, setFiltersCurrentlyApplied] = useState(false);

  // NUEVO ESTADO: para almacenar los idiomas obtenidos de la API
  const [languages, setLanguages] = useState([]); // <--- Nuevo estado

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const location = useLocation();
  const { idBook } = location.state || {};

  // Cargar géneros, autores Y LENGUAJES desde la API cuando el token está disponible
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizamos todas las peticiones en paralelo
        const [genresData, authorsData, languagesData] = await Promise.all([
          // <--- Añadir languagesData
          getGenres(token),
          getAuthors(token),
          getLanguages(token), // <--- Llamada a la nueva función
        ]);
        console.log("Genres desde la API:", genresData);
        console.log("Languages desde la API:", languagesData); // Para depuración
        setGenres(genresData);
        setAuthors(authorsData);
        setLanguages(["", ...languagesData]); // <--- Guardar idiomas, añadiendo una opción vacía "Todos"
      } catch (error) {
        console.error("Error al obtener datos de filtros (géneros/autores/idiomas):", error);
      }
    };
    if (token) fetchData();
  }, [token]);

  const fetchBooks = useCallback(
    async (currentFilters, shouldResetIndex = true) => {
      if (!token) return;
      try {
        const response = await getBooks(token, currentFilters);
        setBooks(response);
        const isInitialOrClearedFilter = !currentFilters.name && currentFilters.genre.length === 0 && !currentFilters.language && currentFilters.author.length === 0;

        if (idBook && isInitialOrClearedFilter) {
          const idx = response.findIndex((b) => b._id === idBook);
          if (idx >= 0) setCurrentIndex(idx);
          else setCurrentIndex(0);
        } else if (shouldResetIndex) {
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error al obtener los libros:", err);
      }
    },
    [token, idBook]
  );

  useEffect(() => {
    fetchBooks({});
    setFiltersCurrentlyApplied(false);
  }, [token, fetchBooks]);

  useEffect(() => {
    const areFiltersActive = filters.name || filters.genre.length > 0 || filters.language || filters.author.length > 0;
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
    if (currentIndex < books.length - 1) {
      setCurrentIndex((prev) => prev + 1);
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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-serif font-bold text-indigo-800 mb-8">¿Qué te apetece leer?</h1>

      <section className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 mb-8">
        <FiltersPanel filters={filters} setFilters={setFilters} genres={genres} authors={authors} languages={languages} />

        <button className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif rounded-full p-[10px] mt-4" onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </section>

      <section className="w-full max-w-3xl flex flex-col items-center">
        {books.length === 0 && filtersCurrentlyApplied && <p className="text-center text-gray-500">No hay resultados para estos criterios de búsqueda.</p>}
        {books.length === 0 && !filtersCurrentlyApplied && <p className="text-center text-gray-500">No se encontró ningún libro recomendado en nuestra base de datos.</p>}

        {books[currentIndex] && (
          <>
            <div className="w-full">
              <BookCard book={books[currentIndex]} />
            </div>

            {currentIndex < books.length - 1 && (
              <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded shadow-lg transition" onClick={handleNext}>
                Siguiente
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Books;
