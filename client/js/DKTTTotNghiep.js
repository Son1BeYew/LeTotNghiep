document.getElementById("letotnghiepForm").addEventListener("submit", function (e) {
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
      <img src="../Hình ảnh/logo-hutech-1.png" class="logoInBackDrop" alt="Logo" />
      <div class="student-info">
        <h2 class="graduation-title">🎓Chúc mừng🎓</h2>
        <h2 class="graduation-title1">Tân cử nhân</h2>
        <p class="hovaten"> ${info.hovaten}</p>
        <p class="khoa">Khoa ${info.khoa}</p>
        <p class="chuyenganh">Chuyên ngành ${info.nganh}</p>
      </div>
      <img class="gaubong" src="../Hình ảnh/gaubongtotnghiep.png" alt="" />
      <img class="mu" src="../Hình ảnh/mutotnghiep.png" alt="" />
      <div class="student-photo-container">
          <img class="khungvien" src="../Hình ảnh/khungvien.png" alt="" />
          ${
            info.imageBase64
              ? `<img class="student-photo" src="${info.imageBase64}" alt="" />`
              : ""
          }      
      </div>
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
  html2canvas(backdrop, {
    scale: 2,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "anhtotnghiep.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function openBackdropZoom() {
  const backdrop = document.querySelector(".background-wrapper");
  const fullBackdrop = document.getElementById("fullBackdrop");
  const overlay = document.getElementById("imageOverlay");

  if (backdrop && fullBackdrop) {
    const clone = backdrop.cloneNode(true);
    fullBackdrop.innerHTML = "";
    fullBackdrop.appendChild(clone);

    overlay.classList.remove("hidden");
  }
}

function closeImage() {
  const overlay = document.getElementById("imageOverlay");
  const fullBackdrop = document.getElementById("fullBackdrop");

  fullBackdrop.innerHTML = "";
  overlay.classList.add("hidden");
}
