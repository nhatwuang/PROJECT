// Lưu tài khoản khi đăng ký
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let rePassword = document.getElementById("regRePassword").value;
    let role = document.getElementById("regRole").value;

    if (password !== rePassword) {
      showToast("Mật khẩu nhập lại không khớp!", "error");
      return;
    }

    // Tạo đối tượng user
    let user = { name, email, password, role };

    // Lấy danh sách user cũ từ localStorage (nếu có)
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra trùng email
    if (users.some((u) => u.email === email)) {
      showToast("Email đã tồn tại!", "error");
      return;
    }

    // Thêm user mới
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Đăng ký thành công!", "success");
    document.getElementById("registerForm").reset();
  });

// Xử lý đăng nhập
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

  // Lưu thông tin user hiện tại
  localStorage.setItem("currentUser", JSON.stringify(user));
  showToast("Đăng nhập thành công!", "success");

  // Điều hướng theo role
  setTimeout(() => {
    if (user.role === "customer") {
      window.location.href = "trangchu.html";
    } else if (user.role === "business") {
      window.location.href = "trangchu-doanhnghiep.html";
    } else if (user.role === "admin") {
      window.location.href = "admin.html";
    }
  }, 1000);
});

// ----- Toast thông báo -----
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

// ----- Chuyển tab login/register -----
document.getElementById("login-tab").addEventListener("click", function () {
  document.getElementById("login-tab").classList.add("active");
  document.getElementById("register-tab").classList.remove("active");

  document.getElementById("login-content").classList.add("active");
  document.getElementById("register-content").classList.remove("active");
});

document.getElementById("register-tab").addEventListener("click", function () {
  document.getElementById("register-tab").classList.add("active");
  document.getElementById("login-tab").classList.remove("active");

  document.getElementById("register-content").classList.add("active");
  document.getElementById("login-content").classList.remove("active");
});
