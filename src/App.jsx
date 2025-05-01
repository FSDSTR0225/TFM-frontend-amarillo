import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Books from "./pages/books";
import Save from "./pages/save";
import Profile from "./pages/profile";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/books">Libros recomendados</Link>
          </li>
          <li>
            <Link to="/save">Libros guardados</Link>
          </li>
          <li>
            <Link to="/profile">Perfil</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/save" element={<Save />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
