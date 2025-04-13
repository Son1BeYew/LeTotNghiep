// Lắng nghe sự kiện khi người dùng tải lên ảnh
const uploadInput = document.getElementById("upload");
const backgroundWrapper = document.querySelector(".background-wrapper");
const previewImage = document.getElementById("preview");
const form = document.getElementById("uploadForm");

uploadInput.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      previewImage.src = event.target.result;
      previewImage.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData();
  const file = uploadInput.files[0];
  formData.append("image", file);

  // Gửi ảnh lên server (Backend API)
  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        backgroundWrapper.style.backgroundImage = `url(${data.imageUrl})`;
        backgroundWrapper.style.backgroundSize = "cover";
        backgroundWrapper.style.backgroundPosition = "center";
      } else {
        alert("Lỗi tải ảnh lên!");
      }
    })
    .catch((err) => console.error("Lỗi:", err));
});
