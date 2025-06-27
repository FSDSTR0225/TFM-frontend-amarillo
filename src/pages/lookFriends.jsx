import { useEffect, useRef, useState } from "react";
import { getUser } from "../api/UserApi";
import { useLogin } from "../context/contextLogin";
import { io } from "socket.io-client";
// import { useNavigate } from "react-router-dom";
import Chat from "../components/chat";

function LookFriends() {
  const [userData, setUserData] = useState([]);
  const { token, id } = useLogin();
  const [searchTerm, setSearchTerm] = useState("");
  const socketRef = useRef();
  // const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]); // IDs online
  const [showChat, setShowChat] = useState(false);
  const [roomID, setroomID] = useState("");
  const [userFriends, setuserFriends] = useState([]);

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

    socketRef.current.on("getOnlineUsers", (ids) => {
      setOnlineUsers(ids);
      console.log("Usuarios en línea:", ids);
    });
    console.log(onlineUsers);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  //En tu componente LookFriends, estás creando una nueva conexión de socket cada vez que se llama a roomNavegation, lo cual puede resultar en múltiples conexiones innecesarias.
  function roomNavegation(userId, friend) {
    // Emitir el evento para unirse a la sala
    socketRef.current.emit("room join", { userid1: userId, userid2: friend._id });

    // Escuchar la respuesta del servidor con la ID de la sala
    socketRef.current.on("room joined", ({ roomId }) => {
      // navigate(`/LookFriends/chat/${roomId}`);
     
        setroomID(roomId);
        setShowChat(true);
        setuserFriends( friend );
      
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 ">Look Friends</h1>
      <input
        type="text"
        className=" px-4 py-3 border border-gray-300 rounded-full  focus:ring-2 focus:ring-blue-500 focus:border-transparent"

        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <section class="h-screen flex overflow-hidden">
        <div class="bg-white w-2/12">
          <h2>CHAT LIST</h2>
          <div name="chatList" class=" flex flex-col gap-2 overflow-auto">
            {filteredUsers.map((user) => (
              <div
                name="chatItem"
                className="flex  items-start gap-4  cursor-pointer hover:bg-gray-200 p-2"
                onClick={() => roomNavegation(id, user)}
              >
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.name}
                  className="rounded-full w-12 h-12 object-cover flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-bold">{user.name}</span>
                  <small>
                    {onlineUsers.includes(user._id)
                      ? "🟢 En línea"
                      : "⚪️ Offline"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="bg-gray-100 w-8/10">
          {showChat ? (
            <Chat userFriends={userFriends} oline={onlineUsers} socket={socketRef} roomId={roomID} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Selecciona un chat para comenzar</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default LookFriends;
