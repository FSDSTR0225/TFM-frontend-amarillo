const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const validateToken = async (token) => {
    const res = await fetch(`${backendUrl}/token/validate`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
          }
      });
      return res;
      }


