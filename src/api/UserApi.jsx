
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


