document.querySelector(".login-button").addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => console.error("Lỗi:", error));
});


function logoutUser() {

  document.getElementById("userinfo").style.display = "none";
  document.querySelector(".login-label").style.display = "block";
  document.querySelectorAll(".login-label")[1].style.display = "block";

  
  window.location.href = "/LETOTNGHIEP";
  applyRoleBasedAccess();
}