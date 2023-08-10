const token = localStorage.getItem("jwt");
const todoForm = document.getElementById("add-todo");
let todos;
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const _id = localStorage.getItem("id");

  const body = { _id, name, description };

  try {
    todos = await fetchData(body);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
  console.log(todos);
});
async function fetchData(body) {
  const response = await fetch("/.netlify/functions/addTodos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      if (err) {
        throw new Error("Request failed:", err);
      }
    });
}
