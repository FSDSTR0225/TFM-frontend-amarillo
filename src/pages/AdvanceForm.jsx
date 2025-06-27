// import React from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/UserApi";
import { useLogin } from "../context/contextLogin";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AdvancedForm = () => {
  const { register, handleSubmit } = useForm({});
  // conexion con el contexto
  const { addLogin } = useLogin();
  const { login } = useUser();
  const navigate = useNavigate();
  const onSubmitHandler = async (formData) => {
    console.log("Datos del formulario:", formData);
    try {
      const result = await loginUser(formData);

      if (!result) {
        throw new Error(result.message || "Error en el login");
      }

      console.log("Login exitosos", result.user);

      const { _id, id, name } = result.user;
      // Aquí  guarda un token y el nombre.
      addLogin({
        id: _id || id,
        name: name || formData.email,
        token: result.access_token,
      });
      login({ ...result.user, _id: result.user._id || result.user.id }, result.access_token);

      localStorage.setItem("token", result.access_token); // 🔐 Guarda el token para futuras peticiones

      // se va a la pagina principal
      navigate("/");
    } catch (error) {
      console.error("Error al hacer login:", error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#FFFFFF] p-[50px] min-h-screen">
      <h1 className="text-4xl font-bold font-serif text-[#280f91] m-[20px]">Inicia Sesión</h1>

      <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col bg-[#f4f6ff] p-[30px] rounded-2xl shadow-md w-full max-w-md">
        <label className="font-serif font-semibold mb-1 text-[#280f91]">Email:</label>
        <input
          type="email"
          className="p-2 border border-[#ccc] rounded mb-3 font-serif"
          {...register("email", {
            required: true,
            message: "El email es requerido",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "El email no es válido",
            },
          })}
        />

        <label className="font-serif font-semibold mb-1 text-[#280f91]">Password:</label>
        <input
          type="password"
          className="p-2 border border-[#ccc] rounded mb-3 font-serif"
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
            pattern: {
              value: /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/,
              message: "Debe contener al menos un número y un carácter especial",
            },
          })}
        />

        <button type="submit" className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif rounded-full p-[10px] mt-4">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AdvancedForm;
