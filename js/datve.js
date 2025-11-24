document.addEventListener("DOMContentLoaded", () => {
  // 1. Lấy thông tin chuyến đi từ localStorage
  const selectedRouteString = localStorage.getItem("selectedRoute");
  const routeDetailsElement = document.getElementById("route-details");
  const customerForm = document.getElementById("customer-form");

  if (!selectedRouteString) {
    routeDetailsElement.innerHTML =
      '<p style="color: red;">Không tìm thấy thông tin chuyến đi. Vui lòng quay lại trang tìm kiếm.</p>';
    customerForm.style.display = "none";
    return;
  }

  const route = JSON.parse(selectedRouteString);

  // 2. Hiển thị thông tin chuyến đi
  routeDetailsElement.innerHTML = `
        <p><strong>Nơi Đi:</strong> ${route.from}</p>
        <p><strong>Nơi Đến:</strong> ${route.to}</p>
        <p><strong>Ngày Đi:</strong> ${route.date}</p>
        <p><strong>Tổng Tiền:</strong> <span style="color: #d9534f; font-weight: bold;">${route.price}</span></p>
    `;

  // 3. Xử lý sự kiện khi gửi form đặt vé
  customerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customerInfo = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    };

    const finalBooking = {
      route: route,
      customer: customerInfo,
      bookingTime: new Date().toLocaleString("vi-VN"),
    };

    // *LƯU Ý:* Đây là nơi bạn có thể gửi dữ liệu lên máy chủ (Server).
    // Tạm thời, chúng ta sẽ lưu nó vào localStorage và hiển thị thông báo.

    // Lấy danh sách các vé đã đặt (nếu có)
    const bookedTickets = JSON.parse(
      localStorage.getItem("bookedTickets") || "[]"
    );
    bookedTickets.push(finalBooking);
    localStorage.setItem("bookedTickets", JSON.stringify(bookedTickets));

    // Xóa chuyến đi đã chọn khỏi localStorage sau khi đặt xong
    localStorage.removeItem("selectedRoute");

    alert(
      `Đặt vé thành công!\n\nChi tiết:\n- Tên: ${finalBooking.customer.name}\n- Tuyến: ${finalBooking.route.from} -> ${finalBooking.route.to}\n- Giá: ${finalBooking.route.price}\n\nCảm ơn bạn!`
    );

    // Tùy chọn: Chuyển hướng người dùng về trang chủ hoặc trang xác nhận
    window.location.href = "customer.html";
  });
});
