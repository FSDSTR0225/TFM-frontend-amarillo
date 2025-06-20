import { useEffect, useRef, useState } from "react";
import { getUser } from "../api/UserApi";
import { useLogin } from "../context/contextLogin";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

function LookFriends() {
  const [userData, setUserData] = useState([]);
  const { token, id } = useLogin();
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]); // IDs online

  const fetchUserData = async () => {
    try {
      const response = await getUser(token);
      if (!response) {
        throw new Error("Error al obtener los datos del usuario");
      }
      const filteredUsers = response.filter((user) => user._id !== id);
      setUserData(filteredUsers);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error.message);
    }
  };
  const filteredUsers = userData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetchUserData();
     socketRef.current = io("http://localhost:3000", {
      query: {
        userId: id,
      },
    });

  }, []);

  // Asegúrate de que el socket esté conectado antes de emitir eventos
  useEffect(() => {
   socketRef.current.on("getOnlineUsers", (ids) => {
      setOnlineUsers(ids);
    });
    console.log(onlineUsers);
    return () => {
      socketRef.current.disconnect();
    };
  }, [socketRef]);


//En tu componente LookFriends, estás creando una nueva conexión de socket cada vez que se llama a roomNavegation, lo cual puede resultar en múltiples conexiones innecesarias.
  function roomNavegation(userId, friendId) {
   

    // Emitir el evento para unirse a la sala
    socketRef.current.emit("room join", { userid1: userId, userid2: friendId });

     // Escuchar la respuesta del servidor con la ID de la sala
    socketRef.current.on("room joined", ({ roomId }) => {
      navigate(`/LookFriends/chat/${roomId}`);
    });
  }

  return (
    <>
      <h1>Look Friends</h1>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="container">
        {filteredUsers.map((user) => (
          <div key={user._id} >
            <img
              src={user.profilePicture || "https://via.placeholder.com/150"}
              alt={user.name}
                 class="size-12 aspect-square rounded-full object-cover"

            />
             {onlineUsers.includes(user._id) ? (
      <span className="online-indicator">🟢 En línea</span>
    ) : (
      <span className="offline-indicator">⚪️ Offline</span>
    )}
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <button onClick={() => roomNavegation(id, user._id)}>unirse</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default LookFriends;
