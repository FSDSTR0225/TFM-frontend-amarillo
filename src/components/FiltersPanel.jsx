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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <label className="flex flex-col text-gray-700 font-medium font-serif">
        Género:
        <select
          name="genre"
          value={filters.genre}
          onChange={handleChange}
          multiple
          className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer"
          size={genres.length > 5 ? 5 : genres.length + 1} // Para mostrar más opciones visibles
        >
          <option value="">Todos los géneros</option>
          {genres.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-gray-700 font-medium font-serif">
        Idioma:
        <select name="language" value={filters.language} onChange={handleChange} className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer">

          {languages.map((l, i) => (
            <option key={i} value={l}>
              {l === "" ? "Todos" : l}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-gray-700 font-medium font-serif">
        Autor:
        <select name="author" value={filters.author} onChange={handleChange} multiple className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer" size={authors.length > 5 ? 5 : authors.length + 1}>
          <option value="">Todos los autores</option>

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
