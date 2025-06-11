import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <nav>
        <ul>
          <li>
            <Link to="/books">Libros recomendados</Link>
          </li>
          <li>
            <Link to="/LookFriends">Buscar Amigos</Link>
          </li>
          <li>
            <Link to="/profile">Perfil</Link>
          </li>
          <li>
            <Link to="/save">Libros guardados</Link>
          </li>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/booksPrueba">prueba</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;
