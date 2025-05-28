import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getUserId, updateUser } from "../api/UserApi";
import genresOptions from "../utils/genresOptions";
import languageOptions from "../utils/languageOptions";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const { user, setUser } = useUser();
  const { register, handleSubmit, watch, setValue } = useForm();
  const [preview, setPreview] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      setOriginalData(user);
      setValue("name", user.name);
      setValue("genres", user.genres);
      setValue("languages", user.languages);
      if (user.photoUrl) setPreview(user.photoUrl);
    };
    fetchUser();
  }, [user, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      setIsChanged(JSON.stringify(value) !== JSON.stringify(originalData));
    });
    return () => subscription.unsubscribe();
  }, [watch, originalData]);

  const onSubmit = async (data) => {
    if (!user || !user._id) {
      setErrorMessage(
        "Usuario no identificado. Por favor vuelve a iniciar sesión."
      );
      return;
    }
    try {
      if (showPasswordFields) {
        if (
          !data.currentPassword ||
          !data.newPassword ||
          !data.confirmPassword
        ) {
          setErrorMessage("Por favor completa todos los campos de contraseña.");
          return;
        }
        if (data.newPassword !== data.confirmPassword) {
          setErrorMessage("Las nuevas contraseñas no coinciden.");
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("genres", JSON.stringify(data.genres));
      formData.append("languages", JSON.stringify(data.languages));
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      if (showPasswordFields) {
        formData.append("currentPassword", data.currentPassword);
        formData.append("newPassword", data.newPassword);
      }

      const token = localStorage.getItem("token");
      const updatedUser = await updateUser(formData);
      setSuccessMessage("Perfil actualizado con éxito.");
      setErrorMessage("");
      setIsChanged(false);
      setShowPasswordFields(false);
      setUser(updatedUser);
      if (updatedUser.photoUrl) setPreview(updatedUser.photoUrl);
    } catch (error) {
      console.error("Detalles del error al actualizar:", error);
      setErrorMessage(error.message || "Error al actualizar el perfil.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      alert("Solo se permiten imágenes menores de 2MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold">Editar Perfil</h2>

      <input
        {...register("name", { required: true })}
        placeholder="Nombre"
        className="w-full border p-2"
      />

      <button
        type="button"
        onClick={() => setShowPasswordFields(!showPasswordFields)}
        className="text-blue-600 underline"
      >
        {showPasswordFields
          ? "Cancelar cambio de contraseña"
          : "Cambiar contraseña"}
      </button>

      {showPasswordFields && (
        <div className="space-y-2">
          <input
            {...register("currentPassword", { required: true })}
            type="password"
            placeholder="Contraseña actual"
            className="w-full border p-2"
          />
          <input
            {...register("newPassword", { required: true, minLength: 6 })}
            type="password"
            placeholder="Nueva contraseña"
            className="w-full border p-2"
          />
          <input
            {...register("confirmPassword", { required: true, minLength: 6 })}
            type="password"
            placeholder="Confirmar nueva contraseña"
            className="w-full border p-2"
          />
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <label>Foto de perfil:</label>
        <input
          type="file"
          {...register("photo")}
          onChange={handleImageChange}
          className="w-full"
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 rounded-full mt-2"
          />
        )}
      </div>

      <div className="flex flex-col space-y-2 mt-4">
        <label>Géneros literarios:</label>
        <select multiple {...register("genres")} className="w-full border p-2">
          {genresOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <label>Idiomas:</label>
      <select
        multiple
        {...register("languages", {
          validate: (v) => Array.isArray(v) && v.length > 0,
        })}
        className="w-full border p-2"
      >
        {languageOptions.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button
        type="submit"
        disabled={!isChanged}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Guardar Cambios
      </button>
    </form>
  );
};

export default Profile;
