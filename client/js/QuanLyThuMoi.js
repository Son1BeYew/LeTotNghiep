  let editingThuMoiId = null;

  document.addEventListener("DOMContentLoaded", function () {
    fetchThuMoi();

    const form = document.getElementById("thumoiForm");
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullname = document.getElementById("hovaten").value.trim();
      const imageFile = document.getElementById("image").files[0];

      if (!fullname) {
        alert("Vui lòng nhập họ và tên.");
        return;
      }

      const formData = new FormData();
      formData.append("fullname", fullname);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingThuMoiId) {
          updateThuMoi(formData);
      }
    });

    document.getElementById("searchButton").addEventListener("click", function () {
      searchThuMoi();
    });
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
      "Authorization": "Bearer " + token,
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
        if (!tm.invitation) return;
        const row = document.createElement("tr");

        const mssvCell = document.createElement("td");
        mssvCell.textContent = tm.username || "—";  
        row.appendChild(mssvCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = tm.invitation?.fullname || "—";
        row.appendChild(nameCell);

        const imageCell = document.createElement("td");
        const img = document.createElement("img");
        if (tm.invitation?.imagePath) {
          img.src = `http://localhost:5000/${tm.invitation.imagePath}`;
          img.alt = tm.invitation.fullname || "";
        } else {
          img.alt = "Không có ảnh";
        }
        img.style.width = "100px";
        img.style.height = "auto";
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        const actionCell = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Xóa";
        deleteBtn.onclick = function () {
          if (confirm("Bạn có chắc muốn xóa thư mời này?")) {
            deleteThuMoi(tm.invitation_id);
          }
        };
        actionCell.appendChild(deleteBtn);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Sửa";
        editBtn.style.marginLeft = "5px";
        editBtn.onclick = function () {
          loadThuMoiToForm(tm);
        };
        actionCell.appendChild(editBtn);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => console.error("Lỗi khi lấy danh sách thư mời:", err));
}


  function updateThuMoi(formData) {
  fetch("http://localhost:5000/api/thumoi/me", {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Cập nhật thành công!");
      resetForm();
      fetchThuMoi();
    })
    .catch((err) => console.error("Lỗi khi cập nhật:", err));
}

  function deleteThuMoi() {
  fetch("http://localhost:5000/api/thumoi/me", {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then((res) => res.json())
  .then((data) => {
    alert("Xóa thành công!");
    fetchThuMoi();
  })
  .catch((err) => console.error("Lỗi khi xóa:", err));
}


  function loadThuMoiToForm(tm) {
  document.getElementById("hovaten").value = tm.invitation.fullname;
  editingThuMoiId = true; 
}


  function resetForm() {
    document.getElementById("thumoiForm").reset();
    editingThuMoiId = null;
  }

  async function searchThuMoi() {
  const me = document.getElementById("searchMSSV").value.trim();
  if (!me) {
    fetchThuMoi();
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5000/api/thumoi/${me}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();

    const tableBody = document.getElementById("thumoiDSTable");
    tableBody.innerHTML = "";

    if (res.ok && data) {
      // data là một document invitation
      const row = document.createElement("tr");

      const mssvCell = document.createElement("td");
      mssvCell.textContent = data.user?.username || "—";
      row.appendChild(mssvCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = data.fullname || "—";
      row.appendChild(nameCell);

      const imageCell = document.createElement("td");
      const img = document.createElement("img");
      if (data.imagePath) {
        img.src = `http://localhost:5000/${data.imagePath}`;
        img.alt = data.fullname || "";
      } else {
        img.alt = "Không có ảnh";
      }
      img.style.width = "100px";
      img.style.height = "auto";
      imageCell.appendChild(img);
      row.appendChild(imageCell);

      const actionCell = document.createElement("td");

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Xóa";
      deleteBtn.onclick = function () {
        if (confirm("Bạn có chắc muốn xóa thư mời này?")) {
          deleteThuMoi();
        }
      };
      actionCell.appendChild(deleteBtn);

      const editBtn = document.createElement("button");
      editBtn.textContent = "Sửa";
      editBtn.style.marginLeft = "5px";
      editBtn.onclick = function () {
        loadThuMoiToForm(data);
      };
      actionCell.appendChild(editBtn);

      row.appendChild(actionCell);
      tableBody.appendChild(row);
    } else {
      alert(data.message || "Không tìm thấy thư mời.");
    }
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
    alert("Lỗi khi tìm kiếm.");
  }
}
