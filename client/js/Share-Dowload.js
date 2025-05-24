function downloadImage() {
  const image = document.getElementById("thumoi_img");
  if (!image || !image.src) return alert("Không có ảnh để tải");

  const link = document.createElement("a");
  link.href = image.src;
  link.download = "thu-moi-tot-nghiep.png";
  link.click();
}
async function shareImage() {
  const image = document.getElementById("thumoi_img");
  if (!image || !image.src) {
    alert("Không có ảnh để chia sẻ");
    return;
  }

  try {
    const blob = await fetch(image.src).then((res) => res.blob());
    const file = new File([blob], "thu-moi.png", { type: blob.type });

    const cloudinaryUrl = await uploadToCloudinary(file);

    if (!cloudinaryUrl) {
      alert("Không thể upload ảnh lên Cloudinary");
      return;
    }

    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      cloudinaryUrl
    )}`;
    window.open(fbShareUrl, "facebook-share-dialog", "width=800,height=600");
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra khi chia sẻ ảnh");
  }
}

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/dxarwusir/image/upload`;
  const preset = "SonNguyen";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
}
