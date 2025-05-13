export const getBooks = async (token) => {
  const res = await fetch(`http://localhost:3000/books`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
         authorization: "Bearer " + token,
     },
    
  });
  return res.json();
  }

  export const dataBook = async (token,id) => {
  const res = await fetch(`http://localhost:3000/books/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token, },
    
  });
  return res.json();
  }

   export const rewiusBook = async (data,name,token,id) => {
  const res = await fetch(`http://localhost:3000/books/review/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token, },
    body: JSON.stringify(data,name),
  });
  return res.json();
  }