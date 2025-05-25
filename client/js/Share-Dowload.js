//Tải thư mời
function exportToImage() {
  const backdrop = document.querySelector(".show-image");

  html2canvas(backdrop, {
    scale: 2,
    useCORS: true,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "anhthumoi.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
function waitForImageToLoad(selector) {
  const img = document.querySelector(selector);
  if (!img) return Promise.resolve(); // không có ảnh thì thôi
  if (img.complete) return Promise.resolve(); // ảnh đã tải xong

  return new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve; // nếu lỗi vẫn resolve để tránh treo
  });
}

async function shareThuMoi(invitationData) {
  // Hiển thị thư mời lên DOM
  showInvitationLetter(invitationData);

  // Chờ DOM render xong
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  // Chờ ảnh sinh viên load xong (nếu có)
  await waitForImageToLoad(".student-photo");

  // Lấy phần tử thư mời để render thành canvas
  const backdrop = document.querySelector(".show-image");

  // Tạo ảnh từ thư mời
  const canvas = await html2canvas(backdrop, {
    scale: 1.2,
    useCORS: true,
    backgroundColor: null,
  });

  // Chuyển canvas thành Blob
  canvas.toBlob(async (blob) => {
    if (!blob) {
      alert("Không thể tạo ảnh từ thư mời.");
      return;
    }

    // Tạo File từ Blob để upload
    const file = new File([blob], "thu-moi.png", { type: "image/png" });

    // Upload lên Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(file);
    if (!cloudinaryUrl) {
      alert("Không thể upload ảnh lên Cloudinary");
      return;
    }

    // Mở cửa sổ chia sẻ Facebook
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cloudinaryUrl)}`;
    window.open(fbShareUrl, "facebook-share-dialog", "width=800,height=600");
  }, "image/png"); // Đảm bảo đúng định dạng
}


//tìm kiếm thư mời
async function searchThuMoi() {
  const token = sessionStorage.getItem("token");
  const keyword = document.getElementById("searchMSSV").value.trim();

  if (!keyword) {
    fetchThuMoi();
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/thumoi/search?username=${encodeURIComponent(keyword)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Không tìm thấy người dùng!");
      document.getElementById("thumoiDSTable").innerHTML = "";
      return;
    }

    const data = await response.json();

    // Kiểm tra nếu không có username (trường hợp dữ liệu không hợp lệ)
    if (!data || !data.username) {
      alert("Không tìm thấy người dùng với MSSV này!");
      document.getElementById("thumoiDSTable").innerHTML = "";
      return;
    }

    const tableBody = document.getElementById("thumoiDSTable");
    tableBody.innerHTML = "";

    // Tạo hàng cho kết quả tìm kiếm
    const row = document.createElement("tr");

    const mssvCell = document.createElement("td");
    mssvCell.textContent = data.username || "—";
    row.appendChild(mssvCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = data.invitation?.fullname || "—";
    row.appendChild(nameCell);

    const timeCell = document.createElement("td");
    const createdAt = data.invitation?.createdAt;
    timeCell.textContent = createdAt
      ? new Date(createdAt).toLocaleString("vi-VN")
      : "—";
    row.appendChild(timeCell);

    const statusCell = document.createElement("td");
    const trangThai = data.invitation?.trangThai || "Chưa đăng ký";
    statusCell.textContent = trangThai;
    statusCell.style.color =
      trangThai === "Chưa đăng ký"
        ? "red"
        : trangThai === "Đã đăng ký"
        ? "green"
        : "black";
    statusCell.style.fontWeight = "bold";
    row.appendChild(statusCell);

    const actionCell = document.createElement("td");

    if (data.invitation) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Xóa";
      deleteBtn.className = "btn-delete";
      deleteBtn.onclick = function () {
        if (confirm("Bạn có chắc muốn xóa thư mời này?")) {
          deleteThuMoi(data.invitation.user._id || data.invitation.user);
        }
      };
      actionCell.appendChild(deleteBtn);

      const showBtn = document.createElement("button");
      showBtn.textContent = "Xem trước";
      showBtn.className = "btn-show";
      showBtn.style.marginLeft = "5px";
      showBtn.onclick = function () {
        showInvitationLetter(data.invitation);
      };
      actionCell.appendChild(showBtn);

      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Tải ảnh";
      downloadBtn.className = "btn-download";
      downloadBtn.style.marginLeft = "5px";
      downloadBtn.onclick = function () {
        showInvitationLetter(data.invitation);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            exportToImage();
          });
        });
      };
      actionCell.appendChild(downloadBtn);

      const shareBtn = document.createElement("button");
      shareBtn.textContent = "Chia sẻ";
      shareBtn.className = "btn-share";
      shareBtn.style.marginLeft = "5px";
      shareBtn.onclick = function () {
        shareThuMoi(data.invitation);
      };
      actionCell.appendChild(shareBtn);
    } else {
      actionCell.textContent = "—";
    }

    row.appendChild(actionCell);
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Lỗi khi tìm thư mời:", error);
    alert("Đã xảy ra lỗi khi tìm thư mời.");
    document.getElementById("thumoiDSTable").innerHTML = "";
  }
}

document.getElementById("searchButton").addEventListener("click", searchThuMoi);