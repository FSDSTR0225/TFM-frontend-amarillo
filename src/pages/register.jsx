import React, { useState } from "react";
import "../styles/register.css";
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
        newErrors.password =
          "Debe tener al menos una letra minúscula, una letra mayúscula.";
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

      navigate("/profile");
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Mooday</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            autoComplete="given-name"
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" className="register-button">
            Registrarse
          </button>

          {submitted && <p className="success"></p>}
        </form>
      </div>
    </div>
  );
}

export default Register;
