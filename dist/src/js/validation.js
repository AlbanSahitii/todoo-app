const jwt = localStorage.getItem("jwt");
if (jwt) window.location.href = "/index.html";
if (!jwt) window.location.href = "/login.html";
