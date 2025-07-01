export const validateEmail = {
  required: {
    value: true,
    message: "El email es requerido",
  },
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "El email no es válido",
  },
};

export const validatePassword = {
  required: true,
  minLength: {
    value: 6,
    message: "La contraseña debe tener al menos 6 caracteres",
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    message: "Debe tener al menos una letra minúscula, una mayúscula, un número y un carácter especial",
  }
};

export const validateName = {
  required: true,
  pattern: {
    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
    message: "El nombre solo debe contener letras.",
  },
};

export const validateReview  = {
 required: {
     value: true,
    message: "La reseña debe ser requerida",
 } ,

 minLength: {
    value: 10,
    message: "La reseña debe tener al menos 10 caracteres",
  },
    
}

export const validateNumber = {
  required: true,
  pattern: {
    value: /^(?:[0-9]|10)$/,
    message: "Solo se puede de 0 a 10.",
  },
};



