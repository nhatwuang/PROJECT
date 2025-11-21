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
      else if (service.includes("phương tiện"))
        window.location.href = "vehicle.html";
      else if (service.includes("khách sạn"))
        window.location.href = "hotel.html";
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

// ===============================
// 📌 HÀM HIỂN THỊ THÔNG BÁO (TOAST)
// ===============================
function showToast(message, type = "success") {
  // Tìm vùng chứa thông báo
  let notification = document.getElementById("notification");

  // Nếu chưa có <div id="notification"> trong HTML → tạo thêm
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    document.body.appendChild(notification);
  }

  // Tạo thông báo mới
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  // Thêm thông báo vào vùng hiển thị
  notification.appendChild(toast);

  // Tự động xóa sau 3 giây
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==============================================
// 🔹 Hiển thị dữ liệu dịch vụ từ Doanh nghiệp
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const danhSachPhim = JSON.parse(localStorage.getItem("danhSachPhim")) || [];
  const danhSachPhuongTien =
    JSON.parse(localStorage.getItem("danhSachPhuongTien")) || [];
  const danhSachKhachSan =
    JSON.parse(localStorage.getItem("danhSachKhachSan")) || [];

  const filmList = document.querySelector(".film-list");
  const vehicleList = document.querySelector(".vehicle-list");
  const hotelList = document.querySelector(".hotel-list");

  // Hiển thị phim
  if (filmList && danhSachPhim.length > 0) {
    filmList.innerHTML = danhSachPhim
      .map(
        (p, i) => `
        <div class="film-card" data-type="phim" data-index="${i}">
          <img src="${p.anh}" alt="${p.ten}" />
          <h3>${p.ten}</h3>
          <p>${p.moTa}</p>
          <p><b>Giá:</b> ${p.gia} VNĐ</p>
          <button class="buy-btn">🎟️ Đặt vé</button>
        </div>`
      )
      .join("");
  }

  // Hiển thị khách sạn
  if (hotelList && danhSachKhachSan.length > 0) {
    hotelList.innerHTML = danhSachKhachSan
      .map(
        (h, i) => `
        <div class="hotel-item" data-type="khachsan" data-index="${i}">
          <img src="${h.anh}" alt="${h.ten}" />
          <h3>${h.ten}</h3>
          <p>${h.moTa}</p>
          <p><b>Giá:</b> ${h.gia} VNĐ</p>
          <button class="book-btn">🏨 Đặt phòng</button>
        </div>`
      )
      .join("");
  }

  // Hiển thị chuyến đi (phương tiện) trong danh sách vé
  const ticketsList = document.getElementById("ticketsList");
  if (ticketsList && danhSachPhuongTien.length > 0) {
    ticketsList.innerHTML = danhSachPhuongTien
      .map(
        (pt, i) => `
        <div class="ticket-card" data-index="${i}">
          <h3>${pt.loai}</h3>
          <p>${pt.diemDon} → ${pt.diemDen}</p>
          <p>Số ghế: ${pt.soGhe}</p>
          <p>Giá: ${pt.gia} VNĐ</p>
          <button class="book-btn">🎟️ Đặt vé</button>
        </div>`
      )
      .join("");

    // Thêm sự kiện đặt vé
    document.querySelectorAll(".book-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.closest(".ticket-card").dataset.index;
        const ticket = danhSachPhuongTien[index];
        let booked = JSON.parse(localStorage.getItem("bookedTickets")) || [];
        booked.push(ticket);
        localStorage.setItem("bookedTickets", JSON.stringify(booked));
        alert("✅ Đặt vé thành công!");
      });
    });
  }
});
