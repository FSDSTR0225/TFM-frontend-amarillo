import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFFFF] p-[10px]">
      <h1 className="text-5xl font-bold font-serif text-[#280f91] ">¡HOLA!</h1>

      <p className="text-lg font-serif m-[20px]">Es tu momento de ocio en casa,</p>
      <p className="text-lg font-serif font-bold">¿Empezamos?</p>
      <div className="flex flex-row flex-nowrap justify-center items-center ">
        <button className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif inline-block rounded-full p-[10px] m-[20px]" onClick={() => navigate("/login")}>
          Inicia sesión
        </button>
        <button className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif inline-block rounded-full p-[10px] m-[20px]" onClick={() => navigate("/register")}>
          Regístrate
        </button>
      </div>
    </div>
  );
}

export default Home;
