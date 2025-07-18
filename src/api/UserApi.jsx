const backendUrl = import.meta.env.VITE_BACKEND_URL;



export const registerUser = async (data) => {
  const res = await fetch(`${backendUrl}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${backendUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};



export const getUserId = async (token, id) => {
  const res = await fetch(`${backendUrl}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,

    },
  });

  return res.json();
};



export const getPreferences = async (token, id) => {
  const res = await fetch(`${backendUrl}/users/preferences/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
  });
  return res.json();
};

export const postPreferences = async (token, id, data) => {
  const res = await fetch(`${backendUrl}/users/preferences/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({ voteType: data }),
  });
  return res.json();
};

export const getLikes = async (token, id) => {
  const res = await fetch(`${backendUrl}/users/like/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
     });
  return res.json();
};
    

export const updateUser = async (token ,formData) => {
 
  const res = await fetch(`${backendUrl}/users/profile`, {
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

export const getUser = async (token) => {
  const res = await fetch(`${backendUrl}/users/all`, {

    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();
};


export const deleteUserApi = async (token,id) => {
  const res = await fetch(`${backendUrl}/users/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();
};
