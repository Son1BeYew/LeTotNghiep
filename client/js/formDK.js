document
  .getElementById("studentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = {
      tenSV: this.fullname.value,
      mssv: this.mssv.value,
      chuyenNganh: this.major.value,
      khoa: this.faculty.value,
      lop: this.class.value,
    };
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert("Gửi dữ liệu thất bại: " + error);
    }
  });
