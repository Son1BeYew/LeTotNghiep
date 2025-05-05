let editingStudentMSSV = null;

document.addEventListener("DOMContentLoaded", function () {
    fetchStudents();

    // Gắn sự kiện riêng cho form cập nhật (form lớn)
    document.getElementById("studentForm").addEventListener("submit", function (event) {
        // Kiểm tra xem submit là từ nút "Cập nhật" hay không
        const isUpdate = event.submitter && event.submitter.textContent === "Cập nhật";
        if (!isUpdate) return;

        event.preventDefault();

        const mssv = document.getElementById("mssv").value.trim();
        const hovaten = document.getElementById("hovaten").value.trim();
        const lop = document.getElementById("lop").value.trim();
        const khoa = document.getElementById("khoa").value.trim();
        const nganh = document.getElementById("nganh").value.trim();
        const imageInput = document.getElementById("anh");

        if (!mssv || !hovaten || !khoa || !nganh) {
            alert("Vui lòng nhập đầy đủ MSSV, họ và tên, khoa và chuyên ngành!!!");
            return;
        }

        const formData = new FormData();
        formData.append("mssv", mssv);
        formData.append("hovaten", hovaten);
        formData.append("lop", lop);
        formData.append("khoa", khoa);
        formData.append("nganh", nganh);
        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }

        if (editingStudentMSSV) {
            updateStudent(editingStudentMSSV, formData);
        } else {
            createStudent(formData);
        }
    });
});


// Hàm lấy danh sách sinh viên
function fetchStudents() {
    fetch("http://localhost:5000/api/DKLeTotNghiep")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("studentDSTable");
            tableBody.innerHTML = "";
            
            data.sort((a, b) => {
                if (!a.lop) return 1;
                if (!b.lop) return -1;
                return a.lop.localeCompare(b.lop);
            });
            
            data.forEach(student => {
                const row = document.createElement("tr");

                const mssvCell = document.createElement("td");
                mssvCell.textContent = student.mssv;
                row.appendChild(mssvCell);

                const hovatenCell = document.createElement("td");
                hovatenCell.textContent = student.hovaten;
                row.appendChild(hovatenCell);

                const lopCell = document.createElement("td");
                lopCell.textContent = student.lop || "";
                row.appendChild(lopCell);

                const khoaCell = document.createElement("td");
                khoaCell.textContent = student.khoa;
                row.appendChild(khoaCell);

                const nganhCell = document.createElement("td");
                nganhCell.textContent = student.nganh;
                row.appendChild(nganhCell);

                const imageCell = document.createElement("td");
                if (student.image) {
                    imageCell.style.textAlign = "center";
                    imageCell.innerHTML = `<img src="${student.image}" width="100" height="100" style="display: block; margin: auto;" />`;

                } else {
                    imageCell.textContent = "Không có ảnh";
                }
                row.appendChild(imageCell);

                const actionCell = document.createElement("td");

                // Nút Xóa
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Xóa";
                deleteButton.style.marginRight = "5px";
                deleteButton.onclick = function () {
                    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
                        deleteStudent(student.mssv);
                    }
                };
                actionCell.appendChild(deleteButton);

                // Nút Sửa
                const editButton = document.createElement("button");
                editButton.textContent = "Sửa";
                editButton.onclick = function () {
                    loadStudentToForm(student.mssv);
                };
                actionCell.appendChild(editButton);

                row.appendChild(actionCell);
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Lỗi lấy danh sách sinh viên:", error);
        });
}

// Hàm cập nhật sinh viên
function updateStudent(mssv, formData) {
    fetch(`http://localhost:5000/api/DKLeTotNghiep/${mssv}`, {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        resetForm();
        fetchStudents();
    })
    .catch(error => {
        console.error("Lỗi cập nhật sinh viên:", error);
    });
}

// Hàm xóa sinh viên
function deleteStudent(mssv) {
    fetch(`http://localhost:5000/api/DKLeTotNghiep/${mssv}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchStudents();
    })
    .catch(error => {
        console.error("Lỗi xóa sinh viên:", error);
    });
}

// Hàm load dữ liệu sinh viên lên form để sửa
function loadStudentToForm(mssv) {
    fetch(`http://localhost:5000/api/DKLeTotNghiep/${mssv}`)
        .then(response => response.json())
        .then(res => {
            const student = res.data;
            document.getElementById("mssv").value = student.mssv;
            document.getElementById("hovaten").value = student.hovaten;
            document.getElementById("lop").value = student.lop || "";
            document.getElementById("khoa").value = student.khoa;
            document.getElementById("nganh").value = student.nganh;
            editingStudentMSSV = student.mssv;
        })
        .catch(error => {
            console.error("Lỗi load dữ liệu sinh viên:", error);
        });
}

// Hàm reset form
function resetForm() {
    document.getElementById("studentForm").reset();
    editingStudentMSSV = null;
}

//Tìm kiếm sinh viên
async function searchStudent() {
    const searchMSSV = document.getElementById("searchMSSV").value.trim();

    if (!searchMSSV) {
        fetchStudents();
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/DKLeTotNghiep/${searchMSSV}`);
        const res = await response.json();

        if (response.ok) {
            const student = res.data;
            const tableBody = document.getElementById("studentDSTable");
            tableBody.innerHTML = "";

            const row = document.createElement("tr");

            const mssvCell = document.createElement("td");
            mssvCell.textContent = student.mssv;
            row.appendChild(mssvCell);

            const hovatenCell = document.createElement("td");
            hovatenCell.textContent = student.hovaten;
            row.appendChild(hovatenCell);

            const lopCell = document.createElement("td");
            lopCell.textContent = student.lop || "";
            row.appendChild(lopCell);

            const khoaCell = document.createElement("td");
            khoaCell.textContent = student.khoa;
            row.appendChild(khoaCell);

            const nganhCell = document.createElement("td");
            nganhCell.textContent = student.nganh;
            row.appendChild(nganhCell);

            const imageCell = document.createElement("td");
            if (student.image) {
                imageCell.style.textAlign = "center";
                imageCell.innerHTML = `<img src="${student.image}" width="80" height="100" style="display: block; margin: auto;" />`;
            } else {
                imageCell.textContent = "Không có ảnh";
            }
            row.appendChild(imageCell);

            const actionCell = document.createElement("td");

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Xóa";
            deleteButton.style.marginRight = "5px";
            deleteButton.onclick = function () {
                if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
                    deleteStudent(student.mssv);
                }
            };
            actionCell.appendChild(deleteButton);

            const editButton = document.createElement("button");
            editButton.textContent = "Sửa";
            editButton.onclick = function () {
                loadStudentToForm(student.mssv);
            };
            actionCell.appendChild(editButton);

            row.appendChild(actionCell);
            tableBody.appendChild(row);

        } else {
            alert(res.message || "Không tìm thấy sinh viên!");
            // Nếu MSSV không tìm thấy, reset bảng về trống
            document.getElementById("studentDSTable").innerHTML = "";
        }
    } catch (error) {
        console.error("Lỗi tìm sinh viên:", error);
        alert("Đã xảy ra lỗi khi tìm sinh viên.");
    }
}
document.getElementById("searchButton").addEventListener("click", function () {
    searchStudent();
});
