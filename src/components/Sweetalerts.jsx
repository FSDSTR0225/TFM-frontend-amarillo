import Swal from "sweetalert2";
export const confirmDeleteAlert = async (item = "este elemento") => {
  return await Swal.fire({
    title: `¿Estás seguro que deseas eliminar ${item}?`,
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "confirm-button",
      cancelButton: "cancel-button",
    },
  });
};

export const showAlert = (title, text, icon = "success") => {
  return Swal.fire({
    title,
    text,
    icon,
    timer: 2000,
    showConfirmButton: false,
    customClass: {
      confirmButton: "confirm-button",
    },
  });
};
