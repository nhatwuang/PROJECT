document.addEventListener("DOMContentLoaded", () => {
  // 1. Khởi tạo dữ liệu
  loadServices(); // Tải danh sách chuyến đi đã thêm
  loadBookedTickets(); // Tải danh sách vé khách đã đặt
  calculateRevenue(); // Tính doanh thu

  // 2. Xử lý sự kiện Thêm Phương Tiện
  const formPhuongTien = document.getElementById("addPhuongTienForm");
  if (formPhuongTien) {
    formPhuongTien.addEventListener("submit", handleAddVehicle);
  }

  // 3. Xử lý xem trước ảnh (Preview Image)
  const imgInput = document.getElementById("anhPhuongTien");
  if (imgInput) {
    imgInput.addEventListener("change", function (e) {
      const previewDiv = document.getElementById("previewPhuongTien");
      previewImage(this, previewDiv);
    });
  }
});

// ============================================================
// 1. QUẢN LÝ DỊCH VỤ (THÊM/XÓA CHUYẾN XE)
// ============================================================

async function handleAddVehicle(e) {
  e.preventDefault();

  // Lấy dữ liệu từ form
  // Lưu ý: Trong HTML bạn có 2 ID 'loaiPhuongTien', code sẽ lấy cái đầu tiên tìm thấy.
  // Bạn nên xóa thẻ input thừa, chỉ để lại thẻ select.
  const typeElement = document.querySelectorAll("#loaiPhuongTien");
  const type =
    typeElement.length > 1 ? typeElement[1].value : typeElement[0].value; // Ưu tiên lấy từ thẻ select nếu có 2 cái

  const from = document.getElementById("diemDon").value.trim();
  const to = document.getElementById("diemDen").value.trim();
  const seats = document.getElementById("soGhe").value;
  const priceRaw = document.getElementById("giaVePhuongTien").value;
  const imageInput = document.getElementById("anhPhuongTien");

  // Chuyển ảnh sang Base64
  let imageSrc = "images/default-vehicle.jpg";
  if (imageInput.files && imageInput.files[0]) {
    try {
      imageSrc = await toBase64(imageInput.files[0]);
    } catch (err) {
      console.error("Lỗi ảnh:", err);
    }
  }

  // Tạo đối tượng chuyến đi
  const newRoute = {
    id: Date.now(),
    from: from,
    to: to,
    date: new Date().toISOString().split("T")[0], // Mặc định ngày hiện tại
    time: "08:00", // Giờ mặc định
    price: parseInt(priceRaw).toLocaleString("vi-VN") + " VNĐ",
    rawPrice: parseInt(priceRaw),
    vehicle: type || "Xe khách", // Tên loại phương tiện (Xe khách, Tàu...)
    type: "Tiêu chuẩn", // Loại ghế
    seatsAvailable: seats,
    image: imageSrc,
  };

  // Lưu vào LocalStorage chung (repo_tuyen_xe)
  let currentRoutes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
  currentRoutes.push(newRoute);
  localStorage.setItem("repo_tuyen_xe", JSON.stringify(currentRoutes));

  alert("✅ Đã thêm chuyến đi thành công!");
  e.target.reset(); // Xóa form
  document.getElementById("previewPhuongTien").innerHTML = ""; // Xóa ảnh preview

  loadServices(); // Load lại danh sách
}

function loadServices() {
  const routes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");

  // Render vào 2 nơi: Tab quản lý dịch vụ & Tab danh sách chuyến đi
  renderList("addedPhuongTienList", routes, true); // True = hiện nút xóa
  renderList("tripsList", routes, false); // False = chỉ xem
}

function renderList(elementId, data, showDelete) {
  const container = document.getElementById(elementId);
  if (!container) return;

  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML =
      "<p class='placeholder'>Chưa có chuyến đi nào được thêm.</p>";
    return;
  }

  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "service-item fade-in";
    card.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${
                  item.image
                }" style="width:60px; height:60px; object-fit:cover; border-radius:5px;">
                <div>
                    <strong>${item.vehicle}: ${item.from} ➝ ${
      item.to
    }</strong><br>
                    <span style="color:#555; font-size:14px;">Giá: ${
                      item.price
                    } | Ghế: ${item.seatsAvailable}</span>
                </div>
            </div>
            ${
              showDelete
                ? `<button class="delete-btn" onclick="deleteService(${index})">×</button>`
                : ""
            }
        `;
    // CSS inline cho nút xóa nếu chưa có trong CSS
    if (showDelete) {
      card.style.position = "relative";
    }
    container.appendChild(card);
  });
}

// Hàm xóa chuyến đi (Gán vào window để gọi được từ HTML string)
window.deleteService = function (index) {
  if (confirm("Bạn có chắc muốn xóa chuyến đi này?")) {
    let routes = JSON.parse(localStorage.getItem("repo_tuyen_xe") || "[]");
    routes.splice(index, 1);
    localStorage.setItem("repo_tuyen_xe", JSON.stringify(routes));
    loadServices();
  }
};

// ============================================================
// 2. QUẢN LÝ VÉ ĐÃ ĐẶT & DOANH THU
// ============================================================

function loadBookedTickets() {
  const container = document.getElementById("bookedTicketsList");
  if (!container) return;

  // Lấy dữ liệu vé khách hàng đã đặt (bookedTickets)
  const orders = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p class='placeholder'>Chưa có vé nào được đặt.</p>";
    return;
  }

  orders.forEach((order) => {
    const item = document.createElement("div");
    item.className = "service-item"; // Tái sử dụng class service-item
    // Style riêng cho vé
    item.style.borderLeft = "5px solid #00c897";

    item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>Khách hàng: ${order.customer.name}</strong> (${
      order.customer.phone
    })<br>
                    <span style="color:#555;">Chuyến: ${order.route.from} ➝ ${
      order.route.to
    }</span><br>
                    <span style="font-size:13px; color:#888;">Ngày đi: ${
                      order.route.date
                    }</span>
                </div>
                <div style="text-align:right;">
                    <strong style="color:#d35400; font-size:16px;">${
                      order.route.price
                    }</strong><br>
                    <span style="font-size:12px; color:#aaa;">${new Date(
                      order.bookingTime
                    ).toLocaleDateString("vi-VN")}</span>
                </div>
            </div>
        `;
    container.appendChild(item);
  });
}

function calculateRevenue() {
  const revenueElement = document.getElementById("totalRevenue");
  if (!revenueElement) return;

  const orders = JSON.parse(localStorage.getItem("bookedTickets") || "[]");
  let total = 0;

  orders.forEach((order) => {
    // Xử lý chuỗi giá tiền "750.000 VNĐ" -> số 750000
    let priceString = order.route.price.toString();
    let priceNumber = parseInt(
      priceString.replace(/\./g, "").replace(/\D/g, "")
    ); // Loại bỏ dấu chấm và chữ

    if (!isNaN(priceNumber)) {
      total += priceNumber;
    }
  });

  revenueElement.innerText = total.toLocaleString("vi-VN") + " VNĐ";
}

// ============================================================
// 3. CÁC HÀM HỖ TRỢ (HELPER)
// ============================================================

// Hàm hiển thị ảnh preview
function previewImage(input, previewDiv) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// Hàm chuyển file sang Base64 để lưu vào LocalStorage
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
