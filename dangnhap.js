// Hàm hiển thị thông báo đẹp
function showNotification(message, type = "success") {
  const container = document.getElementById("notification");
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");
  const loginContent = document.getElementById("login-content");
  const registerContent = document.getElementById("register-content");

  // Chuyển tab
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginContent.classList.add("active");
    registerContent.classList.remove("active");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerContent.classList.add("active");
    loginContent.classList.remove("active");
  });

  // Đăng ký
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const pass = document.getElementById("regPassword").value;
      const repass = document.getElementById("regRePassword").value;

      if (pass !== repass) {
        showNotification("Mật khẩu nhập lại không khớp!", "error");
        return;
      }

      const user = { name, email, pass };
      localStorage.setItem("user_" + email, JSON.stringify(user));
      showNotification("Đăng ký thành công! Hãy đăng nhập.", "success");

      // chuyển sang tab đăng nhập
      loginTab.click();
    });

  // Đăng nhập
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;

    const userData = localStorage.getItem("user_" + email);
    if (!userData) {
      showNotification("Email chưa được đăng ký!", "error");
      return;
    }

    const user = JSON.parse(userData);

    if (user.pass !== pass) {
      showNotification("Mật khẩu không đúng!", "error");
      return;
    }

    localStorage.setItem("username", user.name);
    showNotification("Đăng nhập thành công!", "success");

    setTimeout(() => {
      window.location.href = "trangchu.html";
    }, 1000);
  });
});
