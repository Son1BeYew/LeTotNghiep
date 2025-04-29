let editingUserId = null;

document.addEventListener("DOMContentLoaded", function () {
    fetchUsers();

    const form = document.getElementById("studentForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn form reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!username || !password || !email) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (editingUserId) {
            updateUser(editingUserId, { username, password, email }); 
        } else {
            createUser({ username, password, email }); 
        }
        
    });
});

// Hàm lấy danh sách user
function fetchUsers() {
    fetch("http://localhost:5000/api/users")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("studentDSTKTable");
            tableBody.innerHTML = "";

            data.forEach(user => {
                const row = document.createElement("tr");

                const usernameCell = document.createElement("td");
                usernameCell.textContent = user.username;
                row.appendChild(usernameCell);

                const passwordCell = document.createElement("td");
                passwordCell.textContent = user.password;
                row.appendChild(passwordCell);

                const emailCell = document.createElement("td");
                emailCell.textContent = user.email;
                row.appendChild(emailCell);

                const actionCell = document.createElement("td");

                // Nút Xóa
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Xóa";
                deleteButton.style.marginRight = "5px";
                deleteButton.onclick = function () {
                    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
                        deleteUser(user._id);
                    }
                };
                actionCell.appendChild(deleteButton);

                // Nút Sửa
                const editButton = document.createElement("button");
                editButton.textContent = "Sửa";
                editButton.onclick = function () {
                    loadUserToForm(user);
                };
                actionCell.appendChild(editButton);

                row.appendChild(actionCell);
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
}

// Hàm xóa user
function deleteUser(username) {
    fetch(`http://localhost:5000/api/users/${username}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchUsers(); // Refresh bảng
    })
    .catch(error => {
        console.error("Error deleting user:", error);
    });
}

// Hàm thêm mới user
// Hàm thêm mới user
// Hàm thêm mới user
function createUser(userData) {
    fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Username đã tồn tại") {
            alert("Tài khoản đã tồn tại!!!");
        } else if (data.message === "Email đã tồn tại") {
            alert("Email đã tồn tại!!!");
        } else {
            alert("Thêm thành công!");
            resetForm();
            fetchUsers();
        }
    })
    .catch(error => {
        console.error("Error creating user:", error);
    });
}


// Hàm cập nhật user
function updateUser(username, userData) {
    fetch(`http://localhost:5000/api/users/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        alert("Cập nhật thành công!");
        resetForm();
        fetchUsers();
    })
    .catch(error => {
        console.error("Error updating user:", error);
    });
}

// Hàm đưa thông tin user lên form
function loadUserToForm(user) {
    document.getElementById("username").value = user.username;
    document.getElementById("password").value = user.password;
    document.getElementById("email").value = user.email;
    editingUserId = user._id;

}

// Hàm reset form sau khi thêm/sửa
function resetForm() {
    document.getElementById("studentForm").reset();
    editingUserId = null; // Reset trạng thái
}
