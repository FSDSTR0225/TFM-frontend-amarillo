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
