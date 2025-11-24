// ==========================================================
// 1. CẤU HÌNH & DỮ LIỆU CƠ BẢN
// ==========================================================

// Danh sách tỉnh thành Việt Nam (Dùng cho gợi ý tìm kiếm)
const vietnamProvinces = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP. Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

// Dữ liệu mẫu dự phòng (Chỉ dùng khi Business chưa nhập gì)
const backupRoutes = [
  {
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "2025-12-01",
    price: "750.000 VNĐ",
  },
  { from: "Hà Nội", to: "Đà Nẵng", date: "2025-12-01", price: "400.000 VNĐ" },
  { from: "Đà Nẵng", to: "Huế", date: "2025-12-02", price: "120.000 VNĐ" },
  {
    from: "TP. Hồ Chí Minh",
    to: "Cần Thơ",
    date: "2025-12-05",
    price: "200.000 VNĐ",
  },
  {
    from: "Hà Nội",
    to: "TP. Hồ Chí Minh",
    date: "2025-12-10",
    price: "700.000 VNĐ",
  },
];

// ==========================================================
// 2. HÀM KHỞI TẠO DỮ LIỆU (QUAN TRỌNG NHẤT - ĐÃ SỬA)
// ==========================================================

function initializeLocalStorage() {
  // BƯỚC 1: Kiểm tra xem Doanh nghiệp đã nhập dữ liệu chưa (key: repo_tuyen_xe)
  const businessRoutes = JSON.parse(
    localStorage.getItem("repo_tuyen_xe") || "[]"
  );

  if (businessRoutes.length > 0) {
    console.log(
      `🔥 Đã tải ${businessRoutes.length} chuyến đi từ Doanh nghiệp.`
    );
    // Lưu vào 'routes' để hàm tìm kiếm sử dụng
    localStorage.setItem("routes", JSON.stringify(businessRoutes));
  } else {
    // BƯỚC 2: Nếu chưa có dữ liệu doanh nghiệp, dùng dữ liệu mẫu dự phòng
    // Kiểm tra xem 'routes' đã có chưa, nếu chưa thì mới nạp backup
    if (!localStorage.getItem("routes")) {
      console.log("⚠️ Chưa có dữ liệu doanh nghiệp, sử dụng dữ liệu mẫu.");
      localStorage.setItem("routes", JSON.stringify(backupRoutes));
    }
  }
}

// ==========================================================
// 3. CÁC HÀM GIAO DIỆN & TÌM KIẾM
// ==========================================================

function hideResultsContainer() {
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) resultsContainer.style.display = "none";
}

function showResultsContainer() {
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) resultsContainer.style.display = "block";
}

// Hàm Tìm kiếm
function searchRoutes(event) {
  event.preventDefault();
  hideResultsContainer();

  const departure = document
    .getElementById("departure")
    .value.trim()
    .toLowerCase();
  const destination = document
    .getElementById("destination")
    .value.trim()
    .toLowerCase();
  const travelDate = document.getElementById("travel-date").value;

  // Lấy dữ liệu (lúc này 'routes' đã chứa dữ liệu từ Business hoặc Backup)
  const storedRoutes = localStorage.getItem("routes");
  const allRoutes = storedRoutes ? JSON.parse(storedRoutes) : [];

  const searchResults = allRoutes.filter((route) => {
    const matchFrom = route.from.toLowerCase().includes(departure);
    const matchTo = route.to.toLowerCase().includes(destination);
    // Nếu không chọn ngày (travelDate rỗng) -> Bỏ qua check ngày
    const matchDate = !travelDate || route.date === travelDate;

    return matchFrom && matchTo && matchDate;
  });

  showResultsContainer();
  displayResults(searchResults);
}

// Hàm Hiển thị kết quả
function displayResults(results) {
  const resultsList = document.getElementById("results-list");
  const noResultsMessage = document.getElementById("no-results");
  if (!resultsList) return;

  resultsList.innerHTML = "";

  if (results.length > 0) {
    if (noResultsMessage) noResultsMessage.style.display = "none";

    results.forEach((route) => {
      const li = document.createElement("li");
      li.className = "route-item";

      // Xử lý hiển thị ảnh (ưu tiên ảnh doanh nghiệp up lên)
      const imageHTML = route.image
        ? `<img src="${route.image}" style="width:80px; height:60px; object-fit:cover; border-radius:5px; margin-right:15px;">`
        : "";

      // Hiển thị loại xe (nếu có)
      const vehicleType = route.vehicle || "Xe Khách";
      const seatType = route.type || "Tiêu chuẩn";

      li.innerHTML = `
        <div style="display:flex; align-items:center;">
            ${imageHTML}
            <div class="route-info">
                <strong>${route.from} &rarr; ${route.to}</strong> <small>(${vehicleType})</small><br>
                <span>${seatType}</span> <br>
                Ngày: ${route.date} | Giá: <span class="price-tag">${route.price}</span>
            </div>
        </div>
        <button class="book-button" 
                data-from="${route.from}" 
                data-to="${route.to}" 
                data-date="${route.date}" 
                data-price="${route.price}"
                data-vehicle="${vehicleType}">
            🎫 ĐẶT VÉ
        </button>
      `;
      resultsList.appendChild(li);
    });

    // Gắn sự kiện đặt vé
    document.querySelectorAll(".book-button").forEach((button) => {
      button.addEventListener("click", handleBooking);
    });
  } else {
    if (noResultsMessage) noResultsMessage.style.display = "block";
  }
}

