// Basic client-side auth demo using localStorage (not for production)

const STORAGE_KEYS = {
    users: 'app_users',
    session: 'app_session_user',
    cart: 'app_cart',
    bookings: 'app_bookings',
    logins: 'app_logins'
};

// Razorpay key_id for Checkout (do not put key_secret in frontend)
const RAZORPAY_KEY = 'rzp_test_RFU56fR6NeZ9T2';
// Backend base URL for secure operations like refunds (set this when backend is ready)
const BACKEND_BASE_URL = '';
const REFUND_ENDPOINT = BACKEND_BASE_URL ? BACKEND_BASE_URL + '/refund' : '';

function getPackageAmountRupees(selectedPackage) {
    if (!selectedPackage || typeof selectedPackage !== 'string') return 0;
    // Check higher amounts first to avoid partial matches
    if (selectedPackage.includes('2699')) return 2699;
    if (selectedPackage.includes('1699')) return 1699;
    if (selectedPackage.includes('999')) return 999;
    if (selectedPackage.includes('699')) return 699;
    if (selectedPackage.includes('499')) return 499;
    return 0;
}

function initiatePayment({ name, email, mobile }, selection) {
    return new Promise((resolve) => {
        const amountRs = getPackageAmountRupees(selection && selection.selectedPackage);
        const amountPaise = amountRs * 100;

        // Check if Razorpay is loaded
        if (typeof window.Razorpay !== 'function') {
            alert('Payment gateway not loaded. Please refresh and try again.');
            resolve({ success: false });
            return;
        }

        if (!RAZORPAY_KEY || !amountPaise) {
            alert('Payment configuration error. Please contact support.');
            resolve({ success: false });
            return;
        }

        const options = {
            key: RAZORPAY_KEY,
            amount: amountPaise,
            currency: 'INR',
            name: 'KKR Studios',
            description: selection ? selection.selectedPackage : 'Booking',
            prefill: { name, email, contact: mobile },
            theme: { color: '#6c5ce7' },
            handler: function (response) {
                console.log('Payment successful:', response);
                resolve({ success: true, paymentId: response.razorpay_payment_id });
            },
            modal: {
                ondismiss: function () { 
                    console.log('Payment cancelled');
                    resolve({ success: false }); 
                }
            }
        };
        
        try {
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Razorpay error:', error);
            alert('Payment gateway error. Please try again.');
            resolve({ success: false });
        }
    });
}

function readUsers() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.users);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Failed to read users', e);
        return [];
    }
}

function writeUsers(users) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function setSession(username) {
    localStorage.setItem(STORAGE_KEYS.session, username);
}

function getSession() {
    return localStorage.getItem(STORAGE_KEYS.session);
}

function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message || '';
}

// OAuth Configuration
// You can either set these directly here or load from a config file
const GOOGLE_CLIENT_ID = '663869281104-m0ibft389831co335cdms3j7sohubgeg.apps.googleusercontent.com';
const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID'; // Replace with your actual Facebook App ID

// Alternative: Load from config file if available
// Uncomment the following lines if you want to use a separate config file
/*
try {
    const config = require('./config.js');
    GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;
    FACEBOOK_APP_ID = config.FACEBOOK_APP_ID;
} catch (e) {
    console.log('Using default OAuth configuration. Create config.js for custom settings.');
}
*/

// Initialize Google OAuth
function initializeGoogleAuth() {
    // Check if we have a valid client ID
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        console.warn('Google OAuth not configured. Please set your GOOGLE_CLIENT_ID in script.js');
        return;
    }
    
    // Check if we're running on file:// protocol
    if (window.location.protocol === 'file:') {
        console.warn('Google OAuth requires HTTPS or localhost. Please use a local server.');
        console.warn('Run: python -m http.server 8000 and open http://localhost:8000/login.html');
        return;
    }
    
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
        });
        console.log('Google OAuth initialized successfully');
    } else {
        console.warn('Google OAuth SDK not loaded. This usually means you need to use a local server.');
        console.warn('Try: python -m http.server 8000 and open http://localhost:8000/login.html');
    }
}

// Initialize Facebook SDK
function initializeFacebookAuth() {
    // Check if we have a valid app ID
    if (FACEBOOK_APP_ID === 'YOUR_FACEBOOK_APP_ID') {
        console.warn('Facebook OAuth not configured. Please set your FACEBOOK_APP_ID in script.js');
        return;
    }
    
    if (typeof FB !== 'undefined') {
        FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
        });
    } else {
        console.warn('Facebook SDK not loaded');
    }
}

// Handle Google Login
function handleGoogleLogin() {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        alert('Google OAuth is not configured yet. Please follow the setup instructions in OAUTH_SETUP.md');
        return;
    }
    
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt();
    } else {
        alert('Google Sign-In is not available. Please check your internet connection.');
    }
}

