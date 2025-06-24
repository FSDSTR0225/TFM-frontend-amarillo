import { useEffect, /*useRef,*/ useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { useLogin } from "../context/contextLogin";
import "../styles/Chat.css";
import InputField from "../components/Input";
import { useNavigate, /*useParams*/ } from "react-router-dom";
import { getBooks } from "../api/BookApi";

function Chat( {socket,roomId}) {
  const { register, handleSubmit, reset } = useForm();
  const { name, id, token } = useLogin();
  const SENDER_NAME = name || "Anonymous";
  const [messages, setMessages] = useState([]);
   const socketRef =socket.current;
  // const { roomId } = useParams();
  const [showBooks, setShowBooks] = useState(false);
  const [books, setbooks] = useState([]);
   const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await getBooks(token);
      setbooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    fetchBooks();

    socketRef.current.emit("chat history", { roomId }); // Enviar un mensaje vacío para iniciar la conexión
    // Unirse a la sala de chat con el ID del usuario

    socketRef.current.on("chat history", (history) => {
      setMessages(history); // reemplaza todo el estado con el historial
    });

    console.log("Conectado ", messages);
    socketRef.current.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      // Actualiza el estado si es necesario
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [socket, roomId]);

  const onSubmitHandler = (data) => {
    const message = data.message.trim();

    if (message.length > 0) {
      console.log("Message sent:", message);
      socketRef.current.emit("chat message", {
        id: id,
        text: message,
        sender: SENDER_NAME,
        roomId: roomId,
      });
      reset();
    }
  };

  function eliminar(idmsg) {
    socketRef.current.emit("delete message", {
      iduser: id,
      id: idmsg,
      roomId: roomId,
    });

    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg._id !== idmsg)
    );
  }
  function messagePerfil(book) {
   
    socketRef.current.emit("chat message", {
      id: id,
      text: "Perfil de " + book.name,
      sender: SENDER_NAME,
      bookID: book._id,
      roomId: roomId,
    });
  }

  function handlePerfil(bookid) {
    console.log("ID del libro seleccionado:", bookid);
    const book = books.find((msg) => msg._id === bookid);
    console.log("Libro seleccionado:", book);
    navigate(`/books/PerfilBook`, { state: {  book } });
  }

  return (
    <div className="chat-container">
      <h1>Nuclio - WebSocket Chat</h1>

      <div className="messages">
        {messages.map(
          (msg, index) => (
            console.log("Mensaje recibido:", msg),
            (
              <div key={index} className="message">
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="message-sender">{msg.user}:</span>
                <span className="message-text">{msg.text}</span>
                {msg.bookID && (
                  <button
                    className="book-button"
                    onClick={() => handlePerfil(msg.bookID)}
                  >
                    {" "}
                    Perfil del libro 📚{" "}
                  </button>
                )}

                {msg.userID === id && (
                  <button
                    className="delete-button"
                    onClick={() => eliminar(msg._id)}
                  >
                    X
                  </button>
                )}
              </div>
            )
          )
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="input-form">
        <InputField
          type="text"
          name="message"
          register={register}
          placeholder="Type a message..."
        />
        <button onClick={() => setShowBooks(!showBooks)}> 📚 Libros </button>

        {showBooks && (
          <div className="book-list">
            {books.map((book) => (
              <div
                key={book._id}
                className="book-item"
                onClick={() => messagePerfil(book)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3>{book.name}</h3>
                <p>{book.author}</p>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
