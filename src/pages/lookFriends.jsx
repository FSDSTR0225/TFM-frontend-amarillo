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
  const filteredUsers = userData.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
      setuserFriends(friend);
    });
  }

  return (
    <>
      <section className="h-[80vh] flex overflow-hidden rounded-xl shadow-lg mx-6 mb-6 font-serif">
        <div className="w-3/12 bg-[#dce1f9] p-6 m-2 flex flex-col rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#280f91] border-b border-[#280f91]/30 pb-3 font-serif">CONVERSACIONES CON TUS AMIGOS</h2>
          <input type="text" className="w-full px-5 py-3 mb-6 rounded-full border-2 border-[#dce1f9] bg-[#dce1f9] text-[#280f91] placeholder-[#280f91]/60 font-serif focus:outline-none focus:ring-4 focus:ring-[#280f91]/40 transition" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div name="chatList" className="flex flex-col gap-4 overflow-auto scrollbar-thin scrollbar-thumb-[#280f91]/60 scrollbar-track-[#dce1f9]">
            {filteredUsers.map((user) => (
              <div key={user._id} name="chatItem" className="flex items-center gap-4 cursor-pointer p-4 rounded-lg hover:bg-[#280f91]/10 transition" onClick={() => roomNavegation(id, user)}>
                <img src={user.profilePicture || "https://via.placeholder.com/150"} alt={user.name} className="rounded-full w-14 h-14 object-cover flex-shrink-0 border-2 border-[#280f91]" />
                <div className="flex flex-col">
                  <span className="font-semibold text-[#280f91] font-serif">{user.name}</span>
                  <small className={`text-sm ${onlineUsers.includes(user._id) ? "text-green-500" : "text-gray-400"}`}>{onlineUsers.includes(user._id) ? "🟢 En línea" : "⚪️ Desconectado"}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-9/12 bg-[#280f91]/10 text-[#280f91] p-8 m-2 flex flex-col rounded-lg overflow-hidden font-serif">{showChat ? <Chat userFriends={userFriends} oline={onlineUsers} socket={socketRef} roomId={roomID} /> : <div className="flex items-center justify-center h-full text-[#280f91]/70 text-lg italic font-serif">Selecciona un chat para comenzar</div>}</div>
      </section>
    </>
  );
}

export default LookFriends;
