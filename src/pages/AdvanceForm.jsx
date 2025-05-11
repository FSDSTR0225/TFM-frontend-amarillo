// import React from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/UserApi";
import { useLogin } from "../context/contextLogin";
import { useNavigate } from "react-router-dom";

const AdvancedForm = () => {
  const { register, handleSubmit } = useForm({});
// conexion con el contexto
  const { addLogin } = useLogin();
  const navigate = useNavigate();
  const onSubmitHandler = async (formData) => {
    console.log("Datos del formulario:", formData);
    try {
      const result = await loginUser(formData);

      if (!result) {
        throw new Error(result.message || "Error en el login");
      }

      console.log("Login exitosos", result.user);
      // Aquí  guarda un token y el nombre.
      addLogin({
        name: result.user.name || formData.email,
        token: result.access_token,
      });
      // se va a la pagina principal
      navigate("/");
    } catch (error) {
      console.error("Error al hacer login:", error.message);
    }
  };

  return (
    <div>
      <h1>Formulario Avanzado</h1>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <label>Email:</label>
        <input
          type="email"
          {...register("email", {
            required: true,
            message: "El email es requerido",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "El email no es valido",
            },
          })}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
            pattern: {
              value: /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/,
              message:
                "Debe contener al menos un número y un carácter especial",
            },
          })}
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default AdvancedForm;
