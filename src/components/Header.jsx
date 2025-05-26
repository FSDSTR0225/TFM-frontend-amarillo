import { Link } from "react-router-dom";
import "../styles/Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>📚 Mooday</h1>
        <p>Descubre tu próximo libro favorito</p>
      </div>
      <Link to="/save">📚 Libros Guardados</Link>
    </header>
  );
}

export default Header;
