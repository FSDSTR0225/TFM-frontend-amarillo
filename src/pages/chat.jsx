import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import { useLogin } from "../context/contextLogin";
import "../styles/Chat.css";
import InputField from "../components/Input";
import { useParams } from "react-router-dom";

function Chat() {
  const { register, handleSubmit, reset } = useForm();
  const { name, id } = useLogin();
  const SENDER_NAME = name || "Anonymous";
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { roomId } = useParams();

  

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");


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
  }, []);

  const onSubmitHandler = (data) => {
    const message = data.message.trim();
    console.log("Message sent:", message);
    if (message) {
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

  return (
    <div className="chat-container">
      <h1>Nuclio - WebSocket Chat</h1>

      <div className="messages">
        {messages.map((msg, index) => (
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
            {msg.userID === id && (
              <button
                className="delete-button"
                onClick={() => eliminar(msg._id)}
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="input-form">
        <InputField
          type="text"
          name="message"
          register={register}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
