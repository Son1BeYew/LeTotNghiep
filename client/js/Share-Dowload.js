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
  if (!img) return Promise.resolve();
  if (img.complete) return Promise.resolve();

  return new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve;
  });
}

async function shareThuMoi(invitationData) {
  showInvitationLetter(invitationData);

  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  );

  await waitForImageToLoad(".student-photo");

  const backdrop = document.querySelector(".show-image");

  const canvas = await html2canvas(backdrop, {
    scale: 1.2,
    useCORS: true,
    backgroundColor: null,
  });

  canvas.toBlob(async (blob) => {
    if (!blob) {
      alert("Không thể tạo ảnh từ thư mời.");
      return;
    }

    const file = new File([blob], "thu-moi.png", { type: "image/png" });

    const cloudinaryUrl = await uploadToCloudinary(file);
    if (!cloudinaryUrl) {
      alert("Không thể upload ảnh lên Cloudinary");
      return;
    }

    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      cloudinaryUrl
    )}`;
    window.open(fbShareUrl, "facebook-share-dialog", "width=800,height=600");
  }, "image/png");
}

async function searchThuMoi() {
  const token = sessionStorage.getItem("token");
  const keyword = document.getElementById("searchMSSV").value.trim();

  if (!keyword) {
    fetchThuMoi();
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/thumoi/search?username=${encodeURIComponent(
        keyword
      )}`,
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


//Gmail
async function sendgmail(invitation) {
  showInvitationLetter(invitation);

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const backdrop = document.getElementById("show-image");

  const canvas = await html2canvas(backdrop, {
    scale: 2,
    useCORS: true,
  });

  const base64Image = canvas.toDataURL("image/png");

  // Hiển thị ảnh thư mời to luôn
  let img = document.getElementById("preview-invitation");
  if (!img) {
    img = document.createElement("img");
    img.id = "preview-invitation";
    img.style.maxWidth = "9000px";
    img.style.border = "1px solid #ccc";
    img.style.marginTop = "10px";
    document.body.appendChild(img);  // hoặc append vào 1 div cụ thể trên trang
  }
  img.src = base64Image;

  // Lấy userId để gửi lên backend
  const userId = invitation.user?._id;

  fetch("http://localhost:5000/api/thumoi/send-invitation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      imageBase64: base64Image,
    }),
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response not ok");
    return response.json();
  })
  .then(data => {
    console.log("Gửi thành công:", data);
    alert("Thư mời đã được gửi thành công đến sinh viên!!!");
  })
  .catch(error => {
    console.error("Lỗi gửi email:", error);
  });
}
