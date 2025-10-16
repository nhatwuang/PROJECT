// Chuyển tab
const menuItems = document.querySelectorAll("aside li");
const sections = document.querySelectorAll("main section");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const target = item.dataset.section;
    sections.forEach((sec) => {
      sec.classList.remove("active");
      if (sec.id === target) sec.classList.add("active");
    });
  });
});

// Quản lý phim
const movieForm = document.getElementById("movie-form");
const movieList = document.getElementById("movie-list");

movieForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("movie-name").value;
  const genre = document.getElementById("genre").value;
  const duration = document.getElementById("duration").value;
  const poster = document.getElementById("poster").value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td><img src="${poster}" alt="${name}"></td>
    <td>${name}</td>
    <td>${genre}</td>
    <td>${duration} phút</td>
    <td><button class="delete">Xóa</button></td>
  `;
  movieList.appendChild(row);
  movieForm.reset();

  // Xóa phim
  row.querySelector(".delete").addEventListener("click", () => {
    row.remove();
  });
});

// Đăng xuất
document.getElementById("logout-btn").addEventListener("click", () => {
  alert("Đã đăng xuất khỏi tài khoản doanh nghiệp!");
});
 const authBtns = document.querySelector(".auth-btns");
  const username = localStorage.getItem("username");

  if (username) {
    // Nếu đã đăng nhập
    authBtns.innerHTML = `
      <span class="welcome">Xin chào, <b>${username}</b></span>
      <button class="logout-btn">Đăng xuất</button>
    `;

    document
      .querySelector(".logout-btn")
      .addEventListener("click", function () {
        localStorage.removeItem("username");
        location.reload();
      });
  } else {
    // Nếu chưa đăng nhập
    authBtns.innerHTML = `
      <button class="login-btn">Đăng nhập</button>
      <button class="signup-btn">Đăng ký</button>
    `;

    document.querySelector(".login-btn").addEventListener("click", function () {
      window.location.href = "dangnhap.html";
    });

    document
      .querySelector(".signup-btn")
      .addEventListener("click", function () {
        window.location.href = "dangnhap.html";
      });
  }
;