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
// 🔹 Xử lý hiển thị đăng nhập / đăng xuất ở header
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const authBtns = document.querySelector(".auth-btns");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (authBtns) {
    if (currentUser && currentUser.name) {
      authBtns.innerHTML = `
        <span class="welcome">Xin chào, <b>${currentUser.name}</b></span>
        <button class="logout-btn">Đăng xuất</button>
      `;
      document.querySelector(".logout-btn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
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

// ==============================================
// 🔹 Cuộn mượt khi bấm link trong header/footer
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("header nav a, .footer-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        document.querySelector(targetId).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });
});

// ==============================================
// 🔹 Xử lý hiển thị các tab dịch vụ
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const forms = document.querySelectorAll(".service-form");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      forms.forEach((f) => f.classList.add("hidden"));
      btn.classList.add("active");
      const targetForm = document.getElementById(`form-${btn.dataset.tab}`);
      if (targetForm) targetForm.classList.remove("hidden");
    });
  });
});

// =============================
// 🔹 Xử lý ảnh xem trước
// =============================
const inputAnh = document.getElementById("anhPhim");
const preview = document.getElementById("previewPhim");
let base64Anh = "";

if (inputAnh) {
  inputAnh.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      base64Anh = e.target.result;
      if (file.type.startsWith("video/")) {
        preview.innerHTML = `<video controls src="${base64Anh}"></video>`;
      } else {
        preview.innerHTML = `<img src="${base64Anh}" alt="Preview">`;
      }
    };
    reader.readAsDataURL(file);
  });
}

// =============================
// 🔹 Thêm phim + lưu vào localStorage
// =============================
const form = document.getElementById("addPhimForm");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const ten = document.getElementById("tenPhim").value.trim();
    const moTa = document.getElementById("moTaPhim").value.trim();
    const gia = document.getElementById("giaVePhim").value.trim();
    const suat = document.getElementById("suatChieuPhim").value.trim();
    const rap = document.getElementById("rapPhim").value.trim();
    const fileInput = document.getElementById("anhPhim");

    if (!ten || !moTa || !gia) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const anh = reader.result || "";
      const phim = { ten, moTa, gia, suat, rap, anh };
      let dsPhim = JSON.parse(localStorage.getItem("danhSachPhim")) || [];
      dsPhim.push(phim);
      localStorage.setItem("danhSachPhim", JSON.stringify(dsPhim));

      hienThiPhim(phim, dsPhim.length - 1);
      e.target.reset(); // ✅ Xoá trắng input
      preview.innerHTML = ""; // ✅ Xoá ảnh xem trước
      alert("✅ Đã thêm phim thành công!");
    };

    if (fileInput.files[0]) {
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      const phim = { ten, moTa, gia, suat, rap, anh: "" };
      let dsPhim = JSON.parse(localStorage.getItem("danhSachPhim")) || [];
      dsPhim.push(phim);
      localStorage.setItem("danhSachPhim", JSON.stringify(dsPhim));
      hienThiPhim(phim, dsPhim.length - 1);
      e.target.reset();
      preview.innerHTML = "";
      alert("✅ Đã thêm phim thành công!");
    }
  });
}

// ===== HIỂN THỊ DANH SÁCH PHIM =====
document.addEventListener("DOMContentLoaded", () => {
  const dsPhim = JSON.parse(localStorage.getItem("danhSachPhim")) || [];
  dsPhim.forEach((phim, index) => hienThiPhim(phim, index));
});

