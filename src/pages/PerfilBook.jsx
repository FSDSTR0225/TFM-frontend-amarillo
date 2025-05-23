import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PerfilBook.css"; // Asegúrate de tener este archivo CSS
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
  const { token ,id} = useLogin();
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

  const amazonUrl = `https://www.amazon.es/s?k=${encodeURIComponent(
    book.name
  )}&i=stripbooks`;

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await deleteRewius(reviewId,token,book._id);
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
  if (!reviewsArray || reviewsArray.length === 0) 
    return "no hay opiniones";
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
      <div className="container">
        <div className="book-card2">
          <img
            src={book.imgBook || "image-placeholder.jpg"}
            alt={book.name}
            className="book-img2"
          />
          <div className="book-info">
            <h2 className="book-title">{book.name}</h2>
            <p className="book-author">
              <strong>Autor:</strong> {book.author}
            </p>
            <p className="book-genre">
              <strong>Género:</strong> {book.genre}
            </p>
            <p className="book-language">
              <strong>Idioma:</strong> {book.language}
            </p>
            <p className="book-synopsis">
              <strong>Sinopsis:</strong> {book.synopsis}
            </p>
            <p className="book-rating">
              <strong>Valoración:</strong> {promedio(dataBook)}
            </p>
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="buy-button"
            >
              Comprar Ahora
            </a>
          </div>
        </div>
        <button onClick={() => handleBack(book._id)} className="buy-button">
          volver
        </button>

        {/* seccion de opiniones */}
        <div className="book-reviews">
          <h3>Opiniones de los usuarios</h3>
          {dataBook.map((review) => {
            const isCurrentUser = review.user === id;
            console.log("userID", id);

            return (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">
                    Nombre: {userNames[review.user]}
                  </span>
                  <span className="rating">{review.rating}</span>
                </div>
                <p className="review-text">{review.text}</p>

                {isCurrentUser && (
                  <button onClick={() => handleDeleteReview(review._id)}>
                    Eliminar
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="review-form-container">
          <h4>Deja tu opinión</h4>
          <form
            className="review-form"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="rating-input">
              <span className="rating-label">Tu valoración:</span>
              <InputField
                type="number"
                required={true}
                name="rating"
                placeholder="Escribe tu valoración aqui..."
                register={register}
                className="rating-textarea"
                errors={errors}
              />
            </div>

            <div className="review-input">
              <InputField
                type="textarea"
                required={true}
                name="text"
                placeholder="Escribe tu opinión aqui..."
                register={register}
                validationRules={validateReview}
                className="review-textarea"
                errors={errors}
              />
            </div>

            <button type="submit" className="submit-review">
              Enviar Opinión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PerfilBook;
