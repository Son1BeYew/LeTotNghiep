document.getElementById("letotnghiepForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const mssv = formData.get("MSSV");

  // Gửi dữ liệu mới đến server để tạo mới hoặc cập nhật
  fetch("http://localhost:5000/api/DKLeTotNghiep", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Đã lưu thông tin lễ tốt nghiệp!");
        fetchStudentData(mssv); 
      } else {
        alert(data.message || "Đã xảy ra lỗi khi đăng ký.");
      }
    })
    .catch((err) => {
      console.error("Lỗi gửi form:", err);
      alert("Lỗi khi gửi biểu mẫu!");
    });
});

// Hàm lấy và hiển thị dữ liệu sinh viên
function fetchStudentData(mssv) {
  fetch(`http://localhost:5000/api/DKLeTotNghiep/${mssv}`)
    .then((res) => res.json())
    .then((result) => {
      if (result.data) {
        const student = result.data;
        const info = {
          mssv: student.mssv,
          hovaten: student.hovaten,
          lop: student.lop,
          khoa: student.khoa,
          nganh: student.nganh,
          imageBase64: student.image || "",
        };
        showBackdrop(info);
        document.getElementById("MSSV").value = student.mssv;
        document.getElementById("tenSinhVien").value = student.hovaten;
        document.getElementById("lop").value = student.lop;
        document.getElementById("tenKhoa").value = student.khoa;
        document.getElementById("chuyenNganh").value = student.nganh;

        // Hiển thị ảnh nếu có
        if (student.image) {
          const preview = document.getElementById("preview");

          // Kiểm tra xem có phải là base64 hợp lệ không
          if (student.image.startsWith('data:image')) {
            preview.src = student.image; 
          } else {
            preview.src = `data:image/jpeg;base64,${student.image}`;  
          }
          
          preview.classList.remove("hidden");
        }
      } else {
        console.log("Không tìm thấy sinh viên.");
      }
    })
    .catch((err) => {
      console.error("Lỗi lấy sinh viên:", err);
    });
}

function showBackdrop(info) {
  const backgroundWrapper = document.querySelector(".background-wrapper");
  backgroundWrapper.innerHTML = `
    <div class="backdrop-content">
      <h2>🎓 Chúc mừng lễ tốt nghiệp! 🎓</h2>
      <p><strong>MSSV:</strong> ${info.mssv}</p>
      <p><strong>Họ và tên:</strong> ${info.hovaten}</p>
      <p><strong>Lớp:</strong> ${info.lop}</p>
      <p><strong>Khoa:</strong> ${info.khoa}</p>
      <p><strong>Chuyên ngành:</strong> ${info.nganh}</p>
      ${info.imageBase64 ? `<img class="student-photo" src="${info.imageBase64}" alt="" />` : ""}
    </div>
  `;
  document.querySelector(".background-container").style.display = "flex";
}



window.addEventListener("load", function () {
  const mssvInput = document.getElementById("MSSV");
  const mssv = mssvInput?.value;

  if (mssv) {
    fetchStudentData(mssv);
  }
});

