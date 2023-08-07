const loginForm = document.getElementById("login-form");

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
      window.localStorage.setItem(jwt, data);
      console.log(window.localStorage.getItem(jwt));
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        throw new Error("Request failed:", err);
      }
    });
}
