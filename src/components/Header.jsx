import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import LogoImg from "../assets/logo mooday.png";

function Header() {
  return (
    <header className="w-full bg-[#dce1f9] shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-10 py-6">
        <div className="flex flex-col items-center">
          <img src={LogoImg} alt="Mooday Logo" className="w-[250px] object-contain" />
        </div>

        <UserAvatar />
      </div>
    </header>
  );
}

export default Header;
