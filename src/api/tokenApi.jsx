
export const validateToken = async (token) => {
    const res = await fetch("http://localhost:3000/token/validate", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
          }
      });
      return res;
      }


