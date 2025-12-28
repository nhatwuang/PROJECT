// ==============================================
// 🔹 Hiệu ứng khi cuộn xuống phần "Dịch vụ"
// ==============================================

window.addEventListener("scroll", () => {
  const services = document.querySelector(".services");
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
  const authBtns = document.querySelector(".auth-btns");
  const username = localStorage.getItem("username");

  if (authBtns) {
    if (username) {
      authBtns.innerHTML = `
          <span class="welcome">Xin chào, <b>${username}</b></span>
          <button class="login-btn">Đăng xuất</button>
        `;
      document.querySelector(".login-btn").addEventListener("click", () => {
        localStorage.removeItem("username");
        location.reload();
        window.location.href = "dangnhap.html";
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
  const formSection = document.getElementById("form-phuongtien");
  const listSection = document.getElementById("list-phuongtien");
  if (formSection) formSection.classList.remove("hidden");
  if (listSection) listSection.classList.remove("hidden");

  loadServices();
  displayBookedTickets();
  calculateRevenue();

  const form = document.getElementById("addPhuongTienForm");
  if (form) {
    form.addEventListener("submit", handleAddVehicle);
  }

  const imgInput = document.getElementById("anhPhuongTien");
  if (imgInput) {
    imgInput.addEventListener("change", function () {
      const previewDiv = document.getElementById("previewPhuongTien");
      previewImage(this, previewDiv);
    });
  }

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".popup").style.display = "none";
    });
  });
});

// ============================================================
// 1. CHỨC NĂNG THÊM CHUYẾN XE
// ============================================================

async function handleAddVehicle(e) {
  e.preventDefault();
  const typeSelect = document.getElementById("loaiPhuongTien");
  const vehicleType = typeSelect ? typeSelect.value : "Xe Khách";

  const fromInput = document.getElementById("diemDon");
  const toInput = document.getElementById("diemDen");
  const seatsInput = document.getElementById("soGhe");
  const priceInput = document.getElementById("giaVePhuongTien");
  const imageInput = document.getElementById("anhPhuongTien");

  let imageSrc = "images/default-vehicle.jpg";
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    if (file.size > 2 * 1024 * 1024) {
      showToast("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB", "error");
      return;
    }
    try {
      imageSrc = await toBase64(file);
    } catch (err) {
      console.error(err);
    }
  }

  const newRoute = {
    id: Date.now(),
    from: fromInput.value.trim(),
    to: toInput.value.trim(),
    date: new Date().toISOString().split("T")[0],
    time: "08:00",
    price: parseInt(priceInput.value).toLocaleString("vi-VN") + " VNĐ",
    rawPrice: parseInt(priceInput.value),
    vehicle: vehicleType,
    seatsAvailable: seatsInput.value,
    image: imageSrc,
  };

  let currentRoutes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  currentRoutes.push(newRoute);

  try {
    localStorage.setItem("repo_tuyen_xe", JSON.stringify(currentRoutes));
    showToast("Đã thêm chuyến xe thành công!", "success");

    e.target.reset();
    const previewDiv = document.getElementById("previewPhuongTien");
    if (previewDiv) previewDiv.innerHTML = "";

    loadServices();
  } catch (err) {
    showToast("Bộ nhớ đầy", "error");
  }
}

// ============================================================
// 2. HIỂN THỊ DANH SÁCH XE ĐÃ THÊM (ĐÃ LÀM SẠCH)
// ============================================================

