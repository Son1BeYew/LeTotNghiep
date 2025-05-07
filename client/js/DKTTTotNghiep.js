document
  .getElementById("letotnghiepForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const mssv = formData.get("MSSV");
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

        if (student.image) {
          const preview = document.getElementById("preview");
          if (student.image.startsWith("data:image")) {
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
      <p class="school-header">Bộ Giáo dục và Đào tạo </p>
      <p class="school-header-1">Trường Đại Học Công Nghệ TP. HCM </p>
      <img src="https://img5.thuthuatphanmem.vn/uploads/2021/07/14/logo-dai-hoc-hutech_012634748.png" class="logoInBackDrop" alt="Logo" />
      <h2 class="graduation-title">🎓 Chúc mừng tốt nghiệp! 🎓</h2>
      <div class="student-info">
        <p><strong>MSSV:</strong> ${info.mssv}</p>
        <p><strong>Họ và tên:</strong> ${info.hovaten}</p>
        <p><strong>Lớp:</strong> ${info.lop}</p>
        <p><strong>Khoa:</strong> ${info.khoa}</p>
        <p><strong>Chuyên ngành:</strong> ${info.nganh}</p>
      </div>
      ${
        info.imageBase64
          ? `<img class="student-photo" src="${info.imageBase64}" alt="" />`
          : ""
      }
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

function exportToImage() {
  const backdrop = document.querySelector(".background-wrapper");
  html2canvas(backdrop).then((canvas) => {
    const link = document.createElement("a");
    link.download = "anhtotnghiep.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
