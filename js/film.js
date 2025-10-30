// ==============================================
// 🔹 Hiệu ứng khi cuộn xuống phần "Dịch vụ"
// ==============================================

window.addEventListener("scroll", () => {
  const services = document.querySelector(".services");
  const position = services.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (position < screenHeight - 100) {
    services.classList.add("visible");
  }
});

// ==============================================
// 🔹 Xử lý đăng nhập / đăng ký / đăng xuất ở header
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const authBtns = document.querySelector(".auth-btns");
  const username = localStorage.getItem("username");

  // Nếu ĐÃ đăng nhập
  if (username) {
    authBtns.innerHTML = `
      <span class="welcome">Xin chào, <b>${username}</b></span>
      <button class="logout-btn">Đăng xuất</button>
    `;

    // Sự kiện Đăng xuất
    document.querySelector(".logout-btn").addEventListener("click", () => {
      localStorage.removeItem("username");
      location.reload();
    });
  } 
  // Nếu CHƯA đăng nhập
  else {
    authBtns.innerHTML = `
      <button class="login-btn">Đăng nhập</button>
      <button class="signup-btn">Đăng ký</button>
    `;

    document.querySelector(".login-btn").addEventListener("click", () => {
      window.location.href = "dangnhap.html";
    });

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

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const service = btn.parentElement.querySelector("h3").textContent;

      if (service.includes("phim")) window.location.href = "film.html";
      else if (service.includes("phương tiện")) window.location.href = "vehicle.html";
      else if (service.includes("khách sạn")) window.location.href = "hotel.html";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".film-track");
  const leftBtn = document.querySelector(".arrow.left");
  const rightBtn = document.querySelector(".arrow.right");

  let index = 0;
  const cardWidth = 322; // 310 + 12 gap
  const totalCards = document.querySelectorAll(".film-card").length;
  const visibleCards = 4;

  rightBtn.addEventListener("click", () => {
    if (index < totalCards - visibleCards) index++;
    updateSlider();
  });

  leftBtn.addEventListener("click", () => {
    if (index > 0) index--;
    updateSlider();
  });

  function updateSlider() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});
