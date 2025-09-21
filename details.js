// Payment details page functionality for KKR Studios
let selectedTimeSlot = null;
let selectedPackage = null;

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment details page loaded');
    
    // Load booking data from localStorage
    loadBookingData();
    
    // Setup form functionality
    setupPaymentForm();
    
    // Setup hamburger menu
    setupHamburgerMenu();
});

function loadBookingData() {
    // Get booking data from localStorage
    const bookingData = localStorage.getItem('bookingSelection');
    if (bookingData) {
        const data = JSON.parse(bookingData);
        console.log('Loaded booking data:', data);
        
        // Determine package duration and price
        const packageInfo = getPackageInfo(data.package);
        selectedPackage = {
            title: data.package || 'Selected Package',
            price: packageInfo.price,
            duration: packageInfo.duration
        };
    } else {
        // Default package if no data
        selectedPackage = {
            title: 'Event Package',
            price: 999,
            duration: 1
        };
    }
    
    // Generate time slots based on package duration
    generateTimeSlots();
}

function getPackageInfo(packageName) {
    const packageMap = {
        'PACKAGE 499 (1 HR)': { price: 499, duration: 1 },
        'PACKAGE 699 (1 HR)': { price: 699, duration: 1 },
        'PACKAGE 999 (1 HR)': { price: 999, duration: 1 },
        'PACKAGE 1699 (1 HR)': { price: 1699, duration: 1 },
        'PACKAGE 2699 (2 HR)': { price: 2699, duration: 2 }
    };
    return packageMap[packageName] || { price: 999, duration: 1 };
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const timeSlotLabel = document.getElementById('timeSlotLabel');
    
    if (!timeSlotsContainer) return;
    
    // Clear existing slots
    timeSlotsContainer.innerHTML = '';
    
    // Update label based on duration
    if (timeSlotLabel) {
        const duration = selectedPackage.duration;
        timeSlotLabel.textContent = `Time Slot (${duration} Hour${duration > 1 ? 's' : ''}) *`;
    }
    
    // Generate time slots based on package duration
    const slots = selectedPackage.duration === 2 ? generate2HourSlots() : generate1HourSlots();
    
    slots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.className = `time-slot ${selectedPackage.duration === 2 ? 'time-slot-2hour' : ''}`;
        slotElement.dataset.time = slot.time;
        slotElement.textContent = slot.display;
        timeSlotsContainer.appendChild(slotElement);
    });
    
    // Add click handlers for new slots
    setupTimeSlotSelection();
}

function generate1HourSlots() {
    return [
        { time: '09:00-10:00', display: '9:00 AM - 10:00 AM' },
        { time: '10:00-11:00', display: '10:00 AM - 11:00 AM' },
        { time: '11:00-12:00', display: '11:00 AM - 12:00 PM' },
        { time: '12:00-13:00', display: '12:00 PM - 1:00 PM' },
        { time: '14:00-15:00', display: '2:00 PM - 3:00 PM' },
        { time: '15:00-16:00', display: '3:00 PM - 4:00 PM' },
        { time: '16:00-17:00', display: '4:00 PM - 5:00 PM' },
        { time: '17:00-18:00', display: '5:00 PM - 6:00 PM' }
    ];
}

function generate2HourSlots() {
    return [
        { time: '09:00-11:00', display: '9:00 AM - 11:00 AM' },
        { time: '10:00-12:00', display: '10:00 AM - 12:00 PM' },
        { time: '11:00-13:00', display: '11:00 AM - 1:00 PM' },
        { time: '12:00-14:00', display: '12:00 PM - 2:00 PM' },
        { time: '14:00-16:00', display: '2:00 PM - 4:00 PM' },
        { time: '15:00-17:00', display: '3:00 PM - 5:00 PM' },
        { time: '16:00-18:00', display: '4:00 PM - 6:00 PM' }
    ];
}

function setupTimeSlotSelection() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selected class to clicked slot
            this.classList.add('selected');
            selectedTimeSlot = this.dataset.time;
            
            updatePayButton();
        });
    });
}

function setupPaymentForm() {
    const form = document.getElementById('paymentForm');
    const payButton = document.getElementById('payButton');
    const acceptTerms = document.getElementById('acceptTerms');
    
    // Terms checkbox change
    if (acceptTerms) {
        acceptTerms.addEventListener('change', updatePayButton);
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePaymentSubmission();
        });
    }
    
    // Real-time validation for inputs
    const nameInput = document.getElementById('customerName');
    const mobileInput = document.getElementById('customerMobile');
    
    if (nameInput) {
        nameInput.addEventListener('input', updatePayButton);
    }
    
    if (mobileInput) {
        mobileInput.addEventListener('input', updatePayButton);
    }
    
    // Initial button state
    updatePayButton();
}

function updatePayButton() {
    const payButton = document.getElementById('payButton');
    const nameInput = document.getElementById('customerName');
    const mobileInput = document.getElementById('customerMobile');
    const acceptTerms = document.getElementById('acceptTerms');
    
    if (payButton) {
        const isFormValid = nameInput.value.trim() && 
                           mobileInput.value.trim() && 
                           selectedTimeSlot && 
                           acceptTerms.checked;
        
        if (isFormValid) {
            payButton.disabled = false;
            payButton.style.cursor = 'pointer';
            payButton.style.opacity = '1';
            payButton.textContent = `Pay ₹${selectedPackage.price}`;
        } else {
            payButton.disabled = true;
            payButton.style.cursor = 'not-allowed';
            payButton.style.opacity = '0.6';
            payButton.textContent = 'Complete Form to Pay';
        }
    }
}

