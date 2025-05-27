import { useEffect, useState } from "react";
import { getUser } from "../api/UserApi";
import { useLogin } from "../context/contextLogin";

function LookFriends() {
  const [userData, setUserData] = useState([]);
    const { token,id } = useLogin();
    const [searchTerm, setSearchTerm] = useState("");

   const fetchUserData = async () => {
    try {
      const response = await getUser(token);
      if (!response) {
        throw new Error("Error al obtener los datos del usuario");
      }
      const filteredUsers = response.filter(user => user._id !== id);
      setUserData(filteredUsers);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error.message);
    }

   };
 const filteredUsers = userData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
 );
    useEffect(() => {
      fetchUserData();
    }, []);

  return <>
  
    <h1>Look Friends</h1>
    <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    <div className="container">
      {filteredUsers.map((user) => (
        <div key={user._id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  
        </>;
}

export default LookFriends;