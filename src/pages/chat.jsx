import { useEffect, /*useRef,*/ useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { useLogin } from "../context/contextLogin";
// import "../styles/Chat.css";
import InputField from "../components/Input";
import { useNavigate /*useParams*/ } from "react-router-dom";
import { getBooks } from "../api/BookApi";

function Chat({ socket, roomId }) {
  const { register, handleSubmit, reset } = useForm();
  const { name, id, token } = useLogin();
  const SENDER_NAME = name || "Anonymous";
  const [messages, setMessages] = useState([]);
  const socketRef = socket.current;
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
    navigate(`/books/PerfilBook`, { state: { book } });
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b  border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">
                 <img src="../public/vite.svg" class="rounded-full" />
              </span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{name}</p>
            <p className="text-sm text-gray-500">ID: {id}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="py-8 px-20 " >
    
        {messages.map(
          (msg, index) => (
            console.log("Mensaje recibido:", msg),
            (
              <div key={index}  className={`flex ${msg.userID === id ? 'justify-end' : 'justify-start'} mb-8`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.userID === id 
                    ? 'bg-blue-500 text-white rounded-br-md' 
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                }`}>
              <img className="rounded-full w-12 h-12 " src="../public/vite.svg"></img>
               
              
                <span className="message-text">{msg.text}</span>
                {msg.bookID && (
                  <button
                    className={`p-4 block    
                      
                     ${
                  msg.userID === id ? 'hover:text-white hover:bg-blue-600': 'hover:text-gray hover:bg-gray-200'}
                      
                      
                      rounded-full`}
                    onClick={() => handlePerfil(msg.bookID)}
                  >
                   
                    Perfil del libro 📚
                  </button>
                )}

                {msg.userID === id && (
                  <button
                    className="block border-red-500 bg-red-500 rounded-full hover:text-white hover:bg-red-700 w-5 h-5  text-center"
                    onClick={() => eliminar(msg._id)}
                  >
                    X
                  </button>
                )}
                 <span className="text-xs font-medium text-black-500 block">
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
            )
          )
        )}
   
      </div>


      {/* Input Form */}
      <form onSubmit={handleSubmit(onSubmitHandler)} className="input-form">
        <InputField
          type="text"
          name="message"
          register={register}
          placeholder="Type a message..."
        />
        <button onClick={() => setShowBooks(!showBooks)}> 📚 </button>

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
