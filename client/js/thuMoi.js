document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bạn cần đăng nhập để tạo thư mời.");
    window.location.href = "/client/index.html";
    return;
  }

  const fullnameInput = document.getElementById("fullname");
  const imageInput = document.getElementById("image");
  const filePathInput = document.getElementById("filePath");
  const createButton = document.getElementById("createButton");
  const preview = document.getElementById("image_ThuMoi");

  imageInput.addEventListener("change", () => {
    filePathInput.value = imageInput.files[0]?.name || "";
  });

  // Tải thư mời nếu đã có
  try {
    const res = await fetch("http://localhost:5000/api/thumoi/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.invitation?.imagePath) {
        preview.innerHTML = `<img src="http://localhost:5000/${data.invitation.imagePath}" alt="Ảnh thư mời" class="max-w-full h-auto mt-4 border rounded opacity-0" id="thumoi_img" />`;
        fullnameInput.value = data.invitation.fullname;

        // Hiệu ứng fade in
        setTimeout(() => {
          const img = document.getElementById("thumoi_img");
          if (img) img.classList.remove("opacity-0");
        }, 100);

        // Vô hiệu hóa nút
        createButton.disabled = true;
        createButton.style.backgroundColor = "#a1a1a1";
        createButton.style.cursor = "not-allowed";
      }
    }
  } catch (err) {
    console.error("Không thể tải thư mời:", err);
  }

  // Xử lý tạo thư mời
  createButton.addEventListener("click", async () => {
    if (createButton.disabled) return;

    const fullname = fullnameInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!fullname || !imageFile) {
      alert("Vui lòng nhập họ tên và chọn ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:5000/api/thumoi", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Lỗi tạo thư mời.");
      } else {
        alert("Tạo thư mời thành công!");
        preview.innerHTML = `<img src="http://localhost:5000/${data.invitation.imagePath}" alt="Ảnh thư mời" class="max-w-full h-auto mt-4 border rounded opacity-0" id="thumoi_img" />`;

        setTimeout(() => {
          const img = document.getElementById("thumoi_img");
          if (img) img.classList.remove("opacity-0");
        }, 100);

        createButton.disabled = true;
        createButton.style.backgroundColor = "#a1a1a1";
        createButton.style.cursor = "not-allowed";
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  });
});
