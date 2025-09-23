// Booking page functionality for KKR Studios
let selectedService = null;
let totalAmount = 0;

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Booking page loaded');
    
    // Get service data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('serviceId');
    const serviceTitle = urlParams.get('title');
    const servicePrice = urlParams.get('price');
    const serviceDescription = urlParams.get('description');
    const serviceImage = urlParams.get('image');

    console.log('URL Parameters:', {
        serviceId,
        serviceTitle,
        servicePrice,
        serviceDescription,
        serviceImage
    });

    if (serviceId && serviceTitle && servicePrice) {
        selectedService = {
            id: serviceId,
            title: decodeURIComponent(serviceTitle),
            description: serviceDescription ? decodeURIComponent(serviceDescription) : '',
            price: parseFloat(servicePrice),
            image: serviceImage ? decodeURIComponent(serviceImage) : ''
        };
        
        totalAmount = selectedService.price;
        console.log('Selected service:', selectedService);
        displayServiceSummary();
    } else {
        console.log('No service data found, redirecting to ecommerce');
        // If no service data, redirect back to ecommerce
        window.location.href = 'ecommerce.html';
        return;
    }

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const eventDateField = document.getElementById('eventDate');
    if (eventDateField) {
        eventDateField.setAttribute('min', today);
    }

    // Setup form validation
    setupFormValidation();
    
    // Setup form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmission);
        console.log('Form submission handler attached');
    } else {
        console.error('Booking form not found');
    }
    
    // Setup direct button click handler as fallback
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', function(e) {
            console.log('Pay button clicked directly');
            
            // Force enable button if it's disabled
            if (payButton.disabled) {
                console.log('Button was disabled, enabling now');
                ensurePayButtonEnabled();
                return;
            }
            
            if (payButton.type === 'submit') {
                // Let the form submission handle it
                return;
            }
            e.preventDefault();
            handleFormSubmission(e);
        });
        console.log('Pay button click handler attached');
    }
    
    // Setup hamburger menu
    setupHamburgerMenu();
    
    // Ensure pay button is enabled
    ensurePayButtonEnabled();
    
    // Double-check after a short delay
    setTimeout(() => {
        ensurePayButtonEnabled();
    }, 1000);
});

function displayServiceSummary() {
    const serviceItems = document.getElementById('serviceItems');
    const totalPrice = document.getElementById('totalPrice');
    
    if (selectedService) {
        serviceItems.innerHTML = `
            <div class="service-item">
                <div class="service-name">${selectedService.title}</div>
                <div class="service-price">₹${selectedService.price.toFixed(2)}</div>
            </div>
        `;
        totalPrice.textContent = `Total: ₹${totalAmount.toFixed(2)}`;
    }
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error', 'success');
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Pincode validation
    if (field.name === 'pincode' && value) {
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            isValid = false;
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('success');
    } else {
        field.classList.remove('success');
        field.classList.add('error');
    }
    
    return isValid;
}

function validateForm() {
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'deliveryAddress', 'city', 'pincode', 'eventDate'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate terms checkbox
    const acceptTerms = document.getElementById('acceptTerms');
    const termsError = document.getElementById('termsError');
    
    if (!acceptTerms.checked) {
        isValid = false;
        if (termsError) {
            termsError.textContent = 'Please accept the terms and conditions';
        }
    } else {
        if (termsError) {
            termsError.textContent = '';
        }
    }
    
    return isValid;
}

function handleFormSubmission(e) {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!validateForm()) {
        console.log('Form validation failed');
        showToast('Please fill in all required fields correctly', 'error');
        return;
    }
    
    if (!selectedService) {
        console.log('No service selected');
        showToast('No service selected', 'error');
        return;
    }
    
    console.log('Form validation passed, proceeding with payment');
    
    // Show loading state
    const payButton = document.getElementById('payButton');
    if (!payButton) {
        console.error('Pay button not found');
        return;
    }
    
    addLoadingState(payButton);
    
    // Prepare customer details
    const formData = new FormData(document.getElementById('bookingForm'));
    const customerDetails = {
        name: formData.get('customerName'),
        email: formData.get('customerEmail'),
        contact: formData.get('customerPhone')
    };
    
    // Prepare order data
    const orderData = {
        service: selectedService,
        customer: customerDetails,
        deliveryAddress: formData.get('deliveryAddress'),
        city: formData.get('city'),
        pincode: formData.get('pincode'),
        eventDate: formData.get('eventDate'),
        specialInstructions: formData.get('specialInstructions')
    };
    
    // Initiate payment
    initiatePayment(orderData)
        .then(result => {
            removeLoadingState(payButton);
            if (result.success) {
                showToast('Payment successful! Your booking is confirmed.', 'success');
                // Redirect to details page
                setTimeout(() => {
                    window.location.href = 'details.html';
                }, 2000);
            } else {
                showToast('Payment failed. Please try again.', 'error');
            }
        })
        .catch(error => {
            removeLoadingState(payButton);
            console.error('Payment error:', error);
            showToast('Payment error. Please try again.', 'error');
        })
        .finally(() => {
            // Ensure button is always re-enabled
            removeLoadingState(payButton);
        });
}