// Hàm Xử lý Đặt Vé
function handleBooking(event) {
  const button = event.currentTarget;
  const bookingDetails = {
    from: button.dataset.from,
    to: button.dataset.to,
    date: button.dataset.date,
    price: button.dataset.price,
    vehicle: button.dataset.vehicle,
  };
  localStorage.setItem("selectedRoute", JSON.stringify(bookingDetails));
  window.location.href = "datve.html";
}

// ==========================================================
// 4. CÁC HÀM HỖ TRỢ KHÁC (AUTOCOMPLETE, BOOKED LIST, ETC.)
// ==========================================================

function setupAutocomplete(inputElement) {
  if (!inputElement) return;
  const suggestionList = document.createElement("ul");
  suggestionList.className = "suggestion-list";
  inputElement.parentNode.appendChild(suggestionList);

  function showSuggestions(query) {
    suggestionList.innerHTML = "";
    if (!query) {
      suggestionList.style.display = "none";
      return;
    }
    const filteredProvinces = vietnamProvinces.filter((province) =>
      province.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredProvinces.length > 0) {
      filteredProvinces.forEach((province) => {
        const item = document.createElement("li");
        item.className = "suggestion-item";
        item.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${province}`;
        item.addEventListener("click", () => {
          inputElement.value = province;
          suggestionList.style.display = "none";
        });
        suggestionList.appendChild(item);
      });
      suggestionList.style.display = "block";
    } else {
      suggestionList.style.display = "none";
    }
  }

  inputElement.addEventListener("input", function () {
    showSuggestions(this.value);
  });
  inputElement.addEventListener("focus", function () {
    showSuggestions(this.value);
  });
  document.addEventListener("click", function (e) {
    if (
      !inputElement.contains(e.target) &&
      !suggestionList.contains(e.target)
    ) {
      suggestionList.style.display = "none";
    }
  });
}

function displayBookedTickets() {
  const ticketsListElement = document.getElementById("ticketsList");
  if (!ticketsListElement) return;
  ticketsListElement.innerHTML = "";
  const bookedTickets = JSON.parse(
    localStorage.getItem("bookedTickets") || "[]"
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
          <button class="cancel-button" data-index="${index}">Hủy Vé</button>
      `;
      ticketsListElement.appendChild(ticketDiv);
    });

    document.querySelectorAll(".cancel-button").forEach((button) => {
      button.addEventListener("click", handleCancelTicket);
    });
  } else {
    ticketsListElement.innerHTML =
      '<p class="no-tickets">Bạn chưa có vé nào.</p>';
  }
}

function handleCancelTicket(event) {
  const index = parseInt(event.currentTarget.dataset.index);
  let bookedTickets = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
  bookedTickets.splice(index, 1);
  localStorage.setItem("bookedTickets", JSON.stringify(bookedTickets));
  showToast("Đã hủy vé thành công!", "error");
  displayBookedTickets();
}

function showToast(message, type = "success") {
  let notification = document.getElementById("notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    document.body.appendChild(notification);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  notification.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================================
// 5. MAIN RUN (CHẠY KHI TRANG TẢI XONG)
// ==========================================================

// Hiệu ứng cuộn
window.addEventListener("scroll", () => {
  const services = document.querySelector(".services");
  if (!services) return;
  const position = services.getBoundingClientRect().top;
  if (position < window.innerHeight - 100) {
    services.classList.add("visible");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. Auth (Header)
  const authBtns = document.querySelector(".auth-btns");
  const username = localStorage.getItem("username");
  if (authBtns) {
    if (username) {
      authBtns.innerHTML = `<span class="welcome">Xin chào, <b>${username}</b></span><button class="logout-btn">Đăng xuất</button>`;
      document.querySelector(".logout-btn").addEventListener("click", () => {
        localStorage.removeItem("username");
        location.reload();
      });
    } else {
      authBtns.innerHTML = `<button class="login-btn">Đăng nhập</button><button class="signup-btn">Đăng ký</button>`;
      document
        .querySelector(".login-btn")
        .addEventListener(
          "click",
          () => (window.location.href = "dangnhap.html")
        );
      document
        .querySelector(".signup-btn")
        .addEventListener(
          "click",
          () => (window.location.href = "dangnhap.html")
        );
    }
  }

  // 2. Khởi tạo dữ liệu & Hiển thị
  initializeLocalStorage(); // [QUAN TRỌNG] Hàm này sẽ nạp dữ liệu từ Business
  hideResultsContainer();
  displayBookedTickets();

  // 3. Search Form
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", searchRoutes);
    setupAutocomplete(document.getElementById("departure"));
    setupAutocomplete(document.getElementById("destination"));
  }

  // 4. Nút Dịch vụ (Service Items)
  const serviceButtons = document.querySelectorAll(".service-item a");
  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const h3 = btn.parentElement.querySelector("h3");
      if (!h3) return;
      const service = h3.textContent;
      if (service.includes("khách")) window.location.href = "bus.html";
      else if (service.includes("tàu")) window.location.href = "train.html";
      else if (service.includes("máy bay")) window.location.href = "plane.html";
    });
  });
});
