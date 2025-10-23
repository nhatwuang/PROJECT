document.getElementById("book-now").addEventListener("click", () => {
  const cinema = document.getElementById("cinema").value;
  const movie = document.getElementById("movie").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (
    cinema.includes("Chọn") ||
    movie.includes("Chọn") ||
    date.includes("Chọn") ||
    time.includes("Chọn")
  ) {
    alert("Vui lòng chọn đầy đủ thông tin trước khi đặt vé!");
  } else {
    alert(
      `🎟️ Bạn đã đặt vé xem phim "${movie}" tại ${cinema} vào ${time} ngày ${date}.`
    );
  }
});
// Thêm hiệu ứng CSS khi hiện ra
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .services {
      opacity: 0;
      transform: translateY(40px);
      transition: 0.6s ease;
    }
    .services.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
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
        window.location.href = "dangnhapSS.html";
      });
  }
});
// Ẩn placeholder "Chọn ngày" khi người dùng chọn ngày
const dateInput = document.getElementById("booking-date");
const placeholder = document.querySelector(".placeholder-text");

dateInput.addEventListener("change", function () {
  if (this.value) {
    placeholder.style.opacity = "0";
  } else {
    placeholder.style.opacity = "1";
  }
});
