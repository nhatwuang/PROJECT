// ==============================================
// 🔹 Hiệu ứng khi cuộn xuống phần "Dịch vụ"
// ==============================================

window.addEventListener("scroll", () => {
  const services = document.querySelector(".services"); // [FIX] Thêm dòng này để không bị lỗi nếu trang không có mục services
  if (!services) return;

  const position = services.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (position < screenHeight - 100) {
    services.classList.add("visible");
  }
});

// ==============================================
// 🔹 Xử lý đăng nhập / đăng ký / đăng xuất & Tải trang
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Xử lý Auth ---
  const authBtns = document.querySelector(".auth-btns");
  const username = localStorage.getItem("username");

  if (authBtns) {
    // [FIX] Kiểm tra tồn tại
    if (username) {
      authBtns.innerHTML = `
          <span class="welcome">Xin chào, <b>${username}</b></span>
          <button class="login-btn">Đăng xuất</button>
        `;
      document.querySelector(".login-btn").addEventListener("click", () => {
        localStorage.removeItem("username");
        location.reload();
      });
    } else {
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
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Hiển thị Form & Danh sách (Bỏ ẩn class 'hidden' trong HTML)
  const formSection = document.getElementById("form-phuongtien");
  const listSection = document.getElementById("list-phuongtien");
  if (formSection) formSection.classList.remove("hidden");
  if (listSection) listSection.classList.remove("hidden"); // 2. Tải dữ liệu ban đầu

  loadServices(); // Load danh sách xe đã thêm
  loadBookedTickets(); // Load danh sách vé khách đặt
  calculateRevenue(); // Tính doanh thu // 3. Bắt sự kiện Submit form thêm xe

  const form = document.getElementById("addPhuongTienForm");
  if (form) {
    form.addEventListener("submit", handleAddVehicle);
  } // 4. Bắt sự kiện xem trước ảnh

  const imgInput = document.getElementById("anhPhuongTien");
  if (imgInput) {
    imgInput.addEventListener("change", function () {
      const previewDiv = document.getElementById("previewPhuongTien");
      previewImage(this, previewDiv);
    });
  } // 5. Xử lý nút đóng Popup

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".popup").style.display = "none";
    });
  });
});

// ============================================================
// 1. CHỨC NĂNG THÊM CHUYẾN XE (LƯU VÀO KHO CHUNG)
// ============================================================

async function handleAddVehicle(e) {
  e.preventDefault(); // Chặn load lại trang // Lấy giá trị từ form // [FIX] Sửa logic lấy loại phương tiện cho chính xác

  const typeSelect = document.getElementById("loaiPhuongTien"); // Nếu không tìm thấy select (do bạn dùng template cũ), mặc định là Xe Khách
  const vehicleType = typeSelect ? typeSelect.value : "Xe Khách";

  const fromInput = document.getElementById("diemDon");
  const toInput = document.getElementById("diemDen");
  const seatsInput = document.getElementById("soGhe");
  const priceInput = document.getElementById("giaVePhuongTien");
  const imageInput = document.getElementById("anhPhuongTien"); // Xử lý ảnh sang Base64

  let imageSrc = "images/default-vehicle.jpg"; // Ảnh mặc định
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0]; // Kiểm tra dung lượng < 2MB để tránh lỗi LocalStorage
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB");
      return;
    }
    try {
      imageSrc = await toBase64(file);
    } catch (err) {
      console.error(err);
    }
  } // Tạo đối tượng chuyến xe

  const newRoute = {
    id: Date.now(),
    from: fromInput.value.trim(),
    to: toInput.value.trim(),
    date: new Date().toISOString().split("T")[0], // Mặc định ngày hiện tại
    time: "08:00",
    price: parseInt(priceInput.value).toLocaleString("vi-VN") + " VNĐ",
    rawPrice: parseInt(priceInput.value),
    vehicle: vehicleType,
    type: "Limousine VIP",
    seatsAvailable: seatsInput.value,
    image: imageSrc,
  }; // Lưu vào LocalStorage

  let currentRoutes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  currentRoutes.push(newRoute);

  try {
    localStorage.setItem("repo_tuyen_xe", JSON.stringify(currentRoutes));
    alert("✅ Đã đăng chuyến xe thành công!");

    e.target.reset(); // Reset form // [FIX] Xóa ảnh preview sau khi thêm
    const previewDiv = document.getElementById("previewPhuongTien");
    if (previewDiv) previewDiv.innerHTML = "";

    loadServices();
  } catch (err) {
    alert("⚠️ Bộ nhớ đầy! Hãy xóa bớt chuyến cũ.");
  }
}

// ============================================================
// 2. HIỂN THỊ DANH SÁCH XE ĐÃ THÊM (ĐÃ LÀM SẠCH)
// ============================================================

function loadServices() {
  const routes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  renderList("addedPhuongTienList", routes, true);
  renderList("tripsList", routes, false);
}

