import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>📚 Mooday</h1>
        <p>Descubre tu próximo libro favorito</p>
      </div>
    </header>
  );
}

export default Header;
