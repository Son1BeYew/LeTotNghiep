document.getElementById("studentForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const data = {
    fullName: this.fullname.value,
    mssv: this.mssv.value,
    nganh: this.major.value,
    khoa: this.faculty.value,
    lop: this.class.value,
  };

  try {
    const response = await fetch("http://localhost:5000/api/registers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.headers.get("Content-Length") !== '0') {
            const result = await response.json();
            alert(result.message);
        } else {
            alert(`Gửi dữ liệu thất bại: ${response.status}`);
        }
    } else {
        const result = await response.json();
        alert(result.message);
      }   
  } catch (error) {
    alert("Gửi dữ liệu thất bại: " + error);
  }
});

const loggedInUser = localStorage.getItem("loggedInUser");

window.onload = async function () {
  if (loggedInUser) {
    const mssvField = document.getElementById("mssv");
    if (mssvField) {
      mssvField.value = loggedInUser;
      mssvField.readOnly = true;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/registers/${loggedInUser}`);
      if (res.ok) {
        const student = await res.json();
        const form = document.getElementById("studentForm");
        form.fullname.value = student.fullName || "";
        form.mssv.value = student.mssv || "";
        form.major.value = student.nganh || "";
        form.faculty.value = student.khoa || "";
        form.class.value = student.lop || "";
      }
    } catch (error) {
      console.error("Không thể tải thông tin sinh viên:", error);
    }
    showUser(loggedInUser);
  } else {
    if (!document.querySelector(".login-section")) {
      window.location.href = "/client/index.html";
    }
  }
};
