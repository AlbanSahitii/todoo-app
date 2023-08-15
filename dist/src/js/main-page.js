const token = localStorage.getItem("jwt");
const _id = localStorage.getItem("id");
const todoDiv = document.getElementById("todo");
const completedDiv = document.getElementById("completed");

async function fetchTodo() {
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
        <button>Delete</button>
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
fetchTodo();
async function getCompleted() {
  await fetch("/.netlify/functions/getCompleted", {
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
      </div>`;

        completedDiv.insertAdjacentHTML("afterbegin", todoHTML);
      });
    })
    .catch((err) => {
      if (err) {
        throw new Error("Request failed:", err);
      }
    });
}

const parentElement = document.querySelector(".main-page");

parentElement.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON" && event.target.closest(".card")) {
    const cardElement = event.target.closest(".card");
    const dataId = cardElement.getAttribute("data-id");

    if (event.target.textContent === "Delete") {
      console.log(`Delete button clicked for card with data-id: ${dataId}`);
      deleteTodo(dataId);
    } else if (event.target.textContent === "Done") {
      console.log(`Done button clicked for card with data-id: ${dataId}`);
    }
  }
});

async function deleteTodo(todoId) {
  await fetch("/.netlify/functions/deleteTodo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ _id, todoId }),
  }).then(() => location.reload());
}
