let editingThuMoiId = null;

document.addEventListener("DOMContentLoaded", function () {
  fetchThuMoi();
  const formData = new FormData();
});

function fetchThuMoi() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Bạn cần đăng nhập để xem danh sách thư mời!");
    return;
  }
  fetch("http://localhost:5000/api/thumoi/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Lỗi khi lấy dữ liệu: " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        console.error("Dữ liệu không phải mảng:", data);
        alert("Dữ liệu nhận được không hợp lệ!");
        return;
      }

      const tableBody = document.getElementById("thumoiDSTable");
      tableBody.innerHTML = "";

      data.forEach((tm) => {
        if (tm.username.toLowerCase() === "admin") {
          return;
        }

        const row = document.createElement("tr");

        const mssvCell = document.createElement("td");
        mssvCell.textContent = tm.username || "—";
        row.appendChild(mssvCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = tm.invitation?.fullname || "—";
        row.appendChild(nameCell);

        const timeCell = document.createElement("td");
        const createdAt = tm.invitation?.createdAt;
        timeCell.textContent = createdAt
          ? new Date(createdAt).toLocaleString("vi-VN")
          : "—";
        row.appendChild(timeCell);

        const statusCell = document.createElement("td");
        const trangThai = tm.invitation?.trangThai || "Chưa đăng ký";
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

        if (tm.invitation && tm.invitation.user && tm.invitation.user._id) {
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Xóa";
          deleteBtn.className = "btn-delete";
          deleteBtn.onclick = function () {
            if (confirm("Bạn có chắc muốn xóa thư mời này?")) {
              deleteThuMoi(tm.invitation.user._id);
            }
          };
          actionCell.appendChild(deleteBtn);

          const showBtn = document.createElement("button");
          showBtn.textContent = "Xem trước";
          showBtn.className = "btn-show";
          showBtn.style.marginLeft = "5px";
          showBtn.onclick = function () {
            showInvitationLetter(tm.invitation);
          };
          actionCell.appendChild(showBtn);

          const downloadBtn = document.createElement("button");
          downloadBtn.textContent = "Tải ảnh";
          downloadBtn.className = "btn-download";
          downloadBtn.style.marginLeft = "5px";
          downloadBtn.onclick = function () {
            showInvitationLetter(tm.invitation);

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
            shareThuMoi(tm.invitation);
          };
          actionCell.appendChild(shareBtn);
        } else {
          actionCell.textContent = "—";
        }

        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Lỗi khi lấy danh sách thư mời:", err);
    });
}

function deleteThuMoi(userId) {
  if (!userId) {
    alert("Dữ liệu thư mời không hợp lệ, không thể xóa.");
    console.error("Lỗi: userId không tồn tại", userId);
    return;
  }

  fetch(`http://localhost:5000/api/thumoi/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          throw new Error(data.message || "Lỗi khi xóa thư mời: " + res.status);
        });
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message || "Xóa thành công!");
      fetchThuMoi();
    })
    .catch((err) => {
      console.error("Lỗi khi xóa:", err);
      alert(err.message || "Đã xảy ra lỗi khi xóa thư mời.");
    });
}

function loadThuMoiToForm(tm) {
  document.getElementById("hovaten").value = tm.invitation.fullname;
  editingThuMoiId =
    typeof tm.invitation.user === "object"
      ? tm.invitation.user._id
      : tm.invitation.user;
}

function resetForm() {
  document.getElementById("thumoiForm").reset();
  editingThuMoiId = null;
}

function showInvitationLetter(formData) {
  const backgroundWrapper = document.querySelector(".show-image");
  backgroundWrapper.innerHTML = `
    <div class="backdrop-content">
      <div class="student-info">
        <img src="../Hình ảnh/logo-hutech-1.png" class="logoInBackDrop" alt="Logo" />
        <div class="invitation-letter">
          <h2 class="ThuMoi">Thư mời</h2>
          <p class ="HoVaTen"> ${formData.fullname}</p>
          <p class="DenThamDu">Đến tham dự</p>
          <p class="TieuDe">LỄ TỐT NGHIỆP & TRAO BẰNG KỸ SƯ</p>
          <p class="Khoa">KHOA CÔNG NGHỆ THÔNG TIN</p>
        <div class="time">
          <p>Thứ 4, 18/6/2025</p>
          <p>13:00 - 16:00</p>
        </div>  
          <p class="DiaDiem">Địa điểm: E3-05.01, Trường Đại học Công nghệ TP.HCM (HUTECH)</p>
        </div>
      </div>

      <div class="student-photo-container">
        <img class="khungvien" src="../Hình ảnh/khungThuMoi.png" alt="" />
        ${
          formData.imagePath
            ? `<img class="student-photo" src="http://localhost:5000/${formData.imagePath}" alt="Ảnh sinh viên" />`
            : formData.imageBase64 || ""
        }      
      </div>
    </div>
  `;
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
      `http://localhost:5000/api/thumoi/search?username=${encodeURIComponent(keyword)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const res = await response.json();

    if (response.ok) {
      const data = res;
      const tableBody = document.getElementById("thumoiDSTable");
      tableBody.innerHTML = "";

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
      statusCell.textContent = data.invitation?.trangThai || "—";
      statusCell.style.color =
        trangThai === "Chưa đăng ký"
          ? "red"
          : trangThai === "Đã đăng ký"
          ? "green"
          : "black";
      statusCell.style.fontWeight = "bold";
      row.appendChild(statusCell);

      const actionCell = document.createElement("td");

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Xóa";
      deleteBtn.className = "btn-delete";
      deleteBtn.onclick = function () {
        if (confirm("Bạn có chắc muốn xóa thư mời này?")) {
          deleteThuMoi(data.invitation.user._id);
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
        showInvitationLetter(tm.invitation);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            exportToImage();
          });
        });
      };

      const shareBtn = document.createElement("button");
      shareBtn.textContent = "Chia sẻ";
      shareBtn.className = "btn-share";
      shareBtn.style.marginLeft = "5px";
      shareBtn.onclick = function () {
        shareThuMoi(tm.invitation);
      };
      actionCell.appendChild(shareBtn);

      row.appendChild(actionCell);
      tableBody.appendChild(row);
    } else {
      alert(res.message || "Không tìm thấy thư mời!");
      document.getElementById("thumoiDSTable").innerHTML = "";
    }
  } catch (error) {
    console.error("Lỗi khi tìm thư mời:", error);
    alert("Đã xảy ra lỗi khi tìm thư mời.");
  }
}
document.getElementById("searchButton").addEventListener("click", function () {
  searchThuMoi();
});

// UPLOAD TO SERVER
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "SonNguyen");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dxarwusir/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data.secure_url; // URL của ảnh sau khi upload
    } else {
      console.error("Upload lỗi:", data);
      return null;
    }
  } catch (err) {
    console.error("Lỗi khi upload ảnh:", err);
    return null;
  }
}

async function shareThuMoi(invitationData) {
  showInvitationLetter(invitationData);

  // RENDER BACKDROP
  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  );

  const backdrop = document.querySelector(".show-image");
  const canvas = await html2canvas(backdrop, {
    scale: 2,
    useCORS: true,
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

    // SHARE FB
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      cloudinaryUrl
    )}`;
    window.open(fbShareUrl, "facebook-share-dialog", "width=800,height=600");
  });
}
