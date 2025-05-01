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
        <label>Nombre:</label>
        <input type="text" {...register("nombre")} />
        <br />
        <label>Email:</label>
        <input type="email" {...register("email")} />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default AdvancedForm;