function hienThiPhim(phim, index) {
  const list = document.getElementById("addedPhimList");
  if (!list) return;

  const placeholder = list.querySelector(".placeholder");
  if (placeholder) placeholder.remove();

  const item = document.createElement("div");
  item.classList.add("movie-card");
  item.innerHTML = `
    <button class="delete-btn" title="Xoá phim">×</button>
    <img src="${phim.anh || "images/default-poster.jpg"}" alt="${phim.ten}" class="movie-poster">
    <div class="movie-info">
      <h3 class="movie-title">${phim.ten}</h3>
      <p>🎬 ${phim.moTa}</p>
      <p>💸 ${phim.gia} VNĐ</p>
      <p>⏰ ${phim.suat || "Không có"}</p>
      <p>📍 ${phim.rap || "Không có"}</p>
    </div>
  `;

  // Xoá phim
  item.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc muốn xoá "${phim.ten}" không?`)) {
      let dsPhim = JSON.parse(localStorage.getItem("danhSachPhim")) || [];
      dsPhim.splice(index, 1);
      localStorage.setItem("danhSachPhim", JSON.stringify(dsPhim));
      item.remove();

      // Nếu xoá hết -> hiển thị placeholder
      if (dsPhim.length === 0) {
        list.innerHTML = `<p class="placeholder" style="font-style: italic; color: #888;">Chưa có dịch vụ nào được thêm.</p>`;
      }
    }
  });

  // Xem chi tiết popup
  item.addEventListener("click", () => showPopup(phim));

  list.appendChild(item);
}

// ===== POPUP XEM CHI TIẾT =====
function showPopup(phim) {
  const popup = document.getElementById("moviePopup");
  if (!popup) return;

  document.getElementById("popupImage").src = phim.anh || "images/default-poster.jpg";
  document.getElementById("popupTitle").textContent = phim.ten;
  document.getElementById("popupDesc").textContent = "🎬 " + phim.moTa;
  document.getElementById("popupGia").textContent = "💸 " + phim.gia + " VNĐ";
  document.getElementById("popupSuat").textContent = "⏰ " + (phim.suat || "Không có");
  document.getElementById("popupRap").textContent = "📍 " + (phim.rap || "Không có");

  popup.style.display = "flex";

  popup.querySelector(".close-btn").onclick = () => (popup.style.display = "none");
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  // === Các phần tử nút tab ===
  const tabButtons = document.querySelectorAll(".tab-btn");

  // === Các form & danh sách ===
  const sections = {
    phim: ["form-phim", "list-phim"],
    phuongtien: ["form-phuongtien", "list-phuongtien"],
    khachsan: ["form-khachsan", "list-khachsan"]
  };

  // === Xử lý chuyển tab ===
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Bỏ active ở tất cả
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Ẩn toàn bộ form/danh sách
      Object.values(sections).flat().forEach(id => {
        document.getElementById(id).classList.add("hidden");
      });

      // Hiện đúng loại dịch vụ
      const tab = btn.dataset.tab;
      sections[tab].forEach(id => {
        document.getElementById(id).classList.remove("hidden");
      });
    });
  });

  // ===================================================
  // ==================== PHIM ==========================
  // ===================================================
  const addPhimForm = document.getElementById("addPhimForm");
  const addedPhimList = document.getElementById("addedPhimList");

  addPhimForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tenPhim = document.getElementById("tenPhim").value;
    const moTaPhim = document.getElementById("moTaPhim").value;
    const giaVePhim = document.getElementById("giaVePhim").value;

    const div = document.createElement("div");
    div.classList.add("added-item");
    div.textContent = `${tenPhim} - ${giaVePhim} VNĐ`;
    addedPhimList.appendChild(div);

    addPhimForm.reset();
  });

  // ===================================================
  // ================== PHƯƠNG TIỆN ====================
  // ===================================================
  const addPhuongTienForm = document.getElementById("addPhuongTienForm");
  const addedPhuongTienList = document.getElementById("addedPhuongTienList");

  addPhuongTienForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const loai = document.getElementById("loaiPhuongTien").value;
    const diemDon = document.getElementById("diemDon").value;
    const diemDen = document.getElementById("diemDen").value;
    const gia = document.getElementById("giaVePhuongTien").value;

    const div = document.createElement("div");
    div.classList.add("added-item");
    div.textContent = `${loai} | ${diemDon} → ${diemDen} | ${gia} VNĐ`;
    addedPhuongTienList.appendChild(div);

    addPhuongTienForm.reset();
  });

  // ===================================================
  // ==================== KHÁCH SẠN ====================
  // ===================================================
  const addKhachSanForm = document.getElementById("addKhachSanForm");
  const addedKhachSanList = document.getElementById("addedKhachSanList");

  addKhachSanForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const ten = document.getElementById("tenKhachSan").value;
    const soPhong = document.getElementById("soPhong").value;
    const gia = document.getElementById("giaPhong").value;

    const div = document.createElement("div");
    div.classList.add("added-item");
    div.textContent = `${ten} - ${soPhong} phòng - ${gia} VNĐ/đêm`;
    addedKhachSanList.appendChild(div);

    addKhachSanForm.reset();
  });
});

// =============================
// 🔹 PHIM (ĐÃ CÓ SẴN, GIỮ NGUYÊN)
// =============================
// ... phần code phim của bạn ở trên ...

// ======================================================================
// 🔹 PHƯƠNG TIỆN
// ======================================================================

// === ẢNH XEM TRƯỚC ===
const inputAnhPT = document.getElementById("anhPhuongTien");
const previewPT = document.getElementById("previewPhuongTien");
let base64AnhPT = "";

if (inputAnhPT) {
  inputAnhPT.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      base64AnhPT = e.target.result;
      if (file.type.startsWith("video/")) {
        previewPT.innerHTML = `<video controls src="${base64AnhPT}"></video>`;
      } else {
        previewPT.innerHTML = `<img src="${base64AnhPT}" alt="Preview">`;
      }
    };
    reader.readAsDataURL(file);
  });
}

// === THÊM PHƯƠNG TIỆN ===
const formPT = document.getElementById("addPhuongTienForm");
if (formPT) {
  formPT.addEventListener("submit", function (e) {
    e.preventDefault();

    const loai = document.getElementById("loaiPhuongTien").value.trim();
    const diemDon = document.getElementById("diemDon").value.trim();
    const diemDen = document.getElementById("diemDen").value.trim();
    const gioKhoiHanh = document.getElementById("gioKhoiHanh").value;
    const gia = document.getElementById("giaVePhuongTien").value.trim();

    if (!loai || !diemDon || !diemDen || !gioKhoiHanh || !gia) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const phuongTien = {
      loai,
      diemDon,
      diemDen,
      gioKhoiHanh,
      gia,
      anh: base64AnhPT || ""
    };

    let dsPT = JSON.parse(localStorage.getItem("danhSachPhuongTien")) || [];
    dsPT.push(phuongTien);
    localStorage.setItem("danhSachPhuongTien", JSON.stringify(dsPT));

    hienThiPhuongTien(phuongTien, dsPT.length - 1);
    e.target.reset();
    previewPT.innerHTML = "";
    alert("✅ Đã thêm phương tiện thành công!");
  });
}

// === HIỂN THỊ DANH SÁCH ===
document.addEventListener("DOMContentLoaded", () => {
  const dsPT = JSON.parse(localStorage.getItem("danhSachPhuongTien")) || [];
  dsPT.forEach((pt, index) => hienThiPhuongTien(pt, index));
});

function hienThiPhuongTien(pt, index) {
  const list = document.getElementById("addedPhuongTienList");
  if (!list) return;

  const placeholder = list.querySelector(".placeholder");
  if (placeholder) placeholder.remove();

  const item = document.createElement("div");
  item.classList.add("vehicle-card");
  item.innerHTML = `
    <button class="delete-btn" title="Xoá phương tiện">×</button>
    <img src="${pt.anh || 'images/default-vehicle.jpg'}" alt="${pt.loai}" class="vehicle-img">
    <div class="vehicle-info">
      <h3>${pt.loai}</h3>
      <p>🚏 ${pt.diemDon} → ${pt.diemDen}</p>
      <p>🕒 ${pt.gioKhoiHanh}</p>
      <p>💸 ${pt.gia} VNĐ</p>
    </div>
  `;

  // Xoá phương tiện
  item.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(`Xoá phương tiện "${pt.loai}"?`)) {
      let dsPT = JSON.parse(localStorage.getItem("danhSachPhuongTien")) || [];
      dsPT.splice(index, 1);
      localStorage.setItem("danhSachPhuongTien", JSON.stringify(dsPT));
      item.remove();
    }
  });

  // Xem chi tiết popup
  item.addEventListener("click", () => showVehiclePopup(pt));

  list.appendChild(item);
}

// === POPUP PHƯƠNG TIỆN ===
function showVehiclePopup(pt) {
  const popup = document.getElementById("popupVehicleImage").closest(".popup");
  if (!popup) return;

  document.getElementById("popupVehicleImage").src = pt.anh || "images/default-vehicle.jpg";
  document.getElementById("popupVehicleLoai").textContent = pt.loai;
  document.getElementById("popupVehicleRoute").textContent = `🚏 ${pt.diemDon} → ${pt.diemDen}`;
  document.getElementById("popupVehicleGia").textContent = `💸 ${pt.gia} VNĐ`;

  popup.style.display = "flex";
  popup.querySelector(".close-btn").onclick = () => (popup.style.display = "none");
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}

// ======================================================================
// 🔹 KHÁCH SẠN
// ======================================================================

// === ẢNH XEM TRƯỚC ===
const inputAnhKS = document.getElementById("anhKhachSan");
const previewKS = document.getElementById("previewKhachSan");
let base64AnhKS = "";

if (inputAnhKS) {
  inputAnhKS.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      base64AnhKS = e.target.result;
      if (file.type.startsWith("video/")) {
        previewKS.innerHTML = `<video controls src="${base64AnhKS}"></video>`;
      } else {
        previewKS.innerHTML = `<img src="${base64AnhKS}" alt="Preview">`;
      }
    };
    reader.readAsDataURL(file);
  });
}

// === THÊM KHÁCH SẠN ===
const formKS = document.getElementById("addKhachSanForm");
if (formKS) {
  formKS.addEventListener("submit", function (e) {
    e.preventDefault();

    const ten = document.getElementById("tenKhachSan").value.trim();
    const moTa = document.getElementById("moTaKhachSan").value.trim();
    const soPhong = document.getElementById("soPhong").value.trim();
    const gia = document.getElementById("giaPhong").value.trim();

    if (!ten || !moTa || !soPhong || !gia) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const khachSan = {
      ten,
      moTa,
      soPhong,
      gia,
      anh: base64AnhKS || ""
    };

    let dsKS = JSON.parse(localStorage.getItem("danhSachKhachSan")) || [];
    dsKS.push(khachSan);
    localStorage.setItem("danhSachKhachSan", JSON.stringify(dsKS));

    hienThiKhachSan(khachSan, dsKS.length - 1);
    e.target.reset();
    previewKS.innerHTML = "";
    alert("✅ Đã thêm khách sạn thành công!");
  });
}

// === HIỂN THỊ DANH SÁCH ===
document.addEventListener("DOMContentLoaded", () => {
  const dsKS = JSON.parse(localStorage.getItem("danhSachKhachSan")) || [];
  dsKS.forEach((ks, index) => hienThiKhachSan(ks, index));
});

function hienThiKhachSan(ks, index) {
  const list = document.getElementById("addedKhachSanList");
  if (!list) return;

  const placeholder = list.querySelector(".placeholder");
  if (placeholder) placeholder.remove();

  const item = document.createElement("div");
  item.classList.add("hotel-card");
  item.innerHTML = `
    <button class="delete-btn" title="Xoá khách sạn">×</button>
    <img src="${ks.anh || 'images/default-hotel.jpg'}" alt="${ks.ten}" class="hotel-img">
    <div class="hotel-info">
      <h3>${ks.ten}</h3>
      <p>🛏️ ${ks.moTa}</p>
      <p>🏠 Số phòng: ${ks.soPhong}</p>
      <p>💸 ${ks.gia} VNĐ/đêm</p>
    </div>
  `;

  // Xoá khách sạn
  item.querySelector(".delete-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm(`Xoá khách sạn "${ks.ten}"?`)) {
      let dsKS = JSON.parse(localStorage.getItem("danhSachKhachSan")) || [];
      dsKS.splice(index, 1);
      localStorage.setItem("danhSachKhachSan", JSON.stringify(dsKS));
      item.remove();
    }
  });

  // Xem chi tiết popup
  item.addEventListener("click", () => showHotelPopup(ks));

  list.appendChild(item);
}

// === POPUP KHÁCH SẠN ===
function showHotelPopup(ks) {
  const popup = document.getElementById("popupHotelTen").closest(".popup");
  if (!popup) return;
  document.getElementById("popupHotelImage").src = ks.anh || "images/default-hotel.jpg";
  document.getElementById("popupHotelTen").textContent = ks.ten;
  document.getElementById("popupHotelMoTa").textContent = "🛏️ " + ks.moTa;
  document.getElementById("popupHotelSoPhong").textContent = "🏠 Số phòng: " + ks.soPhong;
  document.getElementById("popupHotelGia").textContent = "💸 " + ks.gia + " VNĐ/đêm";

  popup.style.display = "flex";
  popup.querySelector(".close-btn").onclick = () => (popup.style.display = "none");
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}
