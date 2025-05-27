
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

  }

  export const getUserId = async (token,id) => {
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
         authorization: "Bearer " + token,
     },
    
  });
  return res.json();
  };


  export const getUser = async (token) => {
  const res = await fetch(`http://localhost:3000/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();

  }
  



