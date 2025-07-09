import { useEffect, useRef, /*useRef,*/ useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { useLogin } from "../context/contextLogin";
import InputField from "./Input";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api/BookApi";
import { useUser } from "../context/UserContext";

function Chat({ userFriends, oline, socket, roomId }) {
  const { register, handleSubmit, reset } = useForm();
  const { name, id, token } = useLogin();
  const SENDER_NAME = name || "Anonymous";
  const [messages, setMessages] = useState([]);
  const socketRef = socket.current;
  const { user } = useUser();
  const [showBooks, setShowBooks] = useState(false);
  const [books, setbooks] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const fetchBooks = async () => {
    try {
      // Sacar libros de la API
      const response = await getBooks(token);
      setbooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    // Conectar al socket.io
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
  console.log("user:", userFriends);

  function eliminar(idmsg) {
    socketRef.current.emit("delete message", {
      iduser: id,
      id: idmsg,
      roomId: roomId,
    });

    setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== idmsg));
  }
  function messagePerfil(book) {
    socketRef.current.emit("chat message", {
      id: id,
      text: "Perfil de " + book.name,
      sender: SENDER_NAME,
      bookID: book._id,
      roomId: roomId,
    });
    setShowBooks(false); // Cerrar el menú de libros
    reset();
  }

  function handlePerfil(bookid) {
    console.log("ID del libro seleccionado:", bookid);
    const book = books.find((msg) => msg._id === bookid);
    console.log("Libro seleccionado:", book);
    navigate(`/books/PerfilBook`, { state: { book } });
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-serif">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <img src={userFriends.profilePicture} className="rounded-full w-10 h-10 object-cover" alt={userFriends.name} />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{userFriends.name}</p>
            <small>{oline.includes(userFriends._id) ? "🟢 En línea" : "⚪️ Desconectado"}</small>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 py-6 px-8 overflow-y-auto flex flex-col gap-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.userID === id ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-3 rounded-2xl shadow-sm max-w-xs sm:max-w-md md:max-w-lg ${msg.userID === id ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-gray-800 rounded-bl-md border border-gray-200"}`}>
              <img className="rounded-full w-10 h-10 object-cover mb-2" src={msg.userID === id ? user.profilePicture : userFriends.profilePicture} alt="avatar" />
              <span className="message-text block mb-2">{msg.text}</span>

              {msg.bookID && (
                <button className={`p-2 text-sm rounded-full ${msg.userID === id ? "hover:text-white hover:bg-blue-600" : "hover:text-gray-800 hover:bg-gray-200"}`} onClick={() => handlePerfil(msg.bookID)}>
                  Perfil del libro 📚
                </button>
              )}

              {msg.userID === id && (
                <button className="mt-2 block border-red-500 bg-red-500 rounded-full hover:text-white hover:bg-red-700 w-5 h-5 text-center" onClick={() => eliminar(msg._id)} aria-label="Eliminar">
                  X
                </button>
              )}

              <span className="text-xs font-medium text-gray-500 block mt-1">
                {new Date(msg.createdAt).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 relative z-50">
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex items-center space-x-3 relative">
          <div className="flex-1">
            <InputField type="text" name="message" register={register} placeholder="Escribe tu mensaje..." className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div className="relative z-50">
            <button type="button" onClick={() => setShowBooks(!showBooks)} className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xl" aria-label="Mostrar libros">
              📚
            </button>

            {showBooks && (
              <div className="absolute bottom-14 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                {books.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => {
                      messagePerfil(book);
                      setShowBooks(false);
                    }}
                    className="cursor-pointer p-3 hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <h3 className="font-medium text-gray-800">{book.name}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