// Handle Google OAuth Response
function handleGoogleResponse(response) {
    try {
        const responsePayload = decodeJwtResponse(response.credential);
        
        if (responsePayload && responsePayload.email) {
            // Create or find user account
            const users = readUsers();
            let user = users.find(u => u.email.toLowerCase() === responsePayload.email.toLowerCase());
            
            if (!user) {
                // Create new user account
                user = {
                    fullName: responsePayload.name || 'Google User',
                    email: responsePayload.email,
                    password: '', // No password for social login
                    provider: 'google',
                    providerId: responsePayload.sub
                };
                users.push(user);
                writeUsers(users);
            }
            
            // Set session and redirect
            setSession(user.email);
            logSocialLogin(user.email, 'google');
            
            // Redirect based on user type
            const isAdmin = (user.email === 'varunraj173205@gmail.com');
            window.location.href = isAdmin ? 'admin.html' : 'index.html';
        } else {
            alert('Failed to get user information from Google. Please try again.');
        }
    } catch (error) {
        console.error('Google login error:', error);
        alert('Google login failed. Please try again.');
    }
}

// Handle Facebook Login
function handleFacebookLogin() {
    if (FACEBOOK_APP_ID === 'YOUR_FACEBOOK_APP_ID') {
        alert('Facebook OAuth is not configured yet. Please follow the setup instructions in OAUTH_SETUP.md');
        return;
    }
    
    if (typeof FB !== 'undefined') {
        FB.login(function(response) {
            if (response.authResponse) {
                handleFacebookResponse(response);
            } else {
                alert('Facebook login was cancelled or failed.');
            }
        }, {scope: 'email'});
    } else {
        alert('Facebook Login is not available. Please check your internet connection.');
    }
}

// Handle Facebook Login Response
function handleFacebookResponse(response) {
    FB.api('/me', {fields: 'name,email'}, function(userInfo) {
        try {
            if (userInfo && userInfo.email) {
                // Create or find user account
                const users = readUsers();
                let user = users.find(u => u.email.toLowerCase() === userInfo.email.toLowerCase());
                
                if (!user) {
                    // Create new user account
                    user = {
                        fullName: userInfo.name || 'Facebook User',
                        email: userInfo.email,
                        password: '', // No password for social login
                        provider: 'facebook',
                        providerId: userInfo.id
                    };
                    users.push(user);
                    writeUsers(users);
                }
                
                // Set session and redirect
                setSession(user.email);
                logSocialLogin(user.email, 'facebook');
                
                // Redirect based on user type
                const isAdmin = (user.email === 'varunraj173205@gmail.com');
                window.location.href = isAdmin ? 'admin.html' : 'index.html';
            } else {
                alert('Failed to get user information from Facebook. Please try again.');
            }
        } catch (error) {
            console.error('Facebook login error:', error);
            alert('Facebook login failed. Please try again.');
        }
    });
}

// Decode JWT token (for Google OAuth)
function decodeJwtResponse(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

// Log social login for analytics
function logSocialLogin(email, provider) {
    try {
        const rec = { email, provider, at: new Date().toISOString() };
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.logins) || '[]');
        list.push(rec);
        localStorage.setItem(STORAGE_KEYS.logins, JSON.stringify(list));
    } catch (error) {
        console.error('Error logging social login:', error);
    }
}

function onLoginLoaded() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Initialize Google OAuth
    initializeGoogleAuth();
    
    // Initialize Facebook SDK (disabled until credentials are configured)
    // initializeFacebookAuth();

    // Social login handlers
    const googleBtn = document.getElementById('googleLogin');
    const facebookBtn = document.getElementById('facebookLogin');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function () {
            handleGoogleLogin();
        });
    }
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function () {
            handleFacebookLogin();
        });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        let valid = true;
        showError('loginEmailError', '');
        showError('loginPasswordError', '');

        if (!validateEmail(email)) {
            showError('loginEmailError', 'Enter a valid email');
            valid = false;
        }
        if (!password || password.length < 6) {
            showError('loginPasswordError', 'Password must be at least 6 characters');
            valid = false;
        }
        if (!valid) return;

        const users = readUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            showError('loginEmailError', 'Email not registered');
            return;
        }
        if (user.password !== password) {
            showError('loginPasswordError', 'Incorrect password');
            return;
        }

        setSession(user.email);
        try {
            const rec = { email: user.email, at: new Date().toISOString() };
            const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.logins) || '[]');
            list.push(rec);
            localStorage.setItem(STORAGE_KEYS.logins, JSON.stringify(list));
        } catch {}

        // Redirect admin vs user
        const isAdmin = (user.email === 'varunraj173205@gmail.com' && user.password === 'varun173205');
        window.location.href = isAdmin ? 'admin.html' : 'index.html';
    });
}

function onRegisterLoaded() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    // Initialize social auth for register page
    initializeGoogleAuth();
    // initializeFacebookAuth();

    // Social login handlers for register page
    const googleBtn = document.getElementById('googleRegister');
    const facebookBtn = document.getElementById('facebookRegister');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function () {
            handleGoogleLogin();
        });
    }
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function () {
            handleFacebookLogin();
        });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const fullName = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        let valid = true;
        showError('regUsernameError', '');
        showError('regEmailError', '');
        showError('regPasswordError', '');
        showError('regConfirmPasswordError', '');

        if (!fullName || fullName.length < 3) {
            showError('regUsernameError', 'Name must be at least 3 characters');
            valid = false;
        }
        if (!validateEmail(email)) {
            showError('regEmailError', 'Enter a valid email');
            valid = false;
        }
        if (!password || password.length < 6) {
            showError('regPasswordError', 'Password must be at least 6 characters');
            valid = false;
        }
        if (password !== confirmPassword) {
            showError('regConfirmPasswordError', 'Passwords do not match');
            valid = false;
        }
        if (!valid) return;

        const users = readUsers();
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            showError('regEmailError', 'Email already registered');
            alert('This email is already registered. Please log in instead.');
            return;
        }

        users.push({ fullName, email, password });
        writeUsers(users);

        // Auto-login after registration
        setSession(email);
        alert('Registration successful! Signing you in...');
        window.location.href = 'index.html';
    });
}

