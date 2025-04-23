document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const mssv = document.getElementById("MSSV").value;
    const fullName = document.getElementById("fullname").value;
    const khoa = document.getElementById("tenKhoa").value;
    const nganh = document.getElementById("ChuyenNganh").value;

    const studentData = { mssv, fullName, khoa, nganh };
    fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Đăng ký thành công!") {
          alert("Đăng ký thành công");
        } else {
          alert("Đã xảy ra lỗi: " + data.message);
        }
      })
      .catch((error) => {
        console.log("Lỗi:", error);
      });
  });
