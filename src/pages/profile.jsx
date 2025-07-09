import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getUserId, updateUser } from "../api/UserApi";
import { useUser } from "../context/UserContext";
import { Camera, Lock, Unlock } from "lucide-react";

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
      setErrorMessage("Usuario no identificado. Por favor vuelve a iniciar sesión.");
      return;
    }
    try {
      if (showPasswordFields) {
        if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
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
      localStorage.setItem("user", JSON.stringify(updatedUser)); //código añadido para ver nombre actualizado en el formulario

      //código añadido para ver nombre actualizado en el formulario
      console.log("Usuario actualizado:", updatedUser);

      setValue("name", updatedUser.name);

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
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-indigo-800 font-serif mb-2 leading-snug">¿Cuál es tu nombre?</h2>
        </div>

        <input {...register("name", { required: true })} placeholder="Nombre" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-serif" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-indigo-800 font-serif mb-2 leading-snug">¿Quieres cambiar la contraseña?</h2>
        </div>
        <button type="button" onClick={() => setShowPasswordFields(!showPasswordFields)} className="flex items-center gap-2 bg-indigo-100 text-indigo-800 font-semibold py-2 px-4 rounded-full shadow hover:bg-indigo-200 transition">
          {showPasswordFields ? (
            <>
              <Unlock size={18} /> Cancelar cambio de contraseña
            </>
          ) : (
            <>
              <Lock size={18} /> Cambiar contraseña
            </>
          )}
        </button>

        {showPasswordFields && (
          <div className="space-y-4">
            <input {...register("currentPassword", { required: true })} type="password" placeholder="Contraseña actual" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-serif" />
            <input {...register("newPassword", { required: true, minLength: 6 })} type="password" placeholder="Nueva contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-serif" />
            <input {...register("confirmPassword", { required: true, minLength: 6 })} type="password" placeholder="Confirmar nueva contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 font-serif" />
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-indigo-800 font-serif mb-2 leading-snug">
            ¿Cómo quieres que te vean? <span className="text-indigo-800 font-bold">¡Elige tu mejor foto de perfil!</span>
          </h2>

          <label className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 font-semibold py-2 px-4 rounded-full shadow hover:bg-indigo-200 transition cursor-pointer">
            <Camera size={18} />
            Seleccionar archivo
            <input type="file" {...register("photo")} onChange={handleImageChange} className="hidden" />
          </label>

          {preview && <img src={preview} alt="preview" className="rounded-full object-cover mt-2 shadow-md" style={{ width: "100px", height: "100px" }} />}
        </div>

        <button type="submit" disabled={!isChanged} className="bg-[#280f91] hover:bg-[#dce1f9] hover:text-[#280f91] text-[#dce1f9] font-bold font-serif rounded-full p-[10px] mt-4 mx-auto block">
          Guardar Cambios
        </button>

        {successMessage && <p className="text-green-700 bg-green-100 border border-green-300 p-3 rounded font-serif text-sm">{successMessage}</p>}

        {errorMessage && <p className="text-red-700 bg-red-100 border border-red-300 p-3 rounded font-serif text-sm">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Profile;
