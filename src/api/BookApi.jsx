export const getBooks = async (token) => {
  const res = await fetch("http://localhost:3000/books", {
    method: "GET",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },
  });
  return res.json();
};

export const getVoteBooks = async (token, bookId, voteType) => {
  const res = await fetch(`http://localhost:3000/books/${bookId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: "Bearer " + token },

    body: JSON.stringify({ vote: voteType }),
  });

  return res.json();
};

/*
const response = await fetch(`http://localhost:3000/books/${book._id}/vote`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ vote: voteType }),
});

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Error al enviar el voto: ${response.status} ${errorText}`);
}*/
