const token = localStorage.getItem("jwt");
const _id = localStorage.getItem("id");
const todoDiv = document.getElementById("todo");

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

      data.map((element) => {
        console.log(element);

        const todoHTML = `
        <div class="card" data-id="${element._id}">
        <div class="content">
        <p class="content-tittle">${element.name}</p>
        <p class="content-description">${element.description}</p>
        </div>
        <div class="card-buttons">
        <button>Edit</button>
        <button>Done</button>
        </div>
        </div>`;

        todoDiv.insertAdjacentHTML("afterbegin", todoHTML);
      });
    })
    .catch((err) => {
      if (err) {
        throw new Error("Request failed:", err);
      }
    });
}
fetchData();
