import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/books";
import Save from "./pages/Save";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      {/* Incluimos el Header fuera de las rutas para que se muestre en todas las páginas */}
      <Header />

      <main>
        {/* Navegación (opcional si la quieres dentro del Header o Footer) */}

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/save" element={<Save />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Incluimos el Footer fuera de las rutas para que se muestre en todas las páginas */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
