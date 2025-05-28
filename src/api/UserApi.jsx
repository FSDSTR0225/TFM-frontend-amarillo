export const registerUser = async (data) => {
  const res = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getUserId = async (token, id) => {
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  return res.json();
};

export const updateUser = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:3000/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al actualizar el perfil");
  }

  const data = await res.json();
  console.log("Usuario actualizado:", data);

  return data.user;
};
