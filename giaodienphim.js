const seatsContainer = document.getElementById('seats');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
const bookBtn = document.getElementById('bookBtn');

let ticketPrice = +movieSelect.value;

// tạo ghế (8 cột x 5 hàng)
function createSeats() {
    for (let i = 0; i < 40; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        // ngẫu nhiên ghế đã đặt
        if (Math.random() < 0.2) seat.classList.add('occupied');
        seatsContainer.appendChild(seat);
    }
}
createSeats();

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedCount = selectedSeats.length;
    count.textContent = selectedCount;
    total.textContent = selectedCount * ticketPrice;
}

seatsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    updateSelectedCount();
});

bookBtn.addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    if (selectedSeats.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế!');
        return;
    }
    alert(`Đặt vé thành công!\nSố ghế: ${selectedSeats.length}\nTổng tiền: ${selectedSeats.length * ticketPrice}đ`);
});
