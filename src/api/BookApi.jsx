const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getBooks = async (token, filters = {}) => {
  // filters es opcional y por defecto un objeto vacío
  // Construir la URL con los parámetros de consulta
  const queryParams = new URLSearchParams();

  // Solo añade parámetros a la URL si existen y no están vacíos
  // Si quieres un filtro por nombre de libro, asegúrate de que exista en 'filters'
  if (filters.name) {
    queryParams.append("name", filters.name);
  }
  // Para género (que es un array en el backend y en el frontend cuando se selecciona múltiple)
  if (filters.genre && filters.genre.length > 0) {
    queryParams.append("genre", filters.genre.join(",")); // Unir el array con comas
  }
  // Para idioma (que es una cadena simple)
  if (filters.language) {
    queryParams.append("language", filters.language);
  }
  // Para autor (que es un array en el backend y en el frontend cuando se selecciona múltiple)
  if (filters.author && filters.author.length > 0) {
    queryParams.append("author", filters.author.join(",")); // Unir el array con comas
  }

  // Si hay parámetros en queryParams, añádelos a la URL base con '?', de lo contrario, usa solo la URL base
  const url = `${backendUrl}/books${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
//* faltaria una books/ en la url para que funcione y creo que seria mejor ponerlo en otra funcion 
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();
};

export const Bookdata = async (token, id) => {
  const res = await fetch(`${backendUrl}/books/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();
};

export const rewiusBook = async (data, token, id) => {
  const res = await fetch(`${backendUrl}/books/review/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteRewius = async (data, token, id) => {
  const res = await fetch(`${backendUrl}/books/review/${id}?reviewId=${data}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();
};

export const getVoteBooks = async (token, bookId, voteType) => {
  const res = await fetch(`${backendUrl}/books/${bookId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },

    body: JSON.stringify({ vote: voteType }),
  });

  return res.json();
};
//peticiones para obtener géneros y autores
export async function getGenres(token) {
  const response = await fetch(`${backendUrl}/books/genres`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener géneros");
  return response.json();
}

export async function getAuthors(token) {
  const response = await fetch(`${backendUrl}/books/authors`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener autores");
  return response.json();
}

//Función Para obtener idiomas únicos
export async function getLanguages(token) {
const response = await fetch(`${backendUrl}/books/languages`, {
    // <-- Nueva ruta en el backend
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener idiomas");
  return response.json();
}
