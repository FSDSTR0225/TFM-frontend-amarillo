import { useLocation } from "react-router-dom";
import "../styles/PerfilBook.css"; // Asegúrate de tener este archivo CSS
import { useEffect, useState } from "react";
import { useLogin } from "../context/contextLogin";
import { useForm } from "react-hook-form";
import { rewiusBook } from "../api/BookApi";

function PerfilBook() {
  const { register, handleSubmit } = useForm({});

  const location = useLocation();
  const { book } = location.state || {};
  const [dataBook, setdataBook] = useState([]);
  const { token,name } = useLogin();

  console.log(book);

    useEffect(() => {
    fetchBookData();
  }, []);


 

  const fetchBookData = async () => {
    try {
      // mado el token al api
      const response = await dataBook(token, book._id);
      setdataBook(response);
      console.log(dataBook);
    } catch (err) {
      console.log(err);

      //  navigate("/error500");
    }
  };
  //preguntar


  const amazonUrl = `https://www.amazon.es/s?k=${encodeURIComponent(
    book.name
  )}&i=stripbooks`;

  const onSubmitHandler = async (formData) => {
   
      console.log("Datos del formulario:", formData);
      
      try {
        const result = await rewiusBook(formData,name, token,book._id);
  
        if (!result) {
          throw new Error(result.message || "Error en el login");
        }
  
        fetchBookData();
                
      } catch (error) {
        console.error("Error al hacer login:", error.message);
      }
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

        {/* <div className="reviews-section">
          <h3>Opiniones</h3>
          <div className="review">
            <div className="review-header">
              <span className="reviewer-name">Juan Pérez</span>
              <div className="rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star empty">☆</span>
              </div>
            </div>
            <p className="review-text">
              Un libro fascinante que no pude dejar de leer. La trama es
              envolvente y los personajes están muy bien desarrollados.
            </p>
          </div>
        </div> */}

        <div class="review-form-container">
          <h4>Deja tu opinión</h4>
          <form class="review-form" onSubmit={handleSubmit(onSubmitHandler)}>
            <div class="rating-input">
              <span class="rating-label">Tu valoración:</span>
              <input
                type="number"
                name="rating"
                placeholder="Escribe tu valoración aquí..."
                required
                {...register("rating")}
                rows="1"
                class="rating-textarea"
              ></input>
            </div>

            <div class="review-input">
              <textarea
                name="text"
                placeholder="Escribe tu opinión aquí..."
                required
                {...register("text")}
                rows="4"
                class="review-textarea"
              ></textarea>
            </div>

            <button type="submit" class="submit-review">
              Enviar Opinión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PerfilBook;
