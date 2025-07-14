import React, { useState } from "react";

import { registerUser } from "../api/UserApi.jsx";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo debe contener letras.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(formData.lastName)) {
      newErrors.lastName = "El apellido solo debe contener letras.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo no válido.";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Debe tener al menos 8 caracteres.";
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = "Debe contener al menos un número.";
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = "Debe tener al menos un símbolo especial.";
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(formData.password)) {
        newErrors.password = "Debe tener al menos una letra minúscula, una letra mayúscula.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await registerUser(formData);

      if (response.error || response.message?.includes("registrado")) {
        setErrors({
          email: response.message || "El correo ya está registrado.",
        });
        return;
      }

      console.log("Registro exitoso:", response);

      localStorage.setItem("user", JSON.stringify(formData));
      setSubmitted(true);

      navigate("/login");
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h2 className="text-4xl font-bold text-center text-[#280f91] font-serif mb-8">¡Regístrate!</h2>
      <div className="bg-[#f4f6ff] p-10 rounded-2xl shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} autoComplete="given-name" className="p-2 border border-gray-300 rounded font-serif" />
          {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}

          <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} autoComplete="family-name" className="p-2 border border-gray-300 rounded font-serif" />
          {errors.lastName && <p className="text-sm text-red-500 font-medium">{errors.lastName}</p>}

          <input type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} autoComplete="email" className="p-2 border border-gray-300 rounded font-serif" />
          {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email}</p>}

          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} autoComplete="new-password" className="p-2 border border-gray-300 rounded font-serif" />
          {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password}</p>}

          <button type="submit" className="bg-[#dce1f9] hover:bg-[#280f91] hover:text-[#dce1f9] text-[#280f91] font-bold font-serif rounded-full p-3 mt-2">
            Registrarse
          </button>

          {submitted && <p className="text-green-600 text-center font-serif mt-4">¡Registro exitoso!</p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
