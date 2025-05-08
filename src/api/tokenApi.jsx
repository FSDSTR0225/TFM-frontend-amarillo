
export const validateToken = async () => {
    const res = await fetch("http://localhost:3000/tasks");
    if (!res.ok) throw new Error("Error while requesting tasks");
    return res.json();
  };