function onHomeLoaded() {
    // Initialize hero slider ASAP regardless of auth/cart presence
    (function initHeroSliderOnce() {
        const slider = document.getElementById('heroSlider');
        if (!slider || slider.dataset.initialized === 'true') return;
        slider.dataset.initialized = 'true';
        const track = slider.querySelector('.slides');
        if (!track) return;
        const images = Array.from(track.querySelectorAll('img'));
        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        const dotsWrap = slider.querySelector('.dots');
        let index = 0;

        function go(i) {
            if (images.length === 0) return;
            index = (i + images.length) % images.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            if (dotsWrap) Array.from(dotsWrap.children).forEach((d, di) => d.classList.toggle('active', di === index));
        }
        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            images.forEach((_, i) => {
                const b = document.createElement('button');
                if (i === 0) b.classList.add('active');
                b.addEventListener('click', () => go(i));
                dotsWrap.appendChild(b);
            });
        }
        if (prev) prev.addEventListener('click', () => go(index - 1));
        if (next) next.addEventListener('click', () => go(index + 1));
        setInterval(() => go(index + 1), 4000);
    })();

    // Only run the rest on the homepage where product grid exists
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    // Guard route: redirect to login if not authenticated
    const logoutBtn = document.getElementById('logoutBtn');
    const sessionUser = getSession();
    if (!sessionUser) {
        window.location.href = 'login.html';
        return;
    }

    // Prevent admin session from viewing user home
    if (sessionUser === 'varunraj173205@gmail.com') {
        window.location.href = 'admin.html';
        return;
    }

    // No welcome heading on user homepage

    // E-commerce: products and cart
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCart = document.getElementById('closeCart');
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartBtn = document.getElementById('emptyCartBtn');

    // Side menu elements
    const sideMenu = document.getElementById('sideMenu');
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const menuProfile = document.getElementById('menuProfile');
    const menuCancel = document.getElementById('menuCancel');
    const menuHelp = document.getElementById('menuHelp');
    const menuAbout = document.getElementById('menuAbout');

    if (!productGrid) return;

    const products = [];

    function readCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.cart);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }
    function writeCart(cart) {
        localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    }
    function cartToCount(cart) {
        return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    }
    function cartToTotal(cart) {
        return Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
    }
    function renderCart(cart) {
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
                <div class="subtotal">$${(item.quantity * item.price).toFixed(2)}</div>
            `;
            cartItemsEl.appendChild(row);
        });
        const total = cartToTotal(cart);
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
        cartCountEl.textContent = cartToCount(cart);
    }

    function addToCart(product) {
        const cart = readCart();
        if (!cart[product.id]) {
            cart[product.id] = { ...product, quantity: 0 };
        }
        cart[product.id].quantity += 1;
        writeCart(cart);
        renderCart(cart);
    }
    function updateQty(id, delta) {
        const cart = readCart();
        if (!cart[id]) return;
        cart[id].quantity += delta;
        if (cart[id].quantity <= 0) delete cart[id];
        writeCart(cart);
        renderCart(cart);
    }
    function removeItem(id) {
        const cart = readCart();
        delete cart[id];
        writeCart(cart);
        renderCart(cart);
    }

    // Render products
    productGrid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <div class="info">
                <div class="title">${p.title}</div>
                <div class="price">$${p.price.toFixed(2)}</div>
                <div class="actions">
                    <button data-id="${p.id}" class="btn primary add-to-cart">Book now</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });

    productGrid.addEventListener('click', function (e) {
        const target = e.target;
        if (target.classList.contains('add-to-cart')) {
            const id = target.getAttribute('data-id');
            const product = products.find(p => p.id === id);
            if (product) addToCart(product);
        }
    });

    cartItemsEl.addEventListener('click', function (e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'inc') updateQty(id, 1);
        if (action === 'dec') updateQty(id, -1);
        if (action === 'remove') removeItem(id);
    });

    if (cartBtn && cartDrawer && closeCart) {
        cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
        closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));
    }

    // Side menu behavior
    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            menuBtn.classList.add('animated');
            setTimeout(() => menuBtn.classList.remove('animated'), 600);
        });
    }
    if (closeMenu && sideMenu) {
        closeMenu.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });
    }
    
    // Close menu when clicking outside
    if (sideMenu) {
        sideMenu.addEventListener('click', (e) => {
            if (e.target === sideMenu) {
                sideMenu.classList.remove('open');
            }
        });
    }
    // Simple handlers for menu items
    if (menuProfile) menuProfile.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'profile.html'; });
    if (menuCancel) menuCancel.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu && sideMenu.classList.remove('open');

        const sessionUser = getSession();
        if (!sessionUser) { alert('Please log in to manage bookings.'); return; }

        // Read user's bookings
        let list = [];
        try { list = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]'); } catch { list = []; }
        const mine = list.filter(b => b && b.email && b.email.toLowerCase() === sessionUser.toLowerCase());
        if (mine.length === 0) { alert('No bookings found for your account.'); return; }

        // Build choices string
        const choices = mine.map(b => {
            const when = new Date(b.createdAt);
            return `${b.id} | ${b.date} ${b.slotStart}-${b.slotEnd} | ${b.occasion} | ${b.package} | ${b.status || 'confirmed'}`;
        }).join('\n');
        const chosen = prompt('Enter the Ticket ID to cancel:');
        if (!chosen) return;
        const idx = list.findIndex(b => b && b.id === chosen);
        if (idx < 0) { alert('Invalid Ticket ID.'); return; }
        const booking = list[idx];
        if (booking.status && booking.status.startsWith('cancelled')) { alert('This booking is already cancelled.'); return; }

        // 3-hour rule check based on date + slotStart
        if (!booking.date || !booking.slotStart) { alert('This booking has incomplete date/time and cannot be cancelled here. Contact support.'); return; }
        const eventStart = new Date(`${booking.date}T${booking.slotStart}:00`);
        const cutoff = new Date(eventStart.getTime() - 3 * 60 * 60 * 1000);
        if (new Date() > cutoff) {
            alert('Cancellations are allowed only up to 3 hours before the event start.');
            return;
        }

        const reason = prompt('Please provide a cancellation reason:');
        if (reason == null || reason.trim() === '') { alert('Cancellation reason is required.'); return; }

        // Persist cancellation
        booking.status = 'cancelled_by_user';
        booking.cancelReason = reason.trim();
        booking.cancelledAt = new Date().toISOString();
        try { localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(list)); } catch {}
        alert('Your booking has been cancelled. Any refunds are handled by the admin.');
    });
    if (menuHelp) menuHelp.addEventListener('click', (e) => { e.preventDefault(); alert('For help, contact KKR Studios support.'); });
    if (menuAbout) menuAbout.addEventListener('click', (e) => { e.preventDefault(); alert('KKR Studios — bring your celebrations to life!'); });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            const cart = readCart();
            if (Object.keys(cart).length === 0) {
                alert('Your cart is empty.');
                return;
            }
            alert('Checkout complete (demo). Thank you!');
            localStorage.removeItem(STORAGE_KEYS.cart);
            renderCart({});
            cartDrawer.classList.remove('open');
        });
    }
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', function () {
            localStorage.removeItem(STORAGE_KEYS.cart);
            renderCart({});
        });
    }

    // Initial cart render
    renderCart(readCart());

    // Logout handled by global wireGlobalLogout()

    // Hero slider already initialized above
}

function onAdminLoaded() {
    const heading = document.getElementById('adminHeading');
    const logoutBtn = document.getElementById('logoutBtn');
    if (!heading) return;

    const sessionUser = getSession();
    if (!sessionUser) {
        window.location.href = 'login.html';
        return;
    }

    // Only allow the specific admin user
    if (sessionUser !== 'varunraj173205@gmail.com') {
        window.location.href = 'index.html';
        return;
    }

    heading.textContent = 'Admin Dashboard';

    // Logout handled by global wireGlobalLogout()

    // Render bookings
    const table = document.getElementById('bookingsTable');
    if (table) {
        function readBookings() {
            try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]'); }
            catch { return []; }
        }
        function render() {
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            const rows = readBookings();
            rows.slice().reverse().forEach(b => {
                const tr = document.createElement('tr');
                const when = new Date(b.createdAt);
                const slot = `${b.slotStart} - ${b.slotEnd}`;
                tr.innerHTML = `
                    <td>${when.toLocaleString()}</td>
                    <td>${b.name}</td>
                    <td>${b.mobile}</td>
                    <td>${b.email}</td>
                    <td>${b.occasion}</td>
                    <td>${b.package}</td>
                    <td>${b.date || '-'}</td>
                    <td>${slot}</td>
                    <td>${b.status === 'cancelled' ? '<span class="status-chip status-cancel">Cancelled</span>' : '<span class="status-chip status-ok">Confirmed</span>'}</td>
                    <td>
                        ${b.status === 'cancelled' ? '<span class="subtitle">' + (b.cancelNote || '—') + '</span>' : '<button class="btn" data-action="cancel" data-id="' + b.id + '">Cancel</button>'}
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Trending removed
        }
        render();

        // Sections are now always visible separately; no toggle needed

        const clearBtn = document.getElementById('clearBookings');
        if (clearBtn) clearBtn.addEventListener('click', function () {
            if (!confirm('Clear all bookings?')) return;
            localStorage.removeItem(STORAGE_KEYS.bookings);
            render();
        });

        const downloadBtn = document.getElementById('downloadData');
        if (downloadBtn) downloadBtn.addEventListener('click', function () {
            let rows = [];
            try { rows = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]'); }
            catch { rows = []; }

            const w = window.open('', '_blank');
            if (!w) return;
            const safe = (v) => (v == null ? '' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
            const trs = rows.slice().reverse().map(b => {
                const when = new Date(b.createdAt);
                const slot = `${safe(b.slotStart)} - ${safe(b.slotEnd)}`;
                const status = b.status === 'cancelled' ? 'Cancelled' : 'Confirmed';
                const refund = b.refundAmount ? `₹${Number(b.refundAmount).toFixed(2)}` : '-';
                return `<tr>
                    <td>${safe(when.toLocaleString())}</td>
                    <td>${safe(b.name)}</td>
                    <td>${safe(b.mobile)}</td>
                    <td>${safe(b.email)}</td>
                    <td>${safe(b.occasion)}</td>
                    <td>${safe(b.package)}</td>
                    <td>${safe(b.date || '-')}</td>
                    <td>${slot}</td>
                    <td>${safe(status)}</td>
                    <td>${safe(b.cancelNote || '-')}</td>
                    <td>${refund}</td>
                </tr>`;
            }).join('');
            let logins = [];
            try { logins = JSON.parse(localStorage.getItem(STORAGE_KEYS.logins) || '[]'); } catch { logins = []; }
            const loginRows = logins.slice().reverse().map(l => `<tr><td>${safe(l.email)}</td><td>${safe(new Date(l.at).toLocaleString())}</td></tr>`).join('');

            const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>KKR Bookings Report</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; color:#111; }
  h1 { margin: 0 0 12px; font-size: 20px; }
  .muted { color: #555; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
  thead th { background: #f5f5f5; }
  .actions { margin: 12px 0; }
  .btn { padding: 8px 12px; border: 1px solid #333; border-radius: 6px; background: #fff; cursor: pointer; }
  @media print { .no-print { display:none; } }
</style></head>
<body>
  <h1>KKR STUDIOS — Bookings Report</h1>
  <div class="muted">Generated at ${new Date().toLocaleString()}</div>
  <div class="actions no-print">
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <table>
    <thead>
      <tr>
        <th>When</th>
        <th>Name</th>
        <th>Mobile</th>
        <th>Email</th>
        <th>Occasion</th>
        <th>Package</th>
        <th>Date</th>
        <th>Slot</th>
        <th>Status</th>
        <th>Note</th>
        <th>Refund</th>
      </tr>
    </thead>
    <tbody>${trs}</tbody>
  </table>

  <h1 style="margin-top:24px;">Login Activity</h1>
  <div class="muted">Recent sign-ins</div>
  <table>
    <thead><tr><th>Email</th><th>Signed In At</th></tr></thead>
    <tbody>${loginRows}</tbody>
  </table>
</body></html>`;
            w.document.open();
            w.document.write(html);
            w.document.close();
        });

        // Handle cancel click
        table.addEventListener('click', function (e) {
            const btn = e.target.closest('button[data-action="cancel"]');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            const note = prompt('Enter cancellation note (visible to user):');
            if (note === null) return; // cancelled
            const amt = prompt('Enter refund amount (₹):', '0');
            if (amt === null) return;
            const amountRs = Number(amt) || 0;

            // Attempt real refund via backend if configured
            (async function () {
                let refundOk = false;
                try {
                    if (REFUND_ENDPOINT) {
                        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]');
                        const booking = list.find(b => b.id === id);
                        const paymentId = booking && booking.razorpayPaymentId;
                        if (!paymentId) throw new Error('Missing payment ID for refund');
                        const res = await fetch(REFUND_ENDPOINT, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId, amount: Math.round(amountRs * 100) })
                        });
                        refundOk = res.ok;
                        if (!res.ok) {
                            const t = await res.text();
                            console.error('Refund failed:', t);
                        }
                    }
                } catch (err) {
                    console.error('Refund error', err);
                }
                if (!refundOk) {
                    alert('Refund simulated (no backend configured).');
                } else {
                    alert('Refund issued successfully.');
                }

                try {
                    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]');
                    const idx = list.findIndex(b => b.id === id);
                    if (idx >= 0) {
                        list[idx].status = 'cancelled';
                        list[idx].cancelNote = note;
                        list[idx].refundAmount = amountRs;
                        list[idx].cancelledAt = new Date().toISOString();
                        localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(list));
                    }
                } catch {}
                render();
            })();
        });
    }
}

function onBookingLoaded() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    // Guard: must be logged in and not admin
    const sessionUser = getSession();
    if (!sessionUser) {
        window.location.href = 'login.html';
        return;
    }
    if (sessionUser === 'varunraj173205@gmail.com') {
        window.location.href = 'admin.html';
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const occInput = document.querySelector('input[name="occasion"]:checked');
        const occasion = occInput ? occInput.value : '';
        const pkgInput = document.querySelector('input[name="package"]:checked');
        const selectedPackage = pkgInput ? pkgInput.value : '';
        const date = '';
        const time = '';
        const notes = '';

        let valid = true;
        showError('occasionError', '');
        // date/time/notes removed
        showError('packageError', '');

        if (!occasion) { showError('occasionError', 'Please select an occasion'); valid = false; }
        if (!selectedPackage) { showError('packageError', 'Please select a package'); valid = false; }
        if (!valid) return;

        // Persist selection temporarily and redirect to details
        const selection = { occasion, selectedPackage };
        localStorage.setItem('app_booking_selection', JSON.stringify(selection));
        window.location.href = 'details.html';
    });

    // Disable submit until both selected
    const bookingSubmit = document.getElementById('bookingSubmit');
    function updateSubmitState() {
        const occChecked = !!document.querySelector('input[name="occasion"]:checked');
        const pkgChecked = !!document.querySelector('input[name="package"]:checked');
        if (bookingSubmit) bookingSubmit.disabled = !(occChecked && pkgChecked);
    }
    document.getElementById('occasionOptions').addEventListener('change', updateSubmitState);
    document.querySelector('.package-grid').addEventListener('change', updateSubmitState);
    updateSubmitState();

    // Toggle package details view
    document.querySelectorAll('.package-card').forEach(card => {
        const viewBtn = card.querySelector('.view-btn');
        if (!viewBtn) return;
        viewBtn.addEventListener('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            card.classList.toggle('show-details');
        });
    });
}

// Initialize per-page behavior
function wireGlobalLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn || btn.dataset.boundLogout === 'true') return;
    btn.dataset.boundLogout = 'true';
    btn.addEventListener('click', function () {
        if (confirm('Are you sure you want to logout?')) {
            clearSession();
            window.location.href = 'login.html';
        }
    });
}

// Redirect function for the new container
function redirectToNewPage() {
    window.location.href = 'services.html';
}

// Redirect function for Book Now button
function redirectToEcommerce() {
    window.location.href = 'ecommerce.html';
}

// Feature slider functionality
function initFeatureSlider() {
    const slider = document.querySelector('.feature-image-slider .slider-container');
    if (!slider || slider.dataset.initialized === 'true') return;
    slider.dataset.initialized = 'true';
    
    const track = slider.querySelector('.slider-track');
    const images = Array.from(track.querySelectorAll('img'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsWrap = slider.querySelector('.slider-dots');
    let currentIndex = 0;

    function updateSlider() {
        if (images.length === 0) return;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        if (dotsWrap) {
            Array.from(dotsWrap.children).forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlider();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    // Initialize dots
    if (dotsWrap && images.length > 1) {
        dotsWrap.innerHTML = '';
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsWrap.appendChild(dot);
        });
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto-slide every 3 seconds
    if (images.length > 1) {
        setInterval(nextSlide, 3000);
    }

    // Initialize
    updateSlider();
}

document.addEventListener('DOMContentLoaded', function () {
    wireGlobalLogout();
    onLoginLoaded();
    onRegisterLoaded();
    onHomeLoaded();
    onAdminLoaded();
    onBookingLoaded();
    onDetailsLoaded();
    onThanksLoaded();
    onProfileLoaded();
    initFeatureSlider();
});

function onDetailsLoaded() {
    const form = document.getElementById('detailsForm');
    if (!form) return;

    // Guard: logged in and not admin
    const sessionUser = getSession();
    if (!sessionUser) { window.location.href = 'login.html'; return; }
    if (sessionUser === 'varunraj173205@gmail.com') { window.location.href = 'admin.html'; return; }

    // Show selection summary
    const summaryEl = document.getElementById('selectionSummary');
    const submitBtn = form.querySelector('button[type="submit"]');
    try {
        const sel = JSON.parse(localStorage.getItem('app_booking_selection') || '{}');
        if (sel.occasion && sel.selectedPackage) {
            summaryEl.textContent = `${sel.occasion} — ${sel.selectedPackage}`;
        }
        // Update pay button text with amount
        const amt = getPackageAmountRupees(sel && sel.selectedPackage);
        console.log('Selected package:', sel && sel.selectedPackage, 'Amount:', amt);
        if (submitBtn && amt > 0) {
            submitBtn.textContent = `Pay ₹${amt}`;
        } else if (submitBtn) {
            submitBtn.textContent = 'Pay Now';
        }
    } catch {}

    const slotGrid = document.getElementById('slotGrid');
    const dateInput = document.getElementById('custDate');

    function computeEndTime(start) {
        if (!start) return '';
        const [h, m] = start.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        date.setMinutes(date.getMinutes() + 60); // add 1 hour
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }

    function renderSlots(hoursPerSlot, selectedDateStr) {
        if (!slotGrid) return;
        slotGrid.innerHTML = '';
        // Read previously booked slots for selected date and lock them
        let locked = new Set();
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]');
            existing.forEach(b => {
                if (!b) return;
                if (!selectedDateStr) return; // only lock when a date is chosen
                if (b.date !== selectedDateStr) return; // lock only same-date bookings
                if (b.slotStart && b.slotEnd) locked.add(`${b.slotStart}-${b.slotEnd}`);
            });
        } catch {}

        const starts = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
        starts.forEach((start, idx) => {
            // Hide past slots if selected date is today
            if (selectedDateStr) {
                const todayIso = new Date().toISOString().slice(0,10);
                if (selectedDateStr === todayIso) {
                    const slotTime = new Date(`${selectedDateStr}T${start}:00`);
                    if (slotTime <= new Date()) {
                        return; // skip past slots
                    }
                }
            }

            const [h, m] = start.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            d.setHours(d.getHours() + hoursPerSlot);
            const end = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

            const id = `ts-${idx}`;
            const label = document.createElement('label');
            label.className = 'slot-card';
            label.setAttribute('for', id);
            label.textContent = formatDisplay(start) + ' - ' + formatDisplay(end);

            const input = document.createElement('input');
            input.type = 'radio';
            input.id = id;
            input.name = 'timeSlot';
            input.value = `${start}-${end}`;
            input.hidden = true;
            if (locked.has(input.value)) {
                input.disabled = true;
                label.classList.add('locked');
                label.title = 'This slot is already booked';
                const badge = document.createElement('span');
                badge.className = 'badge-booked';
                badge.textContent = 'Booked';
                label.appendChild(badge);
            }

            slotGrid.appendChild(input);
            slotGrid.appendChild(label);
        });

        // No hidden end field; end time is encoded in the radio value
        slotGrid.addEventListener('change', function () {
            // nothing else needed here for now
        });
    }

    function formatDisplay(hhmm) {
        const [h, m] = hhmm.split(':').map(Number);
        const dt = new Date();
        dt.setHours(h, m, 0, 0);
        const hour12 = dt.getHours() % 12 || 12;
        const ampm = dt.getHours() >= 12 ? 'PM' : 'AM';
        return `${hour12}:${String(dt.getMinutes()).padStart(2,'0')} ${ampm}`;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        try {
            const name = document.getElementById('custName').value.trim();
            const mobile = document.getElementById('custMobile').value.trim();
            const email = document.getElementById('custEmail').value.trim();
            const dateStr = document.getElementById('custDate').value;
            const ts = document.querySelector('input[name="timeSlot"]:checked');
            let start = '';
            let end = '';
            if (ts && ts.value.includes('-')) {
                const parts = ts.value.split('-');
                start = parts[0];
                end = parts[1];
            }
            const termsOk = document.getElementById('payTerms') && document.getElementById('payTerms').checked;

            // Clear errors
            showError('custNameError', '');
            showError('custMobileError', '');
            showError('custEmailError', '');
            showError('slotError', '');
            showError('termsError', '');

            let valid = true;
            if (!name) { showError('custNameError', 'Please enter your name'); valid = false; }
            if (!/^\d{10}$/.test(mobile)) { showError('custMobileError', 'Enter a valid 10-digit number'); valid = false; }
            if (!validateEmail(email)) { showError('custEmailError', 'Enter a valid email'); valid = false; }
            if (!dateStr) { showError('custDateError', 'Please choose a date'); valid = false; }
            if (!start || !end) { showError('slotError', 'Please select a time slot'); valid = false; }
            if (!termsOk) { showError('termsError', 'You must agree to the Terms and Conditions'); valid = false; }
            if (valid) {
                let selection = {};
                try { selection = JSON.parse(localStorage.getItem('app_booking_selection') || '{}'); } catch {}

                const paid = await initiatePayment({ name, email, mobile }, selection);
                if (!paid || paid.success !== true) return;

                // Save booking to localStorage after payment success
                const booking = {
                    id: 'KKR' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3).toUpperCase(),
                    occasion: selection.occasion || '',
                    package: selection.selectedPackage || '',
                    name,
                    mobile,
                    email,
                    date: dateStr,
                    slotStart: start,
                    slotEnd: end,
                    createdAt: new Date().toISOString(),
                    razorpayPaymentId: paid.paymentId || ''
                };
                try {
                    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]');
                    list.push(booking);
                    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(list));
                } catch {}
                localStorage.removeItem('app_booking_selection');
            window.location.href = 'thanks.html';
            }
        } catch (err) {
            console.error('Failed to process booking', err);
        }
    });

    // Determine slot length based on selected package (2 hours for 2699)
    let hoursPerSlot = 1;
    try {
        const sel = JSON.parse(localStorage.getItem('app_booking_selection') || '{}');
        if (sel && typeof sel.selectedPackage === 'string' && sel.selectedPackage.includes('2 HR')) {
            hoursPerSlot = 2;
        }
    } catch {}
    renderSlots(hoursPerSlot, dateInput ? dateInput.value : '');

    // Re-render slots on date change to hide past times for today
    if (dateInput) {
        dateInput.addEventListener('change', function () {
            renderSlots(hoursPerSlot, dateInput.value);
        });
    }
}

function onThanksLoaded() {
    const btn = document.getElementById('downloadTicket');
    if (!btn) return;

    btn.addEventListener('click', function () {
        let lastBooking = null;
        try {
            const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]');
            if (Array.isArray(list) && list.length > 0) {
                lastBooking = list[list.length - 1];
            }
        } catch {}

        if (!lastBooking) {
            alert('No booking found to generate ticket.');
            return;
        }

        const ticketWindow = window.open('', '_blank');
        if (!ticketWindow) return;
        const when = new Date(lastBooking.createdAt);
        const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>KKR Ticket ${lastBooking.id}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; }
  .ticket { border: 1px solid #ddd; border-radius: 10px; padding: 16px; max-width: 520px; }
  .title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e5e5e5; }
  .row:last-child { border-bottom: 0; }
  .muted { color: #666; }
  .brand { font-weight: 700; margin-bottom: 12px; }
  .footer { margin-top: 12px; font-size: 12px; color: #666; }
  @media print { .no-print { display: none; } }
  .btn { padding: 8px 12px; border: 1px solid #333; border-radius: 6px; background: #fff; cursor: pointer; }
  .btn.primary { background: #6c5ce7; color: white; border-color: #6c5ce7; }
  .q { font-family: monospace; }
</style></head>
<body>
  <div class="ticket">
    <div class="brand">KKR STUDIOS</div>
    <div class="title">Booking Ticket</div>
    <div class="row"><div class="muted">Ticket ID</div><div class="q">${lastBooking.id}</div></div>
    <div class="row"><div class="muted">Name</div><div>${lastBooking.name}</div></div>
    <div class="row"><div class="muted">Mobile</div><div>${lastBooking.mobile}</div></div>
    <div class="row"><div class="muted">Email</div><div>${lastBooking.email}</div></div>
    <div class="row"><div class="muted">Occasion</div><div>${lastBooking.occasion}</div></div>
    <div class="row"><div class="muted">Package</div><div>${lastBooking.package}</div></div>
    <div class="row"><div class="muted">Date</div><div>${lastBooking.date}</div></div>
    <div class="row"><div class="muted">Time</div><div>${lastBooking.slotStart} - ${lastBooking.slotEnd}</div></div>
    <div class="row"><div class="muted">Booked At</div><div>${when.toLocaleString()}</div></div>
    <div class="footer">Thank you for choosing KKR Studios.</div>
    <div style="margin-top:12px; display:flex; gap:8px;" class="no-print">
      <button onclick="window.print()" class="btn primary">Print</button>
      <button onclick="window.close()" class="btn">Close</button>
    </div>
  </div>
</body></html>`;
        ticketWindow.document.open();
        ticketWindow.document.write(html);
        ticketWindow.document.close();
    });
}

function onProfileLoaded() {
    const nameEl = document.getElementById('profileName');
    const emailEl = document.getElementById('profileEmail');
    const bookingsWrap = document.getElementById('profileBookings');
    if (!nameEl || !emailEl) return;

    // Guard: must be logged in
    const sessionUser = getSession();
    if (!sessionUser) {
        window.location.href = 'login.html';
        return;
    }

    // Find user
    const users = readUsers();
    const user = users.find(u => u.email && u.email.toLowerCase() === sessionUser.toLowerCase());
    nameEl.textContent = (user && user.fullName) ? user.fullName : '-';
    emailEl.textContent = sessionUser;

    // Render user's bookings
    if (bookingsWrap) {
        try {
            const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.bookings) || '[]');
            // Show all bookings for testing purposes
            const allBookings = list.filter(b => b && b.id);
            
            if (allBookings.length === 0) {
                // Add a test booking for demo purposes
                const testBooking = {
                    id: 'KKR' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 3).toUpperCase(),
                    occasion: 'Birthday Celebration',
                    package: 'PACKAGE 999 (1 HR)',
                    name: 'Test User',
                    mobile: '9876543210',
                    email: sessionUser,
                    date: new Date().toISOString().slice(0, 10),
                    slotStart: '14:00',
                    slotEnd: '15:00',
                    createdAt: new Date().toISOString()
                };
                list.push(testBooking);
                localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(list));
                allBookings.push(testBooking);
            }
            
            if (allBookings.length === 0) {
                bookingsWrap.innerHTML = '<div class="subtitle">No bookings found.</div>';
            } else {
                const container = document.createElement('div');
                allBookings.slice().reverse().forEach(b => {
                    const when = new Date(b.createdAt);
                    const cancelled = new Date(b.cancelledAt);
                    const status = b.status === 'cancelled' || b.status === 'cancelled_by_user' ? 'Cancelled' : 'Confirmed';
                    const statusClass = status === 'Cancelled' ? 'status-cancel' : 'status-ok';
                    
                    const bookingCard = document.createElement('div');
                    bookingCard.className = 'booking-card';
                    bookingCard.innerHTML = `
                        <div class="booking-header">
                            <div class="booking-id">Ticket: ${b.id}</div>
                            <div class="status-chip ${statusClass}">${status}</div>
                        </div>
                        <div class="booking-details">
                            <div class="booking-row">
                                <span class="label">Occasion:</span>
                                <span>${b.occasion}</span>
                            </div>
                            <div class="booking-row">
                                <span class="label">Package:</span>
                                <span>${b.package}</span>
                            </div>
                            <div class="booking-row">
                                <span class="label">Date:</span>
                                <span>${b.date}</span>
                            </div>
                            <div class="booking-row">
                                <span class="label">Time:</span>
                                <span>${b.slotStart} - ${b.slotEnd}</span>
                            </div>
                            <div class="booking-row">
                                <span class="label">Booked:</span>
                                <span>${when.toLocaleString()}</span>
                            </div>
                            ${b.cancelReason ? `<div class="booking-row"><span class="label">Cancellation Reason:</span><span>${b.cancelReason}</span></div>` : ''}
                            ${b.refundAmount ? `<div class="booking-row"><span class="label">Refund Amount:</span><span>₹${Number(b.refundAmount).toFixed(2)}</span></div>` : ''}
                        </div>
                    `;
                    container.appendChild(bookingCard);
                });
                bookingsWrap.innerHTML = '';
                bookingsWrap.appendChild(container);
            }
        } catch {}
    }

    // Logout handled by global wireGlobalLogout()
}


