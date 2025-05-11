import { useNavigate } from 'react-router-dom';


function Home() {

const navigate = useNavigate();





  return <>
  
  
  
  <h1>Página de Inicio</h1>
  <button onClick={() => navigate("/login")}>login</button>
  <button >register</button>
  <button onClick={() => navigate("/books")}>books</button>

  
  
  </>;
}

export default Home;
