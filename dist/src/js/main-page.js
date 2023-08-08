const token = localStorage.getItem("jwt");
const _id = localStorage.getItem("id");
async function fetchData() {
  await fetch("/.netlify/functions/getTodos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ _id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      if (err) {
        throw new Error("Request failed:", err);
      }
    });
}

fetchData();