function loadServices() {
  const routes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  renderList("addedPhuongTienList", routes, true);
  renderList("tripsList", routes, false);
  loadBookedTickets();
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
        <img src="${item.image || "images/default-vehicle.jpg"}" alt="Xe">
        <div class="service-text">
          <strong>${item.from} ➝ ${item.to}</strong>
          <span>${item.vehicle || "Xe Khách"} • ${item.price || ""} • ${
      item.seatsAvailable || 0
    } ghế</span>
        </div>
      </div>
      <div class="service-actions">
        <button class="btn-view" onclick="viewVehicleDetails(${index})">Xem</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================================
// 3. Hiển thị danh sách vé đã đặt
// ==========================================================

function displayBookedTickets() {
  const username = localStorage.getItem("username");
  if (!username) return;
  const ticketsListElement = document.getElementById("ticketsList");
  if (!ticketsListElement) return;

  ticketsListElement.innerHTML = "";
  const bookedTickets = JSON.parse(
    localStorage.getItem("bookedTickets_Khách hàng") || "[]"
  );

  if (bookedTickets.length > 0) {
    bookedTickets.forEach((booking, index) => {
      const ticketDiv = document.createElement("div");
      ticketDiv.className = "ticket-card new-ticket-style";
      ticketDiv.innerHTML = `
          <div class="ticket-header">
              <h3>Vé #${index + 1}</h3>
              <span class="status booked">Đã Xác Nhận</span>
          </div>
          <div class="ticket-details">
              <p><strong>Tuyến:</strong> ${booking.route.from} &rarr; ${
        booking.route.to
      }</p>
              <p><strong>Ngày:</strong> ${booking.route.date}</p>
              <p><strong>Giá:</strong> <span class="price-value">${
                booking.route.price
              }</span></p>
              <hr>
              <p><strong>Khách:</strong> ${booking.customer.name}</p>
              <p><strong>SĐT:</strong> ${booking.customer.phone}</p>
          </div>
         
      `;
      ticketsListElement.appendChild(ticketDiv);
    });
  } else {
    ticketsListElement.innerHTML =
      '<p class="no-tickets">Bạn chưa có vé nào.</p>';
  }
}

// ============================================================
// 4. QUẢN LÝ ĐƠN HÀNG & DOANH THU
// ============================================================

function loadBookedTickets() {
  const username = localStorage.getItem("username");
  if (!username) return;

  const container = document.getElementById("bookedTicketsList");
  if (!container) return;

  const orders = JSON.parse(
    localStorage.getItem(`bookedTickets_${username}`) || "[]"
  );
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p class='placeholder'>Chưa có vé nào được đặt.</p>";
    return;
  }

  orders.forEach((order) => {
    const item = document.createElement("div");
    item.className = "service-item";

    item.innerHTML = `
        <div class="order-info">
            <strong class="order-customer">Khách: ${
              order.customer.name
            }</strong> - 
            <span class="order-phone">${order.customer.phone}</span><br>
            <span class="order-route">Chuyến: ${order.route.from} ➝ ${
      order.route.to
    }</span><br>
            <span class="order-date">Ngày đi: ${order.route.date}</span>
        </div>
        <div class="order-meta">
            <strong class="order-price">${order.route.price}</strong><br>
            <span class="order-time">${new Date(
              order.bookingTime
            ).toLocaleString("vi-VN")}</span>
        </div>
    `;
    container.appendChild(item);
  });
}

function viewVehicleDetails(index) {
  const repo = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  const item = repo[index];
  if (!item) return;

  const popup = document.getElementById("vehiclePopup");
  if (!popup) return;

  document.getElementById("popupVehicleImage").src =
    item.image || "images/default-vehicle.jpg";
  document.getElementById("popupVehicleLoai").textContent =
    item.vehicle || "Xe Khách";
  document.getElementById(
    "popupVehicleRoute"
  ).textContent = `${item.from} ➝ ${item.to}`;
  document.getElementById("popupVehicleSeats").textContent = `Số ghế: ${
    item.seatsAvailable || 0
  }`;
  document.getElementById("popupVehicleGia").textContent = `Giá: ${
    item.price || ""
  }`;

  popup.style.display = "flex";

  // Đóng popup
  popup
    .querySelector(".close-btn")
    ?.addEventListener("click", () => (popup.style.display = "none"), {
      once: true,
    });

  popup.addEventListener(
    "click",
    (e) => {
      if (e.target === popup) popup.style.display = "none";
    },
    { once: true }
  );

  // XÓA
  const deleteBtn = document.getElementById("popupDeleteBtn");
  deleteBtn?.addEventListener(
    "click",
    () => {
      const newRepo = repo.filter((r) => r.id !== item.id);
      localStorage.setItem("repo_tuyen_xe", JSON.stringify(newRepo));

      popup.style.display = "none";
      loadServices();
      showToast("Đã xóa chuyến đi thành công!", "success");
    },
    { once: true }
  );
}

function calculateRevenue() {
  const el = document.getElementById("totalRevenue");
  if (!el) return;

  const orders = JSON.parse(
    localStorage.getItem("bookedTickets_Khách hàng") || "[]"
  );

  const total = orders.reduce((sum, order) => {
    let price = parseInt(
      order.route.price.toString().replace(/\./g, "").replace(/\D/g, "")
    );
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  el.innerText = total.toLocaleString("vi-VN") + " VNĐ";
}

// ============================================================
// 5. CÁC HÀM HỖ TRỢ
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
function showToast(message, type) {
  let notification = document.getElementById("notification");
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  notification.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
