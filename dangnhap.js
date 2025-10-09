// Chuyển tab đăng nhập / đăng ký
document.getElementById("login-tab").addEventListener("click", () => {
  document.getElementById("login-tab").classList.add("active");
  document.getElementById("register-tab").classList.remove("active");
  document.getElementById("login-content").classList.add("active");
  document.getElementById("register-content").classList.remove("active");
});

document.getElementById("register-tab").addEventListener("click", () => {
  document.getElementById("register-tab").classList.add("active");
  document.getElementById("login-tab").classList.remove("active");
  document.getElementById("register-content").classList.add("active");
  document.getElementById("login-content").classList.remove("active");
});

// Lưu tài khoản vào localStorage
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPassword").value;
  const repass = document.getElementById("regRePassword").value;
  const role = document.getElementById("regRole").value;

  if (pass !== repass) {
    alert("❌ Mật khẩu nhập lại không khớp!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((u) => u.email === email)) {
    alert("⚠️ Email đã được đăng ký!");
    return;
  }

  users.push({ name, email, pass, role });
  localStorage.setItem("users", JSON.stringify(users));

  alert("✅ Đăng ký thành công! Hãy đăng nhập.");
  document.getElementById("login-tab").click();
  e.target.reset();
});

// Xử lý đăng nhập
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.pass === pass);

  if (!user) {
    alert("❌ Email hoặc mật khẩu không đúng!");
    return;
  }

  // Lưu thông tin người dùng đăng nhập
  localStorage.setItem("loggedUser", JSON.stringify(user));

  // Điều hướng theo loại tài khoản
  if (user.role === "business") {
    window.location.href = "phim-doanhnghiep.html";
  } else {
    window.location.href = "phim.html";
  }
});
