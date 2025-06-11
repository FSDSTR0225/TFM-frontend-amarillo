function FiltersPanel({ filters, setFilters, genres, authors, languages }) {
  // <--- Recibir languages
  // const languages = ["", "English", "Spanish", "French", "German"]; // <--- ELIMINAR ESTA LÍNEA

  const handleChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;

    if (multiple) {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFilters((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="filters-panel">
      {/* <h2>Filtra tus recomendaciones</h2> <-- Este título está duplicado en books.jsx, considera quitarlo de aquí */}

      <label>
        Género:
        <select name="genre" value={filters.genre} onChange={handleChange} multiple>
          {/* Opción vacía para "Todos los géneros" */}
          <option value="">Todos los géneros</option> {/* <--- Añadido para mejor UX */}
          {genres.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label>
        Idioma:
        <select name="language" value={filters.language} onChange={handleChange}>
          {/* Iterar sobre la prop languages obtenida de la API */}
          {languages.map((l, i) => (
            <option key={i} value={l}>
              {l === "" ? "Todos" : l}
            </option>
          ))}
        </select>
      </label>

      <label>
        Autor:
        <select name="author" value={filters.author} onChange={handleChange} multiple>
          {/* Opción vacía para "Todos los autores" */}
          <option value="">Todos los autores</option> {/* <--- Añadido para mejor UX */}
          {authors.map((a, i) => (
            <option key={i} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default FiltersPanel;
