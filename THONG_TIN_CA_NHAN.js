// Hàm xử lý khi submit form
function handleSubmit(event) {
  event.preventDefault(); // chặn load lại trang
  alert("Thông tin đã được gửi thành công!");
}

// Hàm xử lý khi reset form
function handleReset() {
  alert("Form đã được xóa hết!");
}

// Hàm đổi màu nền ngẫu nhiên
function changeBackground() {
  const colors = ["#f1c40f", "#2ecc71", "#3498db", "#e67e22", "#9b59b6"];
  const random = Math.floor(Math.random() * colors.length);
  document.body.style.backgroundColor = colors[random];
}
