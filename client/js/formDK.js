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
    const response = await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Check the response.ok to see if the response was ok.
    if (!response.ok) {
        // If not ok, check if there is a response body available.
        if (response.headers.get("Content-Length") !== '0') {
            const errorText = await response.text();
            alert(`Gửi dữ liệu thất bại: ${response.status} - ${errorText}`); // Show error details.
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

window.onload = function () {
  if (loggedInUser) {
    const mssvField = document.getElementById("mssv");
    if (mssvField) {
      mssvField.value = loggedInUser;
      mssvField.readOnly = true;
    }
    showUser(loggedInUser);
  } else {
    if (!document.querySelector(".login-section")) {
      window.location.href = "/client/index.html";
    }
  }
};
