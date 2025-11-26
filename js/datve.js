document.addEventListener("DOMContentLoaded", () => {
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

  routeDetailsElement.innerHTML = `
        <p><strong>Nơi Đi:</strong> ${route.from}</p>
        <p><strong>Nơi Đến:</strong> ${route.to}</p>
        <p><strong>Ngày Đi:</strong> ${route.date}</p>
        <p><strong>Tổng Tiền:</strong> <span style="color: #d9534f; font-weight: bold;">${route.price}</span></p>
    `;

  customerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const customerInfo = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
    };

    const username = localStorage.getItem("username");
    if (!username) {
      showToast("Vui lòng đăng nhập", "error");
      return;
    }

    const finalBooking = {
      route: route,
      customer: customerInfo,
      bookingTime: new Date().toLocaleString("vi-VN"),
    };

    const bookedTickets = JSON.parse(
      localStorage.getItem(`bookedTickets_${username}`) || "[]"
    );
    bookedTickets.push(finalBooking);
    localStorage.setItem(
      `bookedTickets_${username}`,
      JSON.stringify(bookedTickets)
    );

    localStorage.removeItem("selectedRoute");
    showToast("Đặt vé thành công", "success");
    setTimeout(() => {
      window.location.href = "customer.html";
    }, 1200);
  });

  const stepButtons = document.querySelectorAll(".steps .step-btn");
  if (stepButtons.length === 2) {
    stepButtons[0].addEventListener("click", () => {
      window.location.href = "customer.html";
    });
    stepButtons[1].addEventListener("click", () => {
      window.location.href = "datve.html";
    });
  }

  const select = document.getElementById("paymentSelect");
  const result = document.getElementById("result");
  const qrPopup = document.getElementById("qrPopup");

  select.addEventListener("change", () => {
    const value = select.value;

    if (value === "cash") {
      result.textContent = "Tiền mặt";
      qrPopup.style.display = "none";
    }

    if (value === "bank") {
      result.textContent = "Chuyển khoản";
      qrPopup.style.display = "block";
    }
  });
});

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
