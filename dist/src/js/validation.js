const jwt = localStorage.getItem("jwt");
if (jwt) {
  window.location.href = "/index.html";
} else {
  window.location.href = "/login.html";
}
