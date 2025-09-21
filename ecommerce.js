// KKR Store functionality for KKR Studios
const ECOMMERCE_STORAGE_KEY = 'app_ecommerce_cart';

// Sample products data
const products = [
    {
        id: 'prod-1',
        title: 'Premium Event Decorations',
        description: 'Beautiful decorations for birthdays, weddings, and special occasions',
        price: 3999,
        category: 'decorations',
        image: 'home2.jpeg',
        stock: 10
    },
    {
        id: 'prod-2',
        title: 'Professional Photography Package',
        description: 'Complete photography service with editing and digital delivery',
        price: 3999,
        category: 'photography',
        image: 'home1.jpeg',
        stock: 5
    },
    {
        id: 'prod-3',
        title: 'Venue Rental Package',
        description: 'Complete venue setup with lighting and seating',
        price: 6499,
        category: 'venue',
        image: 'home3.jpeg',
        stock: 2
    },
    {
        id: 'prod-4',
        title: 'Birthday Party Package',
        description: 'Complete birthday celebration setup',
        price: 4999,
        category: 'decorations',
        image: 'home4.jpeg',
        stock: 15
    },
    {
        id: 'prod-5',
        title: 'Wedding Photography',
        description: 'Professional wedding photography with album',
        price: 12000,
        category: 'photography',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop',
        stock: 4
    },
    {
        id: 'prod-6',
        title: 'Corporate Event Setup',
        description: 'Professional setup for business events',
        price: 6000,
        category: 'venue',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop',
        stock: 6
    }
];

let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = [...products];

// Cart functions
function readCart() {
    try {
        const raw = localStorage.getItem(ECOMMERCE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function writeCart(cart) {
    localStorage.setItem(ECOMMERCE_STORAGE_KEY, JSON.stringify(cart));
}

function cartToCount(cart) {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
}

function cartToTotal(cart) {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function addToCart(product) {
    // Redirect to booking page instead of adding to cart
    redirectToBooking(product);
}

function redirectToBooking(product) {
    // Create URL parameters for the booking page
    const params = new URLSearchParams({
        serviceId: product.id,
        title: encodeURIComponent(product.title),
        price: product.price,
        description: encodeURIComponent(product.description),
        image: encodeURIComponent(product.image)
    });
    
    // Redirect to booking page
    window.location.href = `ecommercebooking.html?${params.toString()}`;
}

function removeFromCart(productId) {
    const cart = readCart();
    delete cart[productId];
    writeCart(cart);
    renderCart(cart);
    updateCartCount();
}

function updateCartQuantity(productId, delta) {
    const cart = readCart();
    if (!cart[productId]) return;
    cart[productId].quantity += delta;
    if (cart[productId].quantity <= 0) {
        delete cart[productId];
    }
    writeCart(cart);
    renderCart(cart);
    updateCartCount();
}

function renderCart(cart) {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (!cartItemsEl || !cartTotalEl) return;
    
    cartItemsEl.innerHTML = '';
    Object.values(cart).forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div>
                <div class="name">${item.title}</div>
                <div class="qty">
                    <button data-id="${item.id}" data-action="dec" class="btn">-</button>
                    <span>${item.quantity}</span>
                    <button data-id="${item.id}" data-action="inc" class="btn">+</button>
                    <button data-id="${item.id}" data-action="remove" class="btn" style="margin-left:8px;">Remove</button>
                </div>
            </div>
            <div class="subtotal">₹${(item.quantity * item.price).toFixed(2)}</div>
        `;
        cartItemsEl.appendChild(row);
    });
    
    const total = cartToTotal(cart);
    cartTotalEl.textContent = `₹${total.toFixed(2)}`;
}

function updateCartCount() {
    const cart = readCart();
    const cartCountEl = document.getElementById('cartCount');
    const cartCountHeaderEl = document.getElementById('cartCountHeader');
    const cartCountTopEl = document.getElementById('cartCountTop');
    const count = cartToCount(cart);
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartCountHeaderEl) cartCountHeaderEl.textContent = count;
    if (cartCountTopEl) cartCountTopEl.textContent = count;
}

// Product rendering functions
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    productsGrid.innerHTML = '';
    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image" data-product-id="${product.id}">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn add-to-cart" data-id="${product.id}">Book Now</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
    
    updatePagination();
}

function updatePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (!prevBtn || !nextBtn || !pageInfo) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Filter and search functions
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (!categoryFilter || !priceFilter) return;
    
    let filtered = [...products];
    
    // Category filter
    if (categoryFilter.value) {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }
    
    // Price filter
    if (priceFilter.value) {
        const [min, max] = priceFilter.value.split('-');
        if (max === '+') {
            filtered = filtered.filter(product => product.price >= parseInt(min));
        } else {
            filtered = filtered.filter(product => 
                product.price >= parseInt(min) && product.price <= parseInt(max)
            );
        }
    }
    
    // Search filter
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredProducts = filtered;
    currentPage = 1;
    renderProducts();
}

function searchProducts() {
    filterProducts();
}

// Image modal functions
function showImageModal(product) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalImageTitle');
    const modalDescription = document.getElementById('modalImageDescription');
    const modalPrice = document.getElementById('modalImagePrice');
    
    if (modal && modalImage && modalTitle && modalDescription && modalPrice) {
        modalImage.src = product.image;
        modalImage.alt = product.title;
        modalTitle.textContent = product.title;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `₹${product.price.toFixed(2)}`;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function hideImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Event listeners
function setupEventListeners() {
    // Product grid click handler
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.addEventListener('click', function(e) {
            const btn = e.target.closest('.add-to-cart');
            const img = e.target.closest('.product-image');
            
            if (btn) {
                const productId = btn.getAttribute('data-id');
                const product = products.find(p => p.id === productId);
                if (product) {
                    redirectToBooking(product);
                }
            } else if (img) {
                const productId = img.getAttribute('data-product-id');
                const product = products.find(p => p.id === productId);
                if (product) {
                    showImageModal(product);
                }
            }
        });
    }
    
    // Image modal close handlers
    const closeImageModal = document.getElementById('closeImageModal');
    const imageModal = document.getElementById('imageModal');
    
    if (closeImageModal) {
        closeImageModal.addEventListener('click', hideImageModal);
    }
    
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal || e.target.classList.contains('image-modal-overlay')) {
                hideImageModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideImageModal();
        }
    });
    
    // Cart drawer handlers
    const cartBtn = document.getElementById('cartBtn');
    const cartBtnHeader = document.getElementById('cartBtnHeader');
    const cartBtnTop = document.getElementById('cartBtnTop');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCart = document.getElementById('closeCart');
    
    if (cartBtn && cartDrawer) {
        cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
    }
    if (cartBtnHeader && cartDrawer) {
        cartBtnHeader.addEventListener('click', () => cartDrawer.classList.add('open'));
    }
    if (cartBtnTop && cartDrawer) {
        cartBtnTop.addEventListener('click', () => cartDrawer.classList.add('open'));
    }
    if (closeCart && cartDrawer) {
        closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));
    }
    
    // Cart item handlers
    const cartItemsEl = document.getElementById('cartItems');
    if (cartItemsEl) {
        cartItemsEl.addEventListener('click', function(e) {
            const btn = e.target.closest('button');
            if (!btn) return;
            const productId = btn.getAttribute('data-id');
            const action = btn.getAttribute('data-action');
            if (action === 'inc') updateCartQuantity(productId, 1);
            if (action === 'dec') updateCartQuantity(productId, -1);
            if (action === 'remove') removeFromCart(productId);
        });
    }
    
    // Filter handlers
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Pagination handlers
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
            }
        });
    }
    
    // Checkout handler
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = readCart();
            if (Object.keys(cart).length === 0) {
                alert('Your cart is empty.');
                return;
            }
            showCheckoutForm(cart);
        });
    }
    
    // Empty cart handler
    const emptyCartBtn = document.getElementById('emptyCartBtn');
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', function() {
            localStorage.removeItem(ECOMMERCE_STORAGE_KEY);
            renderCart({});
            updateCartCount();
        });
    }
    
    // (Removed) celebrations quick options and proceed
}

// Checkout form functionality
function showCheckoutForm(cart) {
    const total = cartToTotal(cart);
    
    // Create checkout form HTML
    const checkoutHTML = `
        <div class="checkout-overlay">
            <div class="checkout-modal">
                <div class="checkout-header">
                    <h3>Complete Your Order</h3>
                    <button class="close-checkout" onclick="closeCheckoutForm()">×</button>
                </div>
                <div class="checkout-content">
                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        <div class="order-items">
                            ${Object.values(cart).map(item => `
                                <div class="order-item">
                                    <span>${item.title}</span>
                                    <span>₹${(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            <strong>Total: ₹${total.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <form id="checkoutForm" class="checkout-form">
                        <h4>Delivery Details</h4>
                        <div class="form-group">
                            <label for="customerName">Full Name *</label>
                            <input type="text" id="customerName" name="customerName" required>
                        </div>
                        <div class="form-group">
                            <label for="customerEmail">Email *</label>
                            <input type="email" id="customerEmail" name="customerEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="customerPhone">Phone Number *</label>
                            <input type="tel" id="customerPhone" name="customerPhone" required>
                        </div>
                        <div class="form-group">
                            <label for="deliveryAddress">Delivery Address *</label>
                            <textarea id="deliveryAddress" name="deliveryAddress" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" id="city" name="city" required>
                        </div>
                        <div class="form-group">
                            <label for="pincode">Pincode *</label>
                            <input type="text" id="pincode" name="pincode" required>
                        </div>
                        <div class="form-group">
                            <label for="eventDate">Event Date *</label>
                            <input type="date" id="eventDate" name="eventDate" required>
                        </div>
                        <div class="form-group">
                            <label for="specialInstructions">Special Instructions</label>
                            <textarea id="specialInstructions" name="specialInstructions" rows="2"></textarea>
                        </div>
                        <div class="checkout-actions">
                            <button type="button" class="btn" onclick="closeCheckoutForm()">Cancel</button>
                            <button type="submit" class="btn primary">Pay ₹${total.toFixed(2)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    
    // Add form submit handler
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment(cart);
    });
}

function closeCheckoutForm() {
    const overlay = document.querySelector('.checkout-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function processPayment(cart) {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress', 'city', 'pincode', 'eventDate'];
    for (let field of requiredFields) {
        if (!formData.get(field)) {
            alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return;
        }
    }
    
    // Validate email
    const email = formData.get('customerEmail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Validate phone
    const phone = formData.get('customerPhone');
    if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    // Validate pincode
    const pincode = formData.get('pincode');
    if (!/^\d{6}$/.test(pincode)) {
        alert('Please enter a valid 6-digit pincode');
        return;
    }
    
    // Validate event date
    const eventDate = new Date(formData.get('eventDate'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
        alert('Event date cannot be in the past');
        return;
    }
    
    const total = cartToTotal(cart);
    const customerDetails = {
        name: formData.get('customerName'),
        email: email,
        contact: phone
    };
    
    // Initiate Razorpay payment
    initiateEcommercePayment(customerDetails, cart, total);
}

function initiateEcommercePayment(customerDetails, cart, total) {
    return new Promise((resolve) => {
        const amountPaise = Math.round(total * 100);
        
        console.log('Initiating payment for amount:', amountPaise, 'paise');
        
        // Check if Razorpay is loaded
        if (typeof window.Razorpay !== 'function') {
            console.error('Razorpay not loaded');
            alert('Payment gateway not loaded. Please refresh the page and try again.');
            resolve({ success: false });
            return;
        }
        
        const RAZORPAY_KEY = 'rzp_test_RFU56fR6NeZ9T2';
        
        if (!RAZORPAY_KEY || !amountPaise) {
            console.error('Missing Razorpay key or amount');
            alert('Payment configuration error. Please contact support.');
            resolve({ success: false });
            return;
        }
        
        const options = {
            key: RAZORPAY_KEY,
            amount: amountPaise,
            currency: 'INR',
            name: 'KKR Studios',
            description: 'Decoration Services Order',
            prefill: customerDetails,
            theme: { color: '#6366f1' },
            handler: function (response) {
                console.log('Payment successful:', response);
                handlePaymentSuccess(response, cart, customerDetails);
                resolve({ success: true, paymentId: response.razorpay_payment_id });
            },
            modal: {
                ondismiss: function () { 
                    console.log('Payment cancelled by user');
                    resolve({ success: false }); 
                }
            },
            notes: {
                order_id: 'KKR-ORDER-' + Date.now(),
                customer_email: customerDetails.email
            }
        };
        
        console.log('Razorpay options:', options);
        
        try {
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Razorpay initialization error:', error);
            alert('Payment gateway error: ' + error.message + '. Please try again.');
            resolve({ success: false });
        }
    });
}

function handlePaymentSuccess(response, cart, customerDetails) {
    // Save order to localStorage
    const order = {
        id: 'KKR-ORDER-' + Date.now().toString().slice(-8),
        paymentId: response.razorpay_payment_id,
        customer: customerDetails,
        items: Object.values(cart),
        total: cartToTotal(cart),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        eventDate: document.getElementById('eventDate').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        specialInstructions: document.getElementById('specialInstructions').value
    };
    
    // Save to localStorage
    try {
        const orders = JSON.parse(localStorage.getItem('app_ecommerce_orders') || '[]');
        orders.push(order);
        localStorage.setItem('app_ecommerce_orders', JSON.stringify(orders));
    } catch (e) {
        console.error('Failed to save order:', e);
    }
    
    // Clear cart
    localStorage.removeItem(ECOMMERCE_STORAGE_KEY);
    
    // Close checkout form
    closeCheckoutForm();
    
    // Close cart drawer
    const cartDrawer = document.getElementById('cartDrawer');
    if (cartDrawer) {
        cartDrawer.classList.remove('open');
    }
    
    // Update cart display
    renderCart({});
    updateCartCount();
    
    // Show success message
    showToast(`Order confirmed! Order ID: ${order.id}`, 'success');
    setTimeout(() => {
        showToast(`Payment ID: ${response.razorpay_payment_id}`, 'success');
    }, 1000);
}


// Initialize KKR Store page
function initKKRStore() {
    renderProducts();
    renderCart(readCart());
    updateCartCount();
    setupEventListeners();
}

// Redirect function for Book Now button
function redirectToEcommerce() {
    window.location.href = 'ecommerce.html';
}

// UI/UX Enhancement Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

function addPageTransition() {
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('page-transition');
        setTimeout(() => main.classList.add('loaded'), 100);
    }
}

function enhanceButtons() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function enhanceFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.remove('error');
                this.classList.add('success');
            } else {
                this.classList.remove('success');
                this.classList.add('error');
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error', 'success');
        });
    });
}

function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const elements = document.querySelectorAll('.product-card, .service-card, .feature-container');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize UI/UX enhancements
function initUIEnhancements() {
    addPageTransition();
    enhanceButtons();
    enhanceFormValidation();
    addSmoothScrolling();
    addIntersectionObserver();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initUIEnhancements();
    
    // Check if we're on the KKR Store page
    if (document.getElementById('productsGrid')) {
        initKKRStore();
    }
});