function handlePaymentSubmission() {
    const nameInput = document.getElementById('customerName');
    const mobileInput = document.getElementById('customerMobile');
    const acceptTerms = document.getElementById('acceptTerms');
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Show loading state
    const payButton = document.getElementById('payButton');
    payButton.classList.add('loading');
    payButton.disabled = true;
    
    // Prepare payment data
    const paymentData = {
        name: nameInput.value.trim(),
        mobile: mobileInput.value.trim(),
        timeSlot: selectedTimeSlot,
        package: selectedPackage,
        amount: selectedPackage.price
    };
    
    // Initiate Razorpay payment
    initiateRazorpayPayment(paymentData);
}

function validateForm() {
    const nameInput = document.getElementById('customerName');
    const mobileInput = document.getElementById('customerMobile');
    const acceptTerms = document.getElementById('acceptTerms');
    
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Validate name
    if (!nameInput.value.trim()) {
        showError('nameError', 'Name is required');
        isValid = false;
    }
    
    // Validate mobile
    if (!mobileInput.value.trim()) {
        showError('mobileError', 'Mobile number is required');
        isValid = false;
    } else if (!/^\d{10}$/.test(mobileInput.value.trim())) {
        showError('mobileError', 'Please enter a valid 10-digit mobile number');
        isValid = false;
    }
    
    // Validate time slot
    if (!selectedTimeSlot) {
        showError('timeError', 'Please select a time slot');
        isValid = false;
    }
    
    // Validate terms
    if (!acceptTerms.checked) {
        showError('termsError', 'Please accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = '');
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function initiateRazorpayPayment(paymentData) {
    const amountPaise = Math.round(paymentData.amount * 100);
    
    // Check if Razorpay is loaded
    if (typeof window.Razorpay !== 'function') {
        console.error('Razorpay not loaded');
        showToast('Payment gateway not loaded. Please refresh the page and try again.', 'error');
        resetPayButton();
        return;
    }
    
    const RAZORPAY_KEY = 'rzp_test_RFU56fR6NeZ9T2';
    
    if (!RAZORPAY_KEY || !amountPaise) {
        console.error('Missing Razorpay key or amount');
        showToast('Payment configuration error. Please contact support.', 'error');
        resetPayButton();
        return;
    }
    
    const options = {
        key: RAZORPAY_KEY,
        amount: amountPaise,
        currency: 'INR',
        name: 'KKR Studios',
        description: `Event Booking - ${paymentData.package.title}`,
        prefill: {
            name: paymentData.name,
            contact: paymentData.mobile,
            email: 'customer@example.com'
        },
        theme: { color: '#667eea' },
        handler: function (response) {
            console.log('Payment successful:', response);
            handlePaymentSuccess(response, paymentData);
        },
        modal: {
            ondismiss: function () { 
                console.log('Payment cancelled by user');
                resetPayButton();
            }
        },
        notes: {
            order_id: 'KKR-PAYMENT-' + Date.now(),
            customer_name: paymentData.name,
            customer_mobile: paymentData.mobile,
            time_slot: paymentData.timeSlot,
            package: paymentData.package.title
        }
    };
    
    try {
        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Razorpay initialization error:', error);
        showToast('Payment gateway error: ' + error.message + '. Please try again.', 'error');
        resetPayButton();
    }
}

function handlePaymentSuccess(response, paymentData) {
    // Save payment data to localStorage
    const orderData = {
        id: 'KKR-ORDER-' + Date.now().toString().slice(-8),
        paymentId: response.razorpay_payment_id,
        customer: {
            name: paymentData.name,
            mobile: paymentData.mobile
        },
        booking: {
            timeSlot: paymentData.timeSlot,
            package: paymentData.package
        },
        amount: paymentData.amount,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
        const orders = JSON.parse(localStorage.getItem('app_payment_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('app_payment_orders', JSON.stringify(orders));
    } catch (e) {
        console.error('Failed to save order:', e);
    }
    
    // Show success message
    showToast('Payment successful! Your booking is confirmed.', 'success');
    
    // Redirect to success page or back to home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function resetPayButton() {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.classList.remove('loading');
        payButton.disabled = false;
        payButton.textContent = `Pay ₹${selectedPackage.price}`;
    }
}

function setupHamburgerMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenu = document.getElementById('closeMenu');
    
    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', function() {
            sideMenu.classList.add('open');
            sideMenu.setAttribute('aria-hidden', 'false');
        });
    }
    
    if (closeMenu && sideMenu) {
        closeMenu.addEventListener('click', function() {
            sideMenu.classList.remove('open');
            sideMenu.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Close menu when clicking outside
    if (sideMenu) {
        sideMenu.addEventListener('click', function(e) {
            if (e.target === sideMenu) {
                sideMenu.classList.remove('open');
                sideMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}