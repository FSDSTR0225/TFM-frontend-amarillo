export const getBooks = async (token) => {
  const res = await fetch("http://localhost:3000/books", {
    method: "GET",
    headers: { "Content-Type": "application/json",
         authorization: "Bearer " + token,
     },
    
  });
  return res.json();
  }