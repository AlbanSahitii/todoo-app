const registerForm = document.getElementById("register-form");

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
  try {
    const response = await fetch("/.netlify/functions/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error("Request failed:", response.status);
    }

    const data = await response.json();
    console.log(data);
    // You can perform further actions based on the API response
  } catch (error) {
    console.error(error.message);
  }
}