async function fetchStudentAndUserInfo(mssv) {
  try {
    const dkRes = await fetch(
      `http://localhost:5000/api/DKLeTotNghiep/${mssv}`
    );
    const dkData = await dkRes.json();

    if (dkRes.ok && dkData.data) {
      const sv = dkData.data;
      document.getElementById("mssv").value = sv.mssv || "";
      document.getElementById("fullname").value = sv.hovaten || "";
      document.getElementById("faculty").value = sv.khoa || "";
      document.getElementById("major").value = sv.nganh || "";
      document.getElementById("class").value = sv.lop || "";

      const userRes = await fetch(`http://localhost:5000/api/users/${mssv}`);
      const userData = await userRes.json();

      if (userRes.ok && userData.data) {
        document.getElementById("email").value = userData.data.email || "";
      } else {
        document.getElementById("email").value = "";
        alert("Không tìm thấy email của sinh viên trong hệ thống người dùng.");
      }
    } else {
      alert("Bạn cần đăng ký thông tin!!!");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin:", error);
    alert("Có lỗi khi lấy dữ liệu từ server.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const mssv = localStorage.getItem("loggedInUser");
  if (mssv) {
    document.getElementById("mssv").value = mssv;
    document.getElementById("mssv").readOnly = true;

    fetchStudentAndUserInfo(mssv);
  }
});
