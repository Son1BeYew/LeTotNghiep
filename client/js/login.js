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

      if (data.token) {
        // Gọi các hàm sau khi đăng nhập thành công
        showUser(username);
        loginUser(username);
      }
    })
    .catch((error) => console.error("Lỗi:", error));
});



function logoutUser() {

  document.getElementById("userinfo").style.display = "none";
  document.querySelector(".login-section").style.display = "block";

  
  window.location.href = "http://127.0.0.1:5500/client/index.html";
}

function loginUser(username) {
  localStorage.setItem("loggedInUser", username);
  // Hiển thị thông tin user
  document.getElementById("userinfo").style.display = "flex";
  document.getElementById("usernameDisplay").textContent = username;
}


function showUser(username) {
  const userInfo = document.getElementById("userinfo");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const loginForm = document.querySelector(".login-section");

  userInfo.style.display = "flex"; // Hiển thị user info
  usernameDisplay.textContent = username; // Gán tên người dùng
  loginForm.style.display = "none"; // Ẩn nút đăng nhập
}


