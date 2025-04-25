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
  if (!requireLogin()) return;

  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    // Nếu không đăng nhập và không phải ở trang đăng nhập, chuyển hướng
    if (!document.querySelector(".login-section")) {
      window.location.href = "/client/index.html";
    }
    return;
  }

  // Hiển thị người dùng nếu có
  if (typeof showUser === "function") {
    showUser(loggedInUser);
  }

  // Lấy các input và gán dữ liệu từ localStorage
  const mssvField = document.getElementById("MSSV");
  if (mssvField) {
    mssvField.value = loggedInUser;
    mssvField.readOnly = true;
  }

  // Gọi API để lấy thông tin sinh viên
  fetch(`http://localhost:5000/api/registers/${loggedInUser}`)
    .then(response => {
      if (!response.ok) throw new Error("Không tìm thấy sinh viên");
      return response.json();
    })
    .then(data => {
      const tenField = document.getElementById("tenSinhVien");
      const khoaField = document.getElementById("tenKhoa");
      const nganhField = document.getElementById("chuyenNganh");

      if (tenField) {
        tenField.value = data.fullName || "";
        tenField.readOnly = true;
      }

      if (khoaField) {
        khoaField.value = data.khoa || "";
        khoaField.readOnly = true;
      }

      if (nganhField) {
        nganhField.value = data.nganh || "";
        nganhField.readOnly = true;
      }
    })
    .catch(err => {
      console.error("Lỗi tải dữ liệu sinh viên:", err.message);
      alert("Bạn cần đăng ký thông tin trước!!!");
    });
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

// Hàm kiểm tra đăng nhập, chỉ hiển thị thông báo khi người dùng chưa đăng nhập
function requireLogin() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser || loggedInUser.trim() === "") {
    return false; // Không thực hiện chuyển hướng tại đây
  }
  return true;
}

document.getElementById("linkDKLTN")?.addEventListener("click", function(event) {
  // Kiểm tra nếu chưa đăng nhập
  if (!requireLogin()) {
    alert("Bạn cần đăng nhập để có thể đăng ký lễ tốt nghiệp!!!.");
    window.location.href = "/client/index.html"; // Chuyển hướng đến trang đăng nhập
    event.preventDefault(); // Ngừng hành động mặc định (chuyển hướng đến trang Đăng ký lễ tốt nghiệp)
  }
});
