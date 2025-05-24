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
            loadThuMoiToForm(tm);
          };
          actionCell.appendChild(downloadBtn);

          const shareBtn = document.createElement("button");
          shareBtn.textContent = "Chia sẻ";
          shareBtn.className = "btn-share";
          shareBtn.style.marginLeft = "5px";
          shareBtn.onclick = function () {
            loadThuMoiToForm(tm);
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
    <div class="backdrop-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 970px; height: 525px; background-image: url('../Hình ảnh/background-xanh-1.png');">
      <div class="student-info">
        <img src="../Hình ảnh/logo-hutech-1.png" class="logoInBackDrop" alt="Logo" />
        <h2 class="graduation-title">🎓Chúc mừng🎓</h2>
        <h2 class="graduation-title1">Tân cử nhân</h2>

        <p><strong>Họ và tên:</strong> ${formData.fullname}</p>
        <p><strong>Ngày tạo:</strong> ${
          formData.createdAt
            ? new Date(formData.createdAt).toLocaleDateString("vi-VN")
            : "—"
        }</p>
      </div>

      <img class="gaubong" src="../Hình ảnh/gaubongtotnghiep.png" alt="" />
      <img class="mu" src="../Hình ảnh/mutotnghiep.png" alt="" />

      <div class="student-photo-container">
        <img class="khungvien" src="../Hình ảnh/khungvien.png" alt="" />
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
        loadThuMoiToForm({ invitation: data.invitation });
      };
      actionCell.appendChild(downloadBtn);

      const shareBtn = document.createElement("button");
      shareBtn.textContent = "Chia sẻ";
      shareBtn.className = "btn-share";
      shareBtn.style.marginLeft = "5px";
      shareBtn.onclick = function () {
        loadThuMoiToForm({ invitation: data.invitation });
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
