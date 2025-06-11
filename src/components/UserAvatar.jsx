import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div className="relative">
      <img
        src={
          user.profilePicture?.includes("/upload/")
            ? user.profilePicture.replace(
                "/upload/",
                "/upload/w_40,h_40,c_fill/"
              )
            : "/default-avatar.png"
        }
        alt="avatar"
        className="w-10 h-10 rounded-full cursor-pointer border"
        onClick={toggleMenu}
      />
      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow w-40 z-50">
          <button
            onClick={() => navigate("/profile")}
            className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
          >
            Ver perfil
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 text-red-500"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
