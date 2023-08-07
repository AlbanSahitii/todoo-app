const loginForm = document.getElementById("login-form");
const jwt = localStorage.getItem("jwt");
if (jwt) {
  window.location.href = "/index.html";
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = { email, password };

  fetchData(loginData);
});

async function fetchData(loginData) {
  await fetch("/.netlify/functions/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        localStorage.setItem("jwt", data);
        window.location.href = "/index.html";
      } else {
        console.log(`something went wrong`);
      }
    })
    .catch((err) => {
      if (err) {
        throw new Error("Request failed:", err);
      }
    });
}
