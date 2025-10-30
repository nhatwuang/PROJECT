// ==============================================
// 🔹 Hiệu ứng khi cuộn xuống phần "Dịch vụ"
// ==============================================
window.addEventListener("scroll", () => {
  const services = document.querySelector(".services");
  if (!services) return; // kiểm tra tránh lỗi nếu không có phần này

  const position = services.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (position < screenHeight - 100) {
    services.classList.add("visible");
  }
});

// ==============================================
// 🔹 Xử lý hiển thị đăng nhập / đăng xuất ở header
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const authBtns = document.querySelector(".auth-btns");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.name) {
    // ✅ Nếu đã đăng nhập
    authBtns.innerHTML = `
      <span class="welcome">Xin chào, <b>${currentUser.name}</b></span>
      <button class="logout-btn">Đăng xuất</button>
    `;

    // Sự kiện đăng xuất
    document.querySelector(".logout-btn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      location.reload();
    });
  } else {
    // ❌ Nếu chưa đăng nhập
    authBtns.innerHTML = `
      <button class="login-btn">Đăng nhập</button>
      <button class="signup-btn">Đăng ký</button>
    `;

    // Khi bấm “Đăng nhập” → chuyển sang trang đăng nhập
    document.querySelector(".login-btn").addEventListener("click", () => {
      window.location.href = "dangnhap.html";
    });

    // Khi bấm “Đăng ký” → cũng chuyển sang trang đăng nhập (tab Đăng ký)
    document.querySelector(".signup-btn").addEventListener("click", () => {
      window.location.href = "dangnhap.html";
    });
  }
});

// ==============================================
// 🔹 Gắn sự kiện cho các nút trong phần dịch vụ
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".service-item a");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const serviceName = btn.parentElement.querySelector("h3").textContent;

      // Chuyển hướng theo tên dịch vụ
      if (serviceName.includes("Quản lý")) {
        window.location.href = "phim-doanhnghiep.html";
      } else if (serviceName.includes("Danh sách")) {
        window.location.href = "phim.html";
      } else if (serviceName.includes("Báo cáo")) {
        window.location.href = "baocao.html";
      }
    });
  });
});
