import React from "react";

const InputField = ({ 
  type, 
  name, 
  placeholder, 
  register, 
  validationRules = {},
  errors,
  required,
  rows = 4,
  className = ""
}) => {
  return (
    <>
    
        {/* Renderizar el input o el textarea */}
        {type === "textarea" ? (
          <textarea
          required={required}
            name={name}
            placeholder={placeholder}
            rows={rows}
            className={className}
            {...register(name, validationRules)}
          />
        ) : (
          <input
            type={type}
            required={required}
            name={name}
            placeholder={placeholder}
            className={className}
            {...register(name, validationRules)}
          />
        )}

      {/* Mostrar errores si existen */}
      {errors && errors[name] && (
        <span style={{ color: 'red', fontSize: '0.875rem' }}>
          {errors[name].message}
        </span>
      )}
    </>
  );
};

export default InputField;