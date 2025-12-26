/* ===================================
   JavaScript - Bách Hoá Green
   =================================== */

// Quản lý giỏ hàng
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveToStorage();
        this.updateCartButton();
        this.showNotification(`${product.name} đã được thêm vào giỏ hàng!`);
        // Auto reload cart modal nếu đang mở
        if (document.querySelector('.cart-modal-overlay')) {
            setTimeout(() => showCartModal(), 300);
        }
    }

    removeItem(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.saveToStorage();
        this.updateCartButton();
    }

    updateQuantity(productName, quantity) {
        const item = this.items.find(item => item.name === productName);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productName);
            } else {
                this.saveToStorage();
            }
        }
        this.updateCartButton();
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => {
            const priceStr = item.price.toString().replace(/\D/g, '');
            return total + (parseInt(priceStr) * item.quantity);
        }, 0);
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }

    updateCartButton() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.textContent = `🛒 Giỏ Hàng (${this.items.length})`;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Khởi tạo giỏ hàng
const cart = new ShoppingCart();

// Các sản phẩm
const products = [
    {
        name: 'Rau Sạch Organik',
        price: '45.000 đ'
    },
    {
        name: 'Trái Cây Tươi',
        price: '65.000 đ'
    },
    {
        name: 'Thực Phẩm Hạt',
        price: '55.000 đ'
    },
    {
        name: 'Nước Hoa Quả Tự Nhiên',
        price: '35.000 đ'
    },
    {
        name: 'Hạt Giống Sạch',
        price: '25.000 đ'
    },
    {
        name: 'Sản Phẩm Chăm Sóc',
        price: '85.000 đ'
    }
];

// Hàm để ẩn/hiện các section
function toggleSectionVisibility(targetId) {
    const sections = document.querySelectorAll('section[id], .products, .about, .services, .contact');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Xử lý nút "Thêm Vào Giỏ"
document.addEventListener('DOMContentLoaded', function() {
    // Cập nhật số lượng giỏ hàng
    cart.updateCartButton();

    // Xử lý click trên menu navigation để ẩn/hiện section
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Nếu là link internal (# anchor)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                // Nếu click vào "Trang Chủ", hiển thị tất cả
                if (sectionId === 'home' || href === 'Giao diện.html') {
                    document.querySelectorAll('section, .products, .about, .services, .contact').forEach(el => {
                        el.style.display = 'block';
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // Hiển thị chỉ section được chọn
                    toggleSectionVisibility(sectionId);
                }
            }
        });
    });

    // Thêm sự kiện cho các nút "Thêm Vào Giỏ"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('.product-image img')?.src || '';
            
            cart.addItem({
                name: productName,
                price: productPrice,
                image: productImage
            });
        });
    });

    // Chuyển hướng khi click vào product-link có `data-id`
    const productLinks = document.querySelectorAll('.product-link');
    productLinks.forEach(link => {
        const pid = link.dataset.id;
        if (pid) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = `Hiển thị sản phẩm.html?id=${encodeURIComponent(pid)}`;
            });
        }
    });

    // Hiển thị modal nhanh khi click vào tên sản phẩm (h3) trong card
    function showQuickProductModal({name, price, image, short, href}) {
        // Remove existing quick modal
        const existing = document.getElementById('quickProductOverlay');
        if (existing) existing.remove();

        const html = `
            <div class="cart-modal-overlay" id="quickProductOverlay">
                <div class="cart-modal" style="max-width:520px;">
                    <div class="cart-modal-header">
                        <h2>${name}</h2>
                        <button class="close-modal" id="closeQuick">✕</button>
                    </div>
                    <div class="cart-modal-body" style="display:flex;gap:1rem;align-items:flex-start;">
                        <div style="width:160px;flex:0 0 160px;border-radius:8px;overflow:hidden;background:#fff;">
                            ${image ? `<img src="${image}" alt="${name}" style="width:100%;height:100%;object-fit:cover;">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#777">No Image</div>'}
                        </div>
                        <div style="flex:1">
                            <p style="margin:0 0 .5rem;color:#2c3e50;font-weight:600">${price}</p>
                            <p style="margin:0;color:#444">${short || ''}</p>
                        </div>
                    </div>
                    <div class="cart-modal-footer" style="display:flex;gap:1rem;justify-content:flex-end;">
                        <button class="btn-continue" id="quickClose">Đóng</button>
                        <button class="btn-checkout" id="viewDetail">Xem Chi Tiết</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        const overlay = document.getElementById('quickProductOverlay');
        document.getElementById('closeQuick').addEventListener('click', () => overlay.remove());
        document.getElementById('quickClose').addEventListener('click', () => overlay.remove());
        document.getElementById('viewDetail').addEventListener('click', () => {
            overlay.remove();
            if (href) window.location.href = href;
        });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    }

    // Attach listener on the product name (h3) inside product-card
    const productTitles = document.querySelectorAll('.product-card h3');
    productTitles.forEach(title => {
        title.style.cursor = 'pointer';
        title.addEventListener('click', function(e) {
            e.preventDefault();
            // find closest product-link to get data attributes
            const link = title.closest('.product-card')?.querySelector('.product-link');
            if (!link) return;
            const name = link.dataset.name || title.textContent.trim();
            const price = link.dataset.price || (link.querySelector('.price')?.textContent || '');
            const image = link.dataset.image || link.querySelector('img')?.src || '';
            const short = link.dataset.short || '';
            const href = link.getAttribute('href');
            showQuickProductModal({name, price, image, short, href});
        });
    });

    // Xử lý nút "Khám Phá Ngay"
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            const productsSection = document.querySelector('#products');
            productsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Xử lý form liên hệ
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = contactForm.children[0].value;
            cart.showNotification(`Cảm ơn ${name}! Chúng tôi sẽ liên hệ với bạn sớm.`);
            contactForm.reset();
        });
    }

    // Xử lý form đăng ký nhận tin
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletter.querySelector('input').value;
            cart.showNotification(`Cảm ơn! Bạn đã đăng ký nhận tin tức từ Bách Hoá Green.`);
            newsletter.reset();
        });
    }

    // Xử lý thanh tìm kiếm
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                cart.showNotification(`Tìm kiếm: ${searchBox.value}`);
                searchBox.value = '';
            }
        });
    }

    // Xử lý nút giỏ hàng
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            showCartModal();
        });
    }

    // Mobile hamburger toggle for nav
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            mainNav.classList.toggle('show');
            // toggle aria-expanded
            const expanded = mainNav.classList.contains('show');
            hamburger.setAttribute('aria-expanded', expanded);
        });
    }
});

// Thêm hiệu ứng scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    }
});

// Thêm animation cho các phần tử khi scroll vào view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Quan sát các card
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.product-card, .service-card, .stat-box');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});

// Hàm hiển thị modal giỏ hàng
function showCartModal() {
    if (cart.items.length === 0) {
        const existingModal = document.querySelector('.cart-modal-overlay');
        if (existingModal) existingModal.remove();
        cart.showNotification('Giỏ hàng của bạn trống!');
        return;
    }

    // Tạo HTML cho modal
    let cartItemsHTML = '';
    cart.items.forEach((item, index) => {
        const priceValue = parseInt(item.price.replace(/\D/g, ''));
        const itemTotal = priceValue * item.quantity;
        const imgHTML = item.image ? `<img src="${item.image}" alt="${item.name}">` : '<div class="no-image">Không có hình</div>';
        cartItemsHTML += `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${imgHTML}
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-index="${index}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
                <div class="cart-item-total">
                    <p>${itemTotal.toLocaleString('vi-VN')} đ</p>
                    <button class="remove-btn" data-index="${index}">Xóa</button>
                </div>
            </div>
        `;
    });

    const totalPrice = cart.getTotalPrice().toLocaleString('vi-VN');
    
    const modalHTML = `
        <div class="cart-modal-overlay" id="cartOverlay">
            <div class="cart-modal">
                <div class="cart-modal-header">
                    <h2>🛒 Giỏ Hàng Của Bạn</h2>
                    <button class="close-modal" id="closeModal">✕</button>
                </div>
                <div class="cart-modal-body">
                    <div class="cart-items-list">
                        ${cartItemsHTML}
                    </div>
                </div>
                <div class="cart-modal-footer">
                    <div class="cart-summary">
                        <p class="cart-count">Tổng số sản phẩm: <strong>${cart.items.length}</strong></p>
                        <p class="cart-total">Tổng tiền: <strong>${totalPrice} đ</strong></p>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-continue" id="continueShopping">Tiếp Tục Mua Sắm</button>
                        <button class="btn-checkout">Thanh Toán</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Xóa modal cũ nếu có
    const existingModal = document.querySelector('.cart-modal-overlay');
    if (existingModal) existingModal.remove();

    // Thêm modal vào trang
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Xử lý các sự kiện
    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('closeModal');
    const continueBtn = document.getElementById('continueShopping');

    closeBtn.addEventListener('click', () => overlay.remove());
    continueBtn.addEventListener('click', function() {
        // close modal and go to products listing
        overlay.remove();
        // if already on products page, scroll to top of products section
        if (window.location.pathname.endsWith('products.html')) {
            const grid = document.querySelector('.products-grid');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'products.html';
        }
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // Xử lý nút tăng/giảm số lượng
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            const item = cart.items[index];
            item.quantity += 1;
            cart.saveToStorage();
            showCartModal();
        });
    });

    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            const item = cart.items[index];
            if (item.quantity > 1) {
                item.quantity -= 1;
                cart.saveToStorage();
                showCartModal();
            }
        });
    });

    // Xử lý nút xóa
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            const itemName = cart.items[index].name;
            cart.removeItem(itemName);
            // Nếu sau khi xóa giỏ hàng trống -> ẩn modal và thông báo
            if (cart.items.length === 0) {
                const overlayEl = document.querySelector('.cart-modal-overlay');
                if (overlayEl) overlayEl.remove();
                cart.showNotification('Giỏ hàng của bạn trống!');
                cart.updateCartButton();
            } else {
                cart.showNotification(`${itemName} đã được xóa khỏi giỏ hàng`);
                showCartModal();
            }
        });
    });

    // Xử lý nút thanh toán
    const checkoutBtn = document.querySelector('.btn-checkout');
    checkoutBtn.addEventListener('click', function() {
        cart.showNotification('Cảm ơn bạn! Bạn sẽ được chuyển đến trang thanh toán.');
        setTimeout(() => {
            overlay.remove();
        }, 1500);
    });
}

// Thêm CSS cho notification
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    /* CSS cho Cart Modal */
    .cart-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .cart-modal {
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .cart-modal-header {
        padding: 1.5rem;
        border-bottom: 2px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cart-modal-header h2 {
        margin: 0;
        color: #2ecc71;
        font-size: 1.5rem;
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #7f8c8d;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        color: #e74c3c;
        transform: scale(1.2);
    }

    .cart-modal-body {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
    }

    .cart-items-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr auto auto;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
        align-items: center;
        border-left: 4px solid #2ecc71;
    }

    .cart-item-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        background: white;
    }

    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cart-item-image .no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #ecf0f1;
        color: #7f8c8d;
        font-size: 0.8rem;
        text-align: center;
    }

    .cart-item-info h4 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    .cart-item-price {
        margin: 0;
        color: #2ecc71;
        font-weight: 600;
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        border-radius: 8px;
        padding: 0.5rem;
    }

    .qty-btn {
        background: #2ecc71;
        color: white;
        border: none;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .qty-btn:hover {
        background: #27ae60;
        transform: scale(1.1);
    }

    .qty-value {
        min-width: 30px;
        text-align: center;
        font-weight: 600;
        color: #2c3e50;
    }

    .cart-item-total {
        text-align: right;
    }

    .cart-item-total p {
        margin: 0 0 0.5rem 0;
        font-weight: 700;
        color: #2c3e50;
        font-size: 1.1rem;
    }

    .remove-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .remove-btn:hover {
        background: #c0392b;
        transform: scale(1.05);
    }

    .cart-modal-footer {
        padding: 1.5rem;
        border-top: 2px solid #ecf0f1;
        background: #f8f9fa;
    }

    .cart-summary {
        margin-bottom: 1.5rem;
    }

    .cart-summary p {
        margin: 0.5rem 0;
        color: #2c3e50;
        font-size: 1.05rem;
    }

    .cart-summary strong {
        color: #2ecc71;
    }

    .cart-total {
        font-size: 1.3rem !important;
        color: #2ecc71 !important;
    }

    .cart-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .btn-continue,
    .btn-checkout {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }

    .btn-continue {
        background: #95a5a6;
        color: white;
    }

    .btn-continue:hover {
        background: #7f8c8d;
        transform: translateY(-2px);
    }

    .btn-checkout {
        background: #2ecc71;
        color: white;
    }

    .btn-checkout:hover {
        background: #27ae60;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
    }

    @media (max-width: 480px) {
        .notification {
            left: 20px;
            right: 20px;
            transform: translateX(500px);
        }

        .notification.show {
            transform: translateX(0);
        }

        .cart-modal {
            width: 95%;
        }

        .cart-item {
            grid-template-columns: 70px 1fr;
            gap: 0.5rem;
        }

        .cart-item-image {
            width: 70px;
            height: 70px;
        }

        .cart-item-quantity {
            justify-content: center;
            grid-column: 1 / -1;
        }

        .cart-item-total {
            text-align: left;
            grid-column: 1 / -1;
        }

        .cart-actions {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

console.log('Bách Hoá Green - Trang web đã tải thành công!');
