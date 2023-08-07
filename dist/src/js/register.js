const registerForm = document.getElementById("register-form");
const succesParagraph = document.getElementById("success");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const full_name = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    return alert("password dont match");
  }

  const loginData = { full_name, email, password, confirmPassword };

  fetchData(loginData);
});

async function fetchData(loginData) {
  const response = await fetch("/.netlify/functions/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      succesParagraph.value = data.message;
    })
    .catch((err) => {
      if (err) {
        throw new Error("Request failed:", err);
      }
    });
}
