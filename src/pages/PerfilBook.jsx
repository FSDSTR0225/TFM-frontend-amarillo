import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PerfilBook.css"; // Asegúrate de tener este archivo CSS
import { useEffect, useState } from "react";
import { useLogin } from "../context/contextLogin";
import { useForm } from "react-hook-form";
import { Bookdata, rewiusBook } from "../api/BookApi";
import { getUserId } from "../api/UserApi";

function PerfilBook() {
  const { register, handleSubmit } = useForm({});
  const navigate = useNavigate();
  const location = useLocation();
  const { book } = location.state || {};
  const [dataBook, setdataBook] = useState([]);
  const { token } = useLogin();
  const [userNames, setUserNames] = useState({});

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
        })
      );

      setUserNames(namesMap); // guardas los nombres
      setdataBook(reviews); // guardas las opiniones
      console.log("datos del libro" + dataBook);
      console.log("datos del user" + namesMap);
    } catch (err) {
      console.log(err);

      //  navigate("/error500");
    }
  };

  const amazonUrl = `https://www.amazon.es/s?k=${encodeURIComponent(
    book.name
  )}&i=stripbooks`;

  const onSubmitHandler = async (formData) => {
    console.log("Datos del formulario:", formData);

    try {
      const result = await rewiusBook(formData, token, book._id);

      if (!result) {
        throw new Error(result.message || "Error en el login");
      }

      fetchBookData();
    } catch (error) {
      console.error("Error al hacer login:", error.message);
    }
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
        <div className="book-reviews">
          <h3>Opiniones de los usuarios</h3>
          {dataBook.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <span className="reviewer-name">
                  Nombre: {userNames[review.user]}
                </span>
                <span className="rating">{review.rating}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="review-form-container">
          <h4>Deja tu opinión</h4>
          <form
            className="review-form"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <div className="rating-input">
              <span className="rating-label">Tu valoración:</span>
              <input
                type="number"
                name="rating"
                placeholder="Escribe tu valoración aquí..."
                required
                {...register("rating")}
                rows="1"
                className="rating-textarea"
              ></input>
            </div>

            <div className="review-input">
              <textarea
                name="text"
                placeholder="Escribe tu opinión aquí..."
                required
                {...register("text")}
                rows="4"
                className="review-textarea"
              ></textarea>
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