function initiatePayment(orderData) {
    return new Promise((resolve) => {
        const amountPaise = Math.round(totalAmount * 100);
        
        console.log('Initiating payment for amount:', amountPaise, 'paise');
        console.log('Order data:', orderData);
        
        // Check if Razorpay is loaded
        if (typeof window.Razorpay !== 'function') {
            console.error('Razorpay not loaded, using test mode');
            // For testing purposes, simulate successful payment
            setTimeout(() => {
                console.log('Test payment successful');
                handlePaymentSuccess({ razorpay_payment_id: 'test_payment_' + Date.now() }, orderData);
                resolve({ success: true, paymentId: 'test_payment_' + Date.now() });
            }, 2000);
            return;
        }
        
        const RAZORPAY_KEY = 'rzp_live_RL0aQPFf6qqIj2';
        
        if (!RAZORPAY_KEY || !amountPaise) {
            console.error('Missing Razorpay key or amount');
            showToast('Payment configuration error. Please contact support.', 'error');
            resolve({ success: false });
            return;
        }
        
        const options = {
            key: 0xzDLuJpumd1IytqRBVo76fU
,
            amount: amountPaise,
            currency: 'INR',
            name: 'KKR Studios',
            description: `Booking: ${selectedService.title}`,
            prefill: orderData.customer,
            theme: { color: '#6366f1' },
            handler: function (response) {
                console.log('Payment successful:', response);
                handlePaymentSuccess(response, orderData);
                resolve({ success: true, paymentId: response.razorpay_payment_id });
            },
            modal: {
                ondismiss: function () { 
                    console.log('Payment cancelled by user');
                    resolve({ success: false }); 
                }
            },
            notes: {
                order_id: 'KKR-BOOKING-' + Date.now(),
                customer_email: orderData.customer.email,
                service: selectedService.title
            }
        };
        
        console.log('Razorpay options:', options);
        
        try {
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Razorpay initialization error:', error);
            showToast('Payment gateway error: ' + error.message + '. Please try again.', 'error');
            resolve({ success: false });
        }
    });
}

function handlePaymentSuccess(response, orderData) {
    // Save order to localStorage
    const order = {
        id: 'KKR-BOOKING-' + Date.now().toString().slice(-8),
        paymentId: response.razorpay_payment_id,
        service: orderData.service,
        customer: orderData.customer,
        deliveryAddress: orderData.deliveryAddress,
        city: orderData.city,
        pincode: orderData.pincode,
        eventDate: orderData.eventDate,
        specialInstructions: orderData.specialInstructions,
        total: totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    try {
        const orders = JSON.parse(localStorage.getItem('app_booking_orders') || '[]');
        orders.push(order);
        localStorage.setItem('app_booking_orders', JSON.stringify(orders));
    } catch (e) {
        console.error('Failed to save order:', e);
    }
    
    console.log('Order saved:', order);
}

function goBack() {
    window.location.href = 'ecommerce.html';
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

// UI/UX Enhancement Functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
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

function addLoadingState(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
        element.textContent = 'Processing...';
    }
}

function removeLoadingState(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
        element.textContent = 'Pay Now';
        element.style.cursor = 'pointer';
        element.style.opacity = '1';
    }
}

function ensurePayButtonEnabled() {
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.disabled = false;
        payButton.style.cursor = 'pointer';
        payButton.style.opacity = '1';
        payButton.textContent = 'Pay Now';
        payButton.classList.remove('loading');
        
        // Add a visual indicator that button is ready
        payButton.style.border = '2px solid #10b981';
        payButton.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        
        console.log('Pay button enabled and ready');
    }
}
