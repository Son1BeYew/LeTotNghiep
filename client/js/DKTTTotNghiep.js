document.getElementById("letotnghiepForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  fetch("http://localhost:5000/api/DKLeTotNghiep", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Đã lưu thông tin lễ tốt nghiệp!!!");
      } else {
        alert("Lỗi: " + data.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi gửi form:", err);
      alert("Lỗi khi gửi biểu mẫu!");
    });
});

