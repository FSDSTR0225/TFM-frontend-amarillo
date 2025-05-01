import React from "react";
import { useForm } from "react-hook-form";

const AdvancedForm = () => {
  const { register, handleSubmit } = useForm({});

  const onSubmitHandler = (formData) => {
    console.log("Formulario enviado");
    console.log("DATA", formData);
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
            minLength: 6,
          })}
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default AdvancedForm;