function renderList(elementId, data, showDelete) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = "<p class='placeholder'>Chưa có dữ liệu.</p>";
    return;
  }

  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "service-item fade-in";
    card.innerHTML = `
        <div class="service-info">
            <img src="${item.image}" alt="Xe">
            <div class="service-text">
                <strong>${item.from} ➝ ${item.to}</strong>
                <span>${item.vehicle} • ${item.price} • ${
      item.seatsAvailable
    } ghế</span>
            </div>
        </div>
        <div class="service-actions">
            <button class="btn-view" onclick="viewVehicleDetails(${index})">Xem</button>
            ${
      showDelete
        ? `<button class="delete-btn" onclick="deleteService(${index})">Xóa</button>`
        : ""
    }
        </div>
    `;
    container.appendChild(card);
  });
}

// ============================================================
// 3. HIỂN THỊ VÉ ĐÃ ĐẶT (ĐÃ LÀM SẠCH)
// ============================================================

function loadBookedTickets() {
  const container = document.getElementById("bookedTicketsList");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p class='placeholder'>Chưa có vé nào được đặt.</p>";
    return;
  }

  orders.forEach((order) => {
    const item = document.createElement("div");
    item.className = "service-item booked-item"; // Thêm class booked-item để style riêng

    item.innerHTML = `
        <div class="service-info">
            <div class="service-text">
                <strong>Khách: ${order.customer.name}</strong> 
                <span class="sub-text">(${order.customer.phone})</span><br>
                <span class="route-text">Chuyến: ${order.route.from} ➝ ${
      order.route.to
    }</span><br>
                <span class="date-text">Ngày đi: ${order.route.date}</span>
            </div>
        </div>
        <div class="service-price">
            <strong>${order.route.price}</strong><br>
            <span>${new Date(order.bookingTime).toLocaleDateString(
      "vi-VN"
    )}</span>
        </div>
    `;
    container.appendChild(item);
  });
}

// Hàm xóa chuyến xe
window.deleteService = function (index) {
  if (confirm("Bạn chắc chắn muốn xóa chuyến này?")) {
    let routes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
    routes.splice(index, 1);
    localStorage.setItem("repo_tuyen_xe", JSON.stringify(routes));
    loadServices();
  }
};

// [FIX] Hàm xem chi tiết (Popup) - Đã thêm mới để nút "Xem" hoạt động
window.viewVehicleDetails = function (index) {
  let routes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  const item = routes[index];

  document.getElementById("popupVehicleImage").src = item.image;
  document.getElementById("popupVehicleLoai").innerText = item.vehicle; // Sửa thành hiển thị loại xe
  document.getElementById(
    "popupVehicleRoute"
  ).innerText = `Lộ trình: ${item.from} - ${item.to}`;
  document.getElementById(
    "popupVehicleSeats"
  ).innerText = `Số ghế: ${item.seatsAvailable}`;
  document.getElementById(
    "popupVehicleGia"
  ).innerText = `Giá vé: ${item.price}`;

  document.getElementById("vehiclePopup").style.display = "flex";
};

// ============================================================
// 3. QUẢN LÝ ĐƠN HÀNG & DOANH THU (TỪ TRANG CUSTOMER)
// ============================================================

function loadBookedTickets() {
  const container = document.getElementById("bookedTicketsList");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p class='placeholder'>Chưa có vé nào được đặt.</p>";
    return;
  }

  orders.forEach((order) => {
    const item = document.createElement("div");
    item.className = "service-item";
    item.style.cssText =
      "display:flex; justify-content:space-between; align-items:center; background:#f9f9f9; border-left:5px solid #00c897; padding:15px; margin-bottom:10px; border-radius:4px;";

    item.innerHTML = `
            <div>
                <strong style="color:#333;">Khách: ${
      order.customer.name
    }</strong> - <span style="color:#555;">${order.customer.phone}</span><br>
                <span style="font-size:14px; color:#001b80;">Chuyến: ${
      order.route.from
    } ➝ ${order.route.to}</span><br>
                <span style="font-size:12px; color:#888;">Ngày đi: ${
      order.route.date
    }</span>
            </div>
            <div style="text-align:right;">
                <strong style="color:#d35400; font-size:16px;">${
      order.route.price
    }</strong><br>
                <span style="font-size:11px; color:#aaa;">${new Date(
      order.bookingTime
    ).toLocaleString("vi-VN")}</span>
            </div>
        `;
    container.appendChild(item);
  });
}

function calculateRevenue() {
  const el = document.getElementById("totalRevenue");
  if (!el) return;

  const orders = JSON.parse(localStorage.getItem("bookedTickets") || "[]");

  const total = orders.reduce((sum, order) => {
    // Chuyển đổi chuỗi "750.000 VNĐ" thành số 750000
    let price = parseInt(
      order.route.price.toString().replace(/\./g, "").replace(/\D/g, "")
    );
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  el.innerText = total.toLocaleString("vi-VN") + " VNĐ";
}

// ============================================================
// 4. CÁC HÀM HỖ TRỢ (HELPER)
// ============================================================

function previewImage(input, previewDiv) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:100%; height:auto; border-radius:8px; margin-top:10px;">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
