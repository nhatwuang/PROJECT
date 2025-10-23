// ==============================================
// 🔹 Hiệu ứng khi cuộn xuống phần "Dịch vụ"
// ==============================================

// Lắng nghe sự kiện cuộn (scroll) của cửa sổ trình duyệt
window.addEventListener("scroll", () => {
  // Lấy phần tử có class .services (khu vực danh sách dịch vụ)
  const services = document.querySelector(".services");

  // Lấy vị trí hiện tại của phần tử so với khung nhìn (viewport)
  const position = services.getBoundingClientRect().top;

  // Lấy chiều cao của màn hình (viewport)
  const screenHeight = window.innerHeight;

  // Nếu phần "dịch vụ" xuất hiện trong vùng nhìn thấy của người dùng
  if (position < screenHeight - 100) {
    // Thêm class 'visible' để kích hoạt hiệu ứng CSS (fade-in, slide-in, v.v.)
    services.classList.add("visible");
  }
});

// ==============================================
// 🔹 Thêm hiệu ứng CSS khi tải trang xong
//    + Xử lý đăng nhập / đăng xuất
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  // ⏳ Khi toàn bộ DOM đã sẵn sàng (tải xong)

  // (Có thể có phần CSS động được thêm ở đây)
  document.head.appendChild(style); // chèn thẻ <style> vào <head> (nếu biến style được định nghĩa trước đó)

  // =============================
  // 🔸 Xử lý trạng thái đăng nhập
  // =============================

  // Lấy phần chứa các nút đăng nhập/đăng ký hoặc chào user
  const authBtns = document.querySelector(".auth-btns");

  // Lấy tên người dùng đã lưu trong localStorage (nếu có)
  const username = localStorage.getItem("username");

  // ✅ Nếu người dùng đã đăng nhập trước đó
  if (username) {
    // Thay đổi nội dung HTML hiển thị lời chào và nút đăng xuất
    authBtns.innerHTML = `
      <span class="welcome">Xin chào, <b>${username}</b></span>
      <button class="logout-btn">Đăng xuất</button>
    `;

    // Thêm sự kiện cho nút đăng xuất
    document
      .querySelector(".logout-btn")
      .addEventListener("click", function () {
        // Xóa thông tin đăng nhập khỏi localStorage
        localStorage.removeItem("username");
        // Tải lại trang để cập nhật giao diện về trạng thái "chưa đăng nhập"
        location.reload();
      });
  } else {
    // ❌ Nếu chưa đăng nhập
    // Hiển thị hai nút: Đăng nhập và Đăng ký
    authBtns.innerHTML = `
      <button class="login-btn">Đăng nhập</button>
      <button class="signup-btn">Đăng ký</button>
    `;

    // Khi bấm "Đăng nhập" → chuyển đến trang đăng nhập
    document.querySelector(".login-btn").addEventListener("click", function () {
      window.location.href = "dangnhap.html";
    });

    // Khi bấm "Đăng ký" → cũng chuyển đến trang đăng nhập (nơi có tab đăng ký)
    document
      .querySelector(".signup-btn")
      .addEventListener("click", function () {
        window.location.href = "dangnhap.html";
      });
  }
});

// ==============================================
// 🔹 Gắn sự kiện cho các nút trong phần dịch vụ
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  // Lấy tất cả các nút (thẻ <a>) trong mỗi phần tử .service-item
  const buttons = document.querySelectorAll(".service-item a");

  // Lặp qua từng nút
  buttons.forEach((btn) => {
    // Thêm sự kiện khi người dùng bấm vào
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // Ngăn hành vi mặc định (tránh load lại trang hoặc mở link gốc)

      // Lấy tên dịch vụ trong thẻ <h3> của phần dịch vụ đó
      const service = btn.parentElement.querySelector("h3").textContent;

      // Kiểm tra nội dung tên dịch vụ để điều hướng đến trang tương ứng
      if (service.includes("phim")) window.location.href = "phim.html";
      else if (service.includes("xe")) window.location.href = "xe.html";
      else if (service.includes("khách sạn"))
        window.location.href = "khachsan.html";
      else if (service.includes("sự kiện"))
        window.location.href = "sukien.html";
    });
  });
});
