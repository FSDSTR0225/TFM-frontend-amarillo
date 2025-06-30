import { Link } from "react-router-dom";
import { BookOpen, Users, User, Bookmark } from "lucide-react";

function Footer() {
    // if con el islogin
  return (
    <footer className="w-full bg-base-100 border-t border-base-200">
      <nav className="flex justify-around items-center py-2">
        <Link to="/books" className="flex flex-col items-center text-sm text-base-content hover:text-primary">
          <BookOpen className="w-6 h-6" />
          <span className="text-xs">Recomendados</span>
        </Link>

        <Link to="/save" className="flex flex-col items-center text-sm text-base-content hover:text-primary">
          <Bookmark className="w-6 h-6" />
          <span className="text-xs">Guardados</span>
        </Link>

        <Link to="/LookFriends" className="flex flex-col items-center text-sm text-base-content hover:text-primary">
          <Users className="w-6 h-6" />
          <span className="text-xs">Amigos</span>
        </Link>

        <Link to="/profile" className="flex flex-col items-center text-sm text-base-content hover:text-primary">
          <User className="w-6 h-6" />
          <span className="text-xs">Perfil</span>
        </Link>
      </nav>
    </footer>
  );
}

export default Footer;
