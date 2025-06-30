const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getBooks = async (token) => {
  const res = await fetch(`${backendUrl}/books`, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();

  }

  export const Bookdata = async (token,id) => {
  const res = await fetch(`${backendUrl}/books/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token, },
    
  });
  return res.json();
  }

   export const rewiusBook = async (data,token,id) => {
  const res = await fetch(`${backendUrl}/books/review/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token, },
    body: JSON.stringify(data),
  });
  return res.json();
  }

 export const deleteRewius = async (data,token,id) => {
  const res = await fetch(`${backendUrl}/books/review/${id}?reviewId=${data}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token, },
  });
  return res.json();
  };

export const getVoteBooks = async (token, bookId, voteType) => {
  const res = await fetch(`${backendUrl}/books/${bookId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },

    body: JSON.stringify({ vote: voteType }),
  });

  return res.json();
};
