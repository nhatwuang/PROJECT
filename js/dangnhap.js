// ===============================
// 📌 XỬ LÝ ĐĂNG KÝ NGƯỜI DÙNG
// ===============================
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // ❌ Ngăn trang web load lại khi bấm nút "Đăng ký"

    // 🔹 Lấy dữ liệu từ các ô nhập
    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let rePassword = document.getElementById("regRePassword").value;
    let role = document.getElementById("regRole").value; // Vai trò: customer, business, admin

    // 🔹 Kiểm tra xác nhận mật khẩu
    if (password !== rePassword) {
      showToast("Mật khẩu nhập lại không khớp!", "error");
      return;
    }

    // 🔹 Lấy danh sách user cũ
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔹 Kiểm tra xem email đã tồn tại chưa
    if (users.some((u) => u.email === email)) {
      showToast("Email đã tồn tại!", "error");
      return;
    }

    // 🔹 Tạo user mới và lưu lại
    let user = { name, email, password, role };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    // ✅ Lưu thông tin đăng nhập ngay sau khi đăng ký
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("username", name); // dùng để hiển thị trong header

    // ✅ Thông báo
    showToast("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.", "success");

    // 🔹 Chuyển hướng sang trang phù hợp
    setTimeout(() => {
      window.location.href = "dangnhap.html";
    }, 1000);
  });

// ===============================
// 📌 XỬ LÝ ĐĂNG NHẬP NGƯỜI DÙNG
// ===============================
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    showToast("Sai email hoặc mật khẩu!", "error");
    return;
  }

  // ✅ Lưu người dùng hiện tại
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("username", user.name);

  showToast("Đăng nhập thành công!", "success");

  setTimeout(() => {
    if (user.role === "customer") {
      window.location.href = "customer.html";
    } else if (user.role === "business") {
      window.location.href = "business.html";
    } else {
      window.location.href = "admin.html";
    }
  }, 1000);
});

// ===============================
// 📌 HÀM HIỂN THỊ THÔNG BÁO
// ===============================
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

// ===============================
// 📌 CHUYỂN GIỮA TAB ĐĂNG NHẬP / ĐĂNG KÝ
// ===============================
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginContent = document.getElementById("login-content");
const registerContent = document.getElementById("register-content");

const showRegisterBtn = document.querySelector("#login-content #show-register");
const showLoginBtn = document.querySelector("#register-content .register-btn");

function showRegisterForm() {
  loginContent.classList.remove("active");
  loginContent.style.display = "none";
  registerContent.classList.add("active");
  registerContent.style.display = "block";
  loginTab.classList.remove("active");
  registerTab.classList.add("active");
}

function showLoginForm() {
  registerContent.classList.remove("active");
  registerContent.style.display = "none";
  loginContent.classList.add("active");
  loginContent.style.display = "block";
  registerTab.classList.remove("active");
  loginTab.classList.add("active");
}

showRegisterBtn.addEventListener("click", showRegisterForm);
showLoginBtn.addEventListener("click", showLoginForm);
loginTab.addEventListener("click", showLoginForm);
registerTab.addEventListener("click", showRegisterForm);
registerContent.style.display = "none";
