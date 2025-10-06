// Dữ liệu mẫu
const soLieu = {
  ve: 120,
  dichvu: 15,
  khachhang: 350,
  doanhnghiep: 25,
  admin: 5,
};

// Gắn dữ liệu vào thẻ HTML
document.getElementById("ve").textContent = soLieu.ve;
document.getElementById("dichvu").textContent = soLieu.dichvu;
document.getElementById("khachhang").textContent = soLieu.khachhang;
document.getElementById("doanhnghiep").textContent = soLieu.doanhnghiep;
document.getElementById("admin").textContent = soLieu.admin;

// Biểu đồ Chart.js
const ctx = document.getElementById("ticketChart").getContext("2d");
const ticketChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
    datasets: [
      {
        label: "Vé đã bán",
        data: [50, 75, 120, 90, 150],
        borderColor: "#000",
        backgroundColor: "#000",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  },
});
