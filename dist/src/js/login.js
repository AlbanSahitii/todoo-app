const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = { email, password };

  fetchData(loginData);
});

async function fetchData(loginData) {
  try {
    const response = await fetch("/.netlify/functions/user", {
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
