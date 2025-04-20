// Xử lý đăng nhập (chỉ trang index mới có form login)
const loginButton = document.querySelector(".login-button");
if (
  loginButton &&
  document.getElementById("username") &&
  document.getElementById("password")
) {
  loginButton.addEventListener("click", function () {
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
          // Lưu vào localStorage
          localStorage.setItem("loggedInUser", username);
          localStorage.setItem("mssv", data.mssv);

          showUser(username);

          window.location.href="/client/index.html"
        }
      })
      .catch((error) => console.error("Lỗi:", error));
  });
}

// Hàm hiển thị user info và cập nhật UI
function showUser(username) {
  const userInfo = document.getElementById("userinfo");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const loginForm = document.querySelector(".login-section");

  if (userInfo) {
    userInfo.style.display = "flex";
  }
  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }
  if (loginForm) {
    loginForm.style.display = "none";
  }
}

// Hàm đăng xuất
function logoutUser(event) {
  event.stopPropagation();
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("mssv");
  window.location.href = "/client/index.html";
}

// Khi load trang, kiểm tra trạng thái đăng nhập
window.onload = function () {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    showUser(loggedInUser);

    const mssvField = document.getElementById("MSSV");
    if (mssvField && loggedInUser) {
      mssvField.value = loggedInUser;
      mssvField.readOnly = true;
    }
  } else {
    if (!document.querySelector(".login-section")) {
      window.location.href = "/client/index.html";
    }
  }
};

function showDangKySVForm() {
  window.location.href = '/client/pages/DangKySV.html';
}

function showDropDownSV() {
  const dropdown = document.getElementById("ID_dropdownSV");
  if (dropdown.style.display === "block") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";
  }
}
document.addEventListener("click", function (event) {
  const userInfo = document.getElementById("userinfo");
  const dropdown = document.getElementById("ID_dropdownSV");

  if (!userInfo.contains(event.target)) {
    dropdown.style.display = "none";
  }
});