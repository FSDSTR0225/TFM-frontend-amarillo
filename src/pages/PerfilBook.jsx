import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useLogin } from "../context/contextLogin";
import { useForm } from "react-hook-form";
import { Bookdata, deleteRewius, rewiusBook } from "../api/BookApi";
import { getUserId } from "../api/UserApi";
import InputField from "../components/Input";
import { validateReview } from "../components/ValidateInput";

function PerfilBook() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const navigate = useNavigate();
  const location = useLocation();
  const { book } = location.state || {};
  const [dataBook, setdataBook] = useState([]);
  const { token, id } = useLogin();
  const [userNames, setUserNames] = useState({});
  const [userID, setUserID] = useState({});

  useEffect(() => {
    fetchBookData();
  }, []);

  const fetchBookData = async () => {
    try {
      // mado el token al api
      const response = await Bookdata(token, book._id);
      const reviews = response.review;

      // Mapa para guardar nombres por ID
      const namesMap = {};

      // Buscar nombres
      await Promise.all(
        reviews.map(async (review) => {
          const userData = await getUserId(token, review.user);
          namesMap[review.user] = userData.name;
          userID[review.user] = userData._id;
        })
      );

      setUserNames(namesMap); // guardas los nombres
      setdataBook(reviews); // guardas las opiniones
      setUserID(userID); // guardas los ids
      console.log("datos del libro" + dataBook);
      console.log("datos del user" + namesMap);
    } catch (err) {
      console.log(err);
    }
  };

  const amazonUrl = `https://www.amazon.es/s?k=${encodeURIComponent(book.name)}&i=stripbooks`;

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await deleteRewius(reviewId, token, book._id);
      if (!response) {
        throw new Error(response.message || "Error al ELIMINAR");
      }
      fetchBookData();
    } catch (error) {
      console.error("Error al hacer login:", error.message);
    }
  };
  const onSubmitHandler = async (formData) => {
    console.log("Datos del formulario:", formData);

    try {
      const result = await rewiusBook(formData, token, book._id);

      if (!result) {
        throw new Error(result.message || "Error al enviar la opinión");
      }

      fetchBookData();
      reset();
    } catch (error) {
      console.error("Error al hacer login:", error.message);
    }
  };

  const promedio = (reviewsArray) => {
    if (!reviewsArray || reviewsArray.length === 0) return "no hay opiniones";
    const total = reviewsArray.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviewsArray.length).toFixed(1); // .toFixed para un decimal
  };

  // volver a la pagina anterior
  const handleBack = (idBook) => {
    navigate("/books", { state: { idBook } });
  };

  if (!book) {
    return <p>No hay información del libro disponible.</p>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 font-serif">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden">
          <img src={book.imgBook || "image-placeholder.jpg"} alt={book.name} className="w-full md:w-1/3 object-cover h-64 md:h-auto" />
          <div className="p-6 flex flex-col gap-3">
            <h2 className="text-2xl font-semibold">{book.name}</h2>
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
              <strong>Sinopsis:</strong> {book.synopsis}
            </p>
            <p>
              <strong>Valoración:</strong> {promedio(dataBook)}
            </p>
            <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif rounded-full p-[10px] mt-4">
              Comprar Ahora
            </a>
          </div>
        </div>

        <button onClick={() => handleBack(book._id)} className="mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition">
          Volver
        </button>

        {/* Opiniones */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Opiniones de los usuarios</h3>
          {dataBook.map((review) => {
            const isCurrentUser = review.user === id;

            return (
              <div key={review._id} className="bg-gray-100 rounded p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Nombre: {userNames[review.user]}</span>
                  <span className="text-yellow-600 font-semibold">{review.rating}</span>
                </div>
                <p className="text-gray-700">{review.text}</p>

                {isCurrentUser && (
                  <button onClick={() => handleDeleteReview(review._id)} className="mt-2 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition">
                    Eliminar
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Formulario de opinión */}
        <div className="flex flex-col justify-center  bg-[#FFFFFF]">
          <h4 className="text-xl font-bold font-serif text-[#280f91] m-[15px]">Deja tu opinión</h4>
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tu valoración:</label>
              <InputField type="number" required={true} name="rating" placeholder="Escribe tu valoración aqui..." register={register} className="w-full border border-gray-300 rounded px-3 py-2" errors={errors} />
            </div>

            <div>
              <InputField type="textarea" required={true} name="text" placeholder="Escribe tu opinión aqui..." register={register} validationRules={validateReview} className="w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none" errors={errors} />
            </div>

            <button type="submit" className="flex items-center justify-centergap-2 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition">
              Enviar Opinión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PerfilBook;
