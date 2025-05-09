import React from "react";
import { useForm } from "react-hook-form";

const AdvancedForm = () => {
  const { register, handleSubmit } = useForm({});

  /*const onSubmitHandler = (formData) => {
    console.log("Formulario enviado");
    console.log("DATA", formData);
  };*/
  const onSubmitHandler = async (formData) => {
    console.log("Formulario enviado");
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error en el login");
      }

      console.log("Login exitoso", result);
      // Aquí puedes guardar un token, redirigir, etc.
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
