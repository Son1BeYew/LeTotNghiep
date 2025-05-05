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
        alert("Đã lưu thông tin lễ tốt nghiệp!!!");

        // Gọi lại API lấy từ MongoDB
        fetch(`http://localhost:5000/api/DKLeTotNghiep/${mssv}`)
          .then((res) => res.json())
          .then((result) => {
            const student = result.data;
            const info = {
              mssv: student.mssv,
              hovaten: student.hovaten,
              lop: student.lop,
              khoa: student.khoa,
              nganh: student.nganh,
              imageBase64: student.image || ""
            };
            localStorage.setItem("graduationBackdrop", JSON.stringify(info));
            showBackdrop(info);
            showPreviewImage(info.imageBase64);
          })
          .catch((err) => {
            console.error("Lỗi lấy lại dữ liệu từ server:", err);
            alert("Lỗi khi lấy lại thông tin sinh viên từ server!");
          });
      } else {
        alert(data.message);
      }
    })
    .catch((err) => {
      console.error("Lỗi gửi form:", err);
      alert("Lỗi khi gửi biểu mẫu!");
    });
});

// Hiển thị ảnh preview nhỏ
function showPreviewImage(imageBase64) {
  const previewImg = document.getElementById("preview");
  if (imageBase64) {
    previewImg.src = imageBase64;
    previewImg.classList.remove("hidden");
  }
}

// Hiển thị backdrop
function showBackdrop(info) {
  const backgroundWrapper = document.querySelector(".background-wrapper");
  backgroundWrapper.innerHTML = `
    <div class="backdrop-content">
      <h2>🎓 Chúc mừng lễ tốt nghiệp! 🎓</h2>
      <p><strong>MSSV:</strong> ${info.mssv}</p>
      <p><strong>Họ tên:</strong> ${info.hovaten}</p>
      <p><strong>Lớp:</strong> ${info.lop}</p>
      <p><strong>Khoa:</strong> ${info.khoa}</p>
      <p><strong>Chuyên ngành:</strong> ${info.nganh}</p>
      ${info.imageBase64 ? `<img src="${info.imageBase64}" alt="Ảnh sinh viên" style="max-width: 200px; margin-top: 10px;" />` : ""}
      <div id="close-btn" onclick="closeImage()">✖</div>
    </div>
  `;
  document.querySelector(".background-container").style.display = "flex";
}

// Đóng backdrop và xóa localStorage
function closeImage() {
  document.querySelector(".background-container").style.display = "none";
  localStorage.removeItem("graduationBackdrop");
}

// Xem ảnh full màn hình
function showImage() {
  const preview = document.getElementById("preview");
  const fullscreen = document.getElementById("fullscreen-img");
  fullscreen.src = preview.src;
  fullscreen.classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("graduationBackdrop");
  if (saved) {
    const info = JSON.parse(saved);

    // Gọi lại API để lấy dữ liệu mới nhất từ server
    fetch(`http://localhost:5000/api/DKLeTotNghiep/${info.mssv}`)
      .then((res) => res.json())
      .then((result) => {
        const student = result.data;
        const updatedInfo = {
          mssv: student.mssv,
          hovaten: student.hovaten,
          lop: student.lop,
          khoa: student.khoa,
          nganh: student.nganh,
          imageBase64: student.image || ""
        };
        localStorage.setItem("graduationBackdrop", JSON.stringify(updatedInfo));
        showBackdrop(updatedInfo);
        showPreviewImage(updatedInfo.imageBase64);
      })
      .catch((err) => {
        console.error("Lỗi lấy lại dữ liệu cập nhật từ server:", err);
      });
  }
});
