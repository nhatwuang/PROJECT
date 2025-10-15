// Hiệu ứng khi cuộn xuống dịch vụ
window.addEventListener("scroll", () => {
  const services = document.querySelector(".services");
  const position = services.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (position < screenHeight - 100) {
    services.classList.add("visible");
  }
});

// Thêm hiệu ứng CSS khi hiện ra
document.addEventListener("DOMContentLoaded", () => {
  document.head.appendChild(style);

  // =============================
  // Xử lý đăng nhập / đăng xuất
  // =============================
  const authBtns = document.querySelector(".auth-btns");
  const username = localStorage.getItem("username");

  if (username) {
    // Nếu đã đăng nhập
    authBtns.innerHTML = `
      <span class="welcome">Xin chào, <b>${username}</b></span>
      <button class="logout-btn">Đăng xuất</button>
    `;

    document
      .querySelector(".logout-btn")
      .addEventListener("click", function () {
        localStorage.removeItem("username");
        location.reload();
      });
  } else {
    // Nếu chưa đăng nhập
    authBtns.innerHTML = `
      <button class="login-btn">Đăng nhập</button>
      <button class="signup-btn">Đăng ký</button>
    `;

    document.querySelector(".login-btn").addEventListener("click", function () {
      window.location.href = "dangnhap.html";
    });

    document
      .querySelector(".signup-btn")
      .addEventListener("click", function () {
        window.location.href = "dangnhap.html";
      });
  }
});

// =============================
// 🧭 Xử lý nhấn nút tính năng
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".service-item a");

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const serviceName = btn.parentElement.querySelector("h3").textContent;

      // Chuyển hướng theo dịch vụ
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
