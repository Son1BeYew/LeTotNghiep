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
          localStorage.setItem("token", data.token);
          localStorage.setItem("loggedInUser", username);
          localStorage.setItem("role", data.user.role);

          showUser(username);

          if (data.user.role === "admin") {
            window.location.href = "/client/pages/QuanLy.html";
          } else {
            window.location.href = "/client/index.html";
          }
        }
      })

      .catch((error) => console.error("Lỗi:", error));
  });
}

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
function logoutUser(event) {
  event.stopPropagation();
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("mssv");
  window.location.href = "/client/index.html";
}

window.onload = function () {
  if (!requireLogin()) return;

  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    if (!document.querySelector(".login-section")) {
      window.location.href = "/client/index.html";
    }
    return;
  }

  if (typeof showUser === "function") {
    showUser(loggedInUser);
  }

  const mssvField = document.getElementById("MSSV");
  if (mssvField) {
    mssvField.value = loggedInUser;
    mssvField.readOnly = true;
  }
};

function showThongTinSV() {
  window.location.href = "/client/pages/ThongTinSV.html";
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

function requireLogin() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser || loggedInUser.trim() === "") {
    return false;
  }
  return true;
}

document
  .getElementById("linkDKLTN")
  ?.addEventListener("click", function (event) {
    if (!requireLogin()) {
      alert("Bạn cần đăng nhập để có thể đăng ký lễ tốt nghiệp!!!.");
      window.location.href = "/client/index.html";
      event.preventDefault();
    }
  });
