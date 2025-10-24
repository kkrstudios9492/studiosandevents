// Mango Mart - Complete Application Bundle
// This file contains all the modules bundled together for direct HTML opening

// ===== UTILITY FUNCTIONS =====
const storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage error:', error);
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage error:', error);
        }
    }
};

const toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.getElementById('toast-container');
        }
    },
    
    show(message, type = 'success', duration = 5000) {
        this.init();
        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                   type === 'error' ? 'x-circle' : 
                   type === 'loading' ? 'loader' : 'info';
        
        toastEl.innerHTML = `
            <i data-lucide="${icon}" class="w-5 h-5 ${type === 'loading' ? 'animate-spin' : ''}"></i>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toastEl);
        initIcons();
        
        if (duration > 0) {
            setTimeout(() => {
                toastEl.remove();
            }, duration);
        }
        
        return toastEl;
    },
    
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    },
    
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },
    
    loading(message) {
        return this.show(message, 'loading', 0);
    },
    
    dismiss(toastEl) {
        if (toastEl && toastEl.parentNode) {
            toastEl.remove();
        }
    }
};

function initIcons() {
    if (window.lucide) {
        try {
            window.lucide.createIcons();
            console.log('✅ Icons initialized successfully');
        } catch (error) {
            console.warn('⚠️ Icon initialization error:', error);
            fallbackIcons();
        }
    } else {
        // Retry if lucide hasn't loaded yet
        console.warn('⚠️ Lucide not yet loaded, retrying...');
        setTimeout(() => {
            if (window.lucide) {
                try {
                    window.lucide.createIcons();
                    console.log('✅ Icons initialized on retry');
                } catch (error) {
                    console.warn('⚠️ Icon initialization error on retry:', error);
                    fallbackIcons();
                }
            } else {
                console.error('❌ Lucide script failed to load');
                // Fallback: Use text-based icons
                fallbackIcons();
            }
        }, 100);
        // Also try fallback immediately
        setTimeout(() => {
            fallbackIcons();
        }, 200);
    }
}

function fallbackIcons() {
    console.log('🔄 Applying fallback icons...');
    // Replace Lucide icons with unicode symbols
    document.querySelectorAll('[data-lucide="menu"]').forEach(el => {
        el.textContent = '☰';
        el.style.fontSize = '24px';
    });
    document.querySelectorAll('[data-lucide="shopping-cart"]').forEach(el => {
        el.textContent = '🛒';
        el.style.fontSize = '24px';
    });
    document.querySelectorAll('[data-lucide="search"]').forEach(el => {
        el.textContent = '🔍';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="x"]').forEach(el => {
        el.textContent = '✕';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="shopping-bag"]').forEach(el => {
        el.textContent = '🛍️';
        el.style.fontSize = '32px';
    });
    document.querySelectorAll('[data-lucide="arrow-left"]').forEach(el => {
        el.textContent = '←';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="package"]').forEach(el => {
        el.textContent = '📦';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="user"]').forEach(el => {
        el.textContent = '👤';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="info"]').forEach(el => {
        el.textContent = 'ℹ️';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="phone"]').forEach(el => {
        el.textContent = '📞';
        el.style.fontSize = '20px';
    });
    document.querySelectorAll('[data-lucide="minus"]').forEach(el => {
        el.textContent = '−';
        el.style.fontSize = '18px';
    });
    document.querySelectorAll('[data-lucide="plus"]').forEach(el => {
        el.textContent = '+';
        el.style.fontSize = '18px';
    });
    console.log('✅ Fallback icons applied');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusClass(status) {
    const statusMap = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'picked-up': 'status-picked-up',
        'out-for-delivery': 'status-out-for-delivery',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <div class="spinner mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading Mango Mart...</p>
                </div>
            </div>
        `;
    }
}

// ===== SAMPLE DATA =====
const sampleProducts = [
    {
        id: 'prod-1',
        name: 'Fresh Mangoes',
        description: 'Sweet and juicy mangoes from the finest orchards',
        price: 120,
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1605027990121-75fd594d6565?w=400',
        stock: 50,
        status: 'in_stock',
        rating: 4.8,
        reviews: 124
    },
    {
        id: 'prod-2',
        name: 'Organic Bananas',
        description: 'Premium organic bananas, perfect for smoothies',
        price: 60,
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
        stock: 75,
        status: 'in_stock',
        rating: 4.6,
        reviews: 89
    },
    {
        id: 'prod-3',
        name: 'Fresh Strawberries',
        description: 'Sweet and fresh strawberries, perfect for desserts',
        price: 150,
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
        stock: 30,
        status: 'in_stock',
        rating: 4.9,
        reviews: 156
    },
    {
        id: 'prod-4',
        name: 'Organic Spinach',
        description: 'Fresh organic spinach leaves, packed with nutrients',
        price: 80,
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
        stock: 40,
        status: 'in_stock',
        rating: 4.7,
        reviews: 67
    },
    {
        id: 'prod-5',
        name: 'Fresh Carrots',
        description: 'Crisp and sweet carrots, great for cooking',
        price: 40,
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
        stock: 60,
        status: 'in_stock',
        rating: 4.5,
        reviews: 92
    },
    {
        id: 'prod-6',
        name: 'Organic Tomatoes',
        description: 'Juicy organic tomatoes, perfect for salads',
        price: 90,
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
        stock: 35,
        status: 'in_stock',
        rating: 4.8,
        reviews: 78
    },
    {
        id: 'prod-7',
        name: 'Blue Ink Pen',
        description: 'Smooth writing ballpoint pen with blue ink',
        price: 25,
        category: 'stationary',
        image: 'https://images.unsplash.com/photo-1583484967954-6fbd0b2a8b8c?w=400',
        stock: 100,
        status: 'in_stock',
        rating: 4.5,
        reviews: 45
    },
    {
        id: 'prod-8',
        name: 'A4 Notebook',
        description: '200 pages ruled notebook for school and office',
        price: 150,
        category: 'stationary',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        stock: 50,
        status: 'in_stock',
        rating: 4.7,
        reviews: 89
    },
    {
        id: 'prod-9',
        name: 'Pencil Set',
        description: 'Set of 12 HB pencils with eraser',
        price: 80,
        category: 'stationary',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        stock: 75,
        status: 'in_stock',
        rating: 4.6,
        reviews: 67
    },
    {
        id: 'prod-10',
        name: 'Stapler',
        description: 'Heavy duty stapler with 1000 staples',
        price: 200,
        category: 'stationary',
        image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
        stock: 30,
        status: 'in_stock',
        rating: 4.8,
        reviews: 34
    },
    {
        id: 'prod-11',
        name: 'Highlighter Set',
        description: 'Set of 6 colorful highlighters',
        price: 120,
        category: 'stationary',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        stock: 40,
        status: 'in_stock',
        rating: 4.4,
        reviews: 56
    }
];

let mainCategories = [
    { 
        id: 'fruits-vegetables', 
        name: 'Fruits & Vegetables', 
        icon: 'apple', 
        color: 'from-green-400 to-emerald-600',
        description: 'Fresh organic produce',
        subcategories: ['fruits', 'vegetables']
    },
    { 
        id: 'grocery', 
        name: 'Grocery', 
        icon: 'shopping-bag', 
        color: 'from-orange-400 to-red-500',
        description: 'Daily essentials & pantry items',
        subcategories: ['dairy', 'bakery', 'pantry']
    },
    { 
        id: 'stationary', 
        name: 'Stationary', 
        icon: 'pen-tool', 
        color: 'from-blue-400 to-purple-600',
        description: 'Office & school supplies',
        subcategories: ['stationary']
    }
];

const sampleCategories = [
    { id: 'fruits', name: 'Fruits', icon: 'apple' },
    { id: 'vegetables', name: 'Vegetables', icon: 'carrot' },
    { id: 'dairy', name: 'Dairy', icon: 'milk' },
    { id: 'bakery', name: 'Bakery', icon: 'bread' },
    { id: 'pantry', name: 'Pantry', icon: 'package' },
    { id: 'stationary', name: 'Stationary', icon: 'pen-tool' }
];

// ===== MOCK DATA STORAGE =====
let mockProducts = [...sampleProducts];
let mockOrders = [];
let mockAgents = [];

// ===== RAZORPAY CONFIGURATION =====
const RAZORPAY_KEY_ID = 'rzp_test_RFU56fR6NeZ9T2';
const RAZORPAY_CONFIG = {
    key: RAZORPAY_KEY_ID,
    currency: 'INR',
    name: 'Mango Mart',
    description: 'Fresh Groceries & More',
    image: 'https://images.unsplash.com/photo-1605027990121-75fd594d6565?w=100',
    theme: {
        color: '#10B981'
    }
};

// Check if Razorpay is loaded
function checkRazorpayAvailability() {
    if (typeof Razorpay === 'undefined') {
        console.warn('Razorpay is not loaded. Payment functionality may not work.');
        return false;
    }
    return true;
}

// Initialize Razorpay check on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!checkRazorpayAvailability()) {
            console.error('Razorpay failed to load. Please check your internet connection.');
        }
    }, 2000);
});

// ===== SUPABASE DATABASE =====
// Supabase configuration
const SUPABASE_URL = 'https://nruafgayqspvluubsvwb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydWFmZ2F5cXNwdmx1dWJzdndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODI1MTcsImV4cCI6MjA3NjQ1ODUxN30.hhnZq-mF24RYW9SfnorFNw-Wl51bK_mfDjQiN2WCNcA';

// Initialize Supabase client
let supabase;
let supabaseReady = false;

async function initSupabase() {
    return new Promise((resolve) => {
        const checkSupabase = () => {
            if (window.supabase && window.supabase.createClient) {
                try {
                    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                    supabaseReady = true;
                    console.log('✅ Supabase client initialized successfully');
                    console.log('📍 Supabase URL:', SUPABASE_URL);
                    resolve(true);
                } catch (error) {
                    console.error('❌ Error initializing Supabase:', error);
                    supabaseReady = false;
                    resolve(false);
                }
            } else {
                console.log('⏳ Waiting for Supabase to load...');
                setTimeout(checkSupabase, 100);
            }
        };
        
        checkSupabase();
        
        // Timeout after 5 seconds
        setTimeout(() => {
            if (!supabaseReady) {
                console.error('❌ Supabase failed to load after 5 seconds');
                resolve(false);
            }
        }, 5000);
    });
}

// Don't load script again if it's already in HTML
if (typeof window !== 'undefined' && !window.supabase) {
    // Load Supabase script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@supabase/supabase-js@2';
    script.async = true;
    script.onerror = () => {
        console.error('❌ Failed to load Supabase script');
    };
    document.head.appendChild(script);
}

// Debug function to check Supabase status
function debugSupabaseStatus() {
    console.log('Supabase Status:', {
        supabase: !!supabase,
        supabaseReady: supabaseReady,
        windowSupabase: !!window.supabase
    });
}
// Database service functions
const db = {
    // Users
    async createUser(userData) {
        console.log('Creating user with data:', userData);
        debugSupabaseStatus();
        
        // Wait for Supabase to be ready
        if (!supabaseReady) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        if (!supabase) {
            // Fallback to localStorage
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const newUser = { ...userData, id: 'user_' + Date.now() };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            console.log('User created in localStorage:', newUser);
            return { data: newUser, error: null };
        }
        
        try {
            console.log('Attempting to create user in Supabase...');
            // Clean user data to match database schema
            const cleanUserData = {
                name: userData.name,
                email: userData.email || null,
                mobile: userData.mobile || null,
                password: userData.password,
                role: userData.role || 'customer'
            };
            
            const { data, error } = await supabase
                .from('users')
                .insert([cleanUserData])
                .select()
                .single();
            
            if (error) {
                console.error('Supabase createUser error:', error);
                // Fallback to localStorage
                const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const newUser = { ...userData, id: 'user_' + Date.now() };
                existingUsers.push(newUser);
                localStorage.setItem('users', JSON.stringify(existingUsers));
                console.log('User created in localStorage (fallback):', newUser);
                return { data: newUser, error: null };
            }
            
            console.log('User created in Supabase:', data);
            return { data, error };
        } catch (err) {
            console.error('Supabase createUser exception:', err);
            // Fallback to localStorage
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const newUser = { ...userData, id: 'user_' + Date.now() };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            console.log('User created in localStorage (fallback):', newUser);
            return { data: newUser, error: null };
        }
    },

    async getUserById(id) {
        if (!supabase) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.id === id);
            return { data: user, error: null };
        }
        
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        return { data, error };
    },

    async getUserByEmail(email) {
        console.log('Getting user by email:', email);
        
        // Wait for Supabase to be ready
        if (!supabaseReady) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        if (!supabase) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);
            console.log('Found user by email (localStorage):', user);
            return { data: user, error: null };
        }
        
        try {
            console.log('Attempting to get user by email from Supabase...');
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully
            
            if (error) {
                console.error('Supabase getUserByEmail error:', error);
                // Fallback to localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);
                console.log('Found user by email (localStorage fallback):', user);
                return { data: user, error: null };
            }
            
            console.log('Found user by email (Supabase):', data);
            return { data, error };
        } catch (err) {
            console.error('Supabase getUserByEmail exception:', err);
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email);
            console.log('Found user by email (localStorage fallback):', user);
            return { data: user, error: null };
        }
    },

    async getUserByMobile(mobile) {
        console.log('Getting user by mobile:', mobile);
        
        // Wait for Supabase to be ready
        if (!supabaseReady) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        if (!supabase) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.mobile === mobile);
            console.log('Found user by mobile (localStorage):', user);
            return { data: user, error: null };
        }
        
        try {
            console.log('Attempting to get user by mobile from Supabase...');
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('mobile', mobile)
                .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully
            
            if (error) {
                console.error('Supabase getUserByMobile error:', error);
                // Fallback to localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.mobile === mobile);
                console.log('Found user by mobile (localStorage fallback):', user);
                return { data: user, error: null };
            }
            
            console.log('Found user by mobile (Supabase):', data);
            return { data, error };
        } catch (err) {
            console.error('Supabase getUserByMobile exception:', err);
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.mobile === mobile);
            console.log('Found user by mobile (localStorage fallback):', user);
            return { data: user, error: null };
        }
    },

    // Orders
    async createOrder(orderData) {
        console.log('=== DB.CREATEORDER ===');
        console.log('Supabase available:', !!supabase);
        console.log('Order data to insert:', orderData);
        
        if (!supabase) {
            console.log('Supabase not available, using localStorage fallback');
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            existingOrders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(existingOrders));
            return { data: orderData, error: null };
        }
        
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();
            
            console.log('Supabase insert result:', { data, error });
            return { data, error };
        } catch (err) {
            console.error('Supabase insert error:', err);
            return { data: null, error: err };
        }
    },

    async getUserOrders(userId, userEmail) {
        if (!supabase) {
            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const userOrders = allOrders.filter(order => 
                order.customerId === userId || 
                order.customerEmail === userEmail ||
                order.customerMobile === userEmail
            );
            return { data: userOrders, error: null };
        }
        
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .or(`customerId.eq.${userId},customerEmail.eq.${userEmail},customerMobile.eq.${userEmail}`)
            .order('created_at', { ascending: false });
        return { data, error };
    },

    // User Cart Management
    async getUserCart(userId) {
        if (!supabase || !userId) {
            return { data: [], error: null };
        }
        
        // Validate that userId is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(userId).trim())) {
            console.warn('Skipping cart query: Invalid user ID format:', userId);
            return { data: [], error: null }; // Return empty cart for invalid user IDs
        }
        
        try {
            const { data, error } = await supabase
                .from('user_carts')
                .select('*')
                .eq('user_id', userId);
            
            if (error) {
                console.error('Error fetching user cart from Supabase:', error);
                return { data: [], error: null }; // Return empty cart on error
            }
            
            return { data: data || [], error: null };
        } catch (err) {
            console.error('Exception fetching user cart:', err);
            return { data: [], error: null }; // Return empty cart on error
        }
    },

    async addToUserCart(userId, product) {
        if (!supabase || !userId) {
            return { data: null, error: null };
        }
        
        // Validate that userId is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(userId).trim())) {
            console.warn('Skipping cart operation: Invalid user ID format:', userId);
            return { data: null, error: null }; // Skip cart operations for invalid user IDs
        }
        
        try {
            // First check if item already exists
            const { data: existingItem, error: checkError } = await supabase
                .from('user_carts')
                .select('*')
                .eq('user_id', userId)
                .eq('product_id', product.id)
                .single();
            
            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
                return { data: null, error: null };
            }
            
            if (existingItem) {
                // Update quantity if item exists - use ID to avoid RLS issues
                const { data, error } = await supabase
                    .from('user_carts')
                    .update({ quantity: existingItem.quantity + 1 })
                    .eq('id', existingItem.id)
                    .select('*');
                
                return { data, error };
            } else {
                // Insert new cart item
                const { data, error } = await supabase
                    .from('user_carts')
                    .insert([{
                        user_id: userId,
                        product_id: product.id,
                        product_name: product.name,
                        product_price: product.price,
                        product_image: product.image,
                        quantity: 1
                    }])
                    .select('*');
                
                return { data, error };
            }
        } catch (err) {
            console.error('Exception adding to cart:', err);
            return { data: null, error: null };
        }
    },

    async updateUserCartItem(userId, productId, quantity) {
        if (!supabase || !userId) {
            return { data: null, error: null };
        }
        
        // Validate that userId is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(userId).trim())) {
            console.warn('Skipping cart operation: Invalid user ID format:', userId);
            return { data: null, error: null }; // Skip cart operations for invalid user IDs
        }
        
        try {
            try {
                // First, try to find the cart item
                const { data: cartItems, error: fetchError } = await supabase
                    .from('user_carts')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('product_id', productId);
                
                if (fetchError) throw fetchError;
                
                if (!cartItems || cartItems.length === 0) {
                    return { data: null, error: null };
                }
                
                const cartItem = cartItems[0];
                
                // Delete or update based on quantity
                if (quantity <= 0) {
                    const { error } = await supabase
                        .from('user_carts')
                        .delete()
                        .eq('id', cartItem.id);
                    return { data: null, error };
                } else {
                    const { data, error } = await supabase
                        .from('user_carts')
                        .update({ quantity })
                        .eq('id', cartItem.id)
                        .select('*');
                    return { data, error };
                }
            } catch (innerError) {
                console.error('Cart update error:', innerError);
                throw innerError;
            }
        } catch (err) {
            console.error('Exception updating cart item:', err);
            return { data: null, error: null };
        }
    },

    async clearUserCart(userId) {
        if (!supabase || !userId) {
            return { data: [], error: null };
        }
        
        // Validate that userId is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(userId).trim())) {
            console.warn('Skipping cart operation: Invalid user ID format:', userId);
            return { data: [], error: null }; // Skip cart operations for invalid user IDs
        }
        
        try {
            const { error } = await supabase
                .from('user_carts')
                .delete()
                .eq('user_id', userId);
            return { data: [], error };
        } catch (err) {
            console.error('Exception clearing cart:', err);
            return { data: [], error: null };
        }
    },

    // User Profile Management
    async getUserProfile(userId) {
        if (!supabase) {
            const profile = JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}');
            return { data: profile, error: null };
        }
        
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        return { data, error };
    },

    async updateUserProfile(userId, profileData) {
        if (!supabase) {
            localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
            return { data: profileData, error: null };
        }
        
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({
                user_id: userId,
                ...profileData
            })
            .select()
            .single();
        return { data, error };
    },

    // Categories Management
    async getCategories() {
        if (!supabase) {
            return { data: sampleCategories, error: null };
        }
        
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });
        return { data, error };
    },

    async createCategory(categoryData) {
        if (!supabase) {
            const newCategory = { ...categoryData, id: 'cat_' + Date.now() };
            sampleCategories.push(newCategory);
            return { data: newCategory, error: null };
        }
        
        const { data, error } = await supabase
            .from('categories')
            .insert([categoryData])
            .select()
            .single();
        return { data, error };
    },

    async updateOrderStatus(orderId, status) {
        if (!supabase) {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = status;
                localStorage.setItem('orders', JSON.stringify(orders));
            }
            return { data: orders[orderIndex], error: null };
        }
        
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select()
            .single();
        return { data, error };
    },

    // Products
    async getProducts() {
        if (!supabase) {
            return { data: mockProducts, error: null };
        }
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .order('createdAt', { ascending: false });
        return { data, error };
    },

    async createProduct(productData) {
        if (!supabase) {
            const newProduct = { ...productData, id: 'prod_' + Date.now() };
            mockProducts.push(newProduct);
            return { data: newProduct, error: null };
        }
        
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();
        return { data, error };
    },

    async updateProduct(id, productData) {
        if (!supabase) {
            const productIndex = mockProducts.findIndex(p => p.id === id);
            if (productIndex !== -1) {
                mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
            }
            return { data: mockProducts[productIndex], error: null };
        }
        
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    }
};

// ===== API CLIENT =====
// Sync existing mockOrders to localStorage on startup
function syncMockOrdersToLocalStorage() {
    const localStorageOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const mockOrderIds = mockOrders.map(order => order.id);
    const newMockOrders = mockOrders.filter(order => 
        !localStorageOrders.some(localOrder => localOrder.id === order.id)
    );
    
    if (newMockOrders.length > 0) {
        const updatedOrders = [...localStorageOrders, ...newMockOrders];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        console.log(`Synced ${newMockOrders.length} mock orders to localStorage`);
    }
}

// Initialize sync on page load
syncMockOrdersToLocalStorage();

async function apiCall(endpoint, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const method = options.method || 'GET';
    
    try {
        if (endpoint === '/products' && method === 'GET') {
            return { products: mockProducts };
        }
        
        if (endpoint.startsWith('/products/') && method === 'GET') {
            const id = endpoint.split('/')[2];
            const product = mockProducts.find(p => p.id === id);
            if (!product) throw new Error('Product not found');
            return { product };
        }
        
        if (endpoint === '/products' && method === 'POST') {
            const product = { ...JSON.parse(options.body), id: `prod-${Date.now()}` };
            mockProducts.push(product);
            return { product };
        }
        
        if (endpoint.startsWith('/products/') && method === 'PUT') {
            const id = endpoint.split('/')[2];
            const index = mockProducts.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Product not found');
            mockProducts[index] = { ...mockProducts[index], ...JSON.parse(options.body) };
            return { product: mockProducts[index] };
        }
        
        if (endpoint.startsWith('/products/') && method === 'DELETE') {
            const id = endpoint.split('/')[2];
            const index = mockProducts.findIndex(p => p.id === id);
            if (index === -1) throw new Error('Product not found');
            mockProducts.splice(index, 1);
            return { success: true };
        }
        
        if (endpoint === '/orders' && method === 'GET') {
            // Read from localStorage to get all orders (both API and Razorpay)
            const localStorageOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const allOrders = [...mockOrders, ...localStorageOrders];
            return { orders: allOrders };
        }
        
        if (endpoint === '/orders' && method === 'POST') {
            const order = { ...JSON.parse(options.body), id: `order-${Date.now()}` };
            mockOrders.push(order);
            
            // Also save to localStorage for consistency
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            existingOrders.push(order);
            localStorage.setItem('orders', JSON.stringify(existingOrders));
            
            // Dispatch custom event for order creation
            window.dispatchEvent(new CustomEvent('orderCreated', { detail: order }));
            
            return { order };
        }
        
        if (endpoint.startsWith('/orders/') && endpoint.endsWith('/status') && method === 'PUT') {
            const id = endpoint.split('/')[2];
            const order = mockOrders.find(o => o.id === id);
            if (!order) throw new Error('Order not found');
            order.status = JSON.parse(options.body).status;
            return { order };
        }
        
        if (endpoint === '/agents' && method === 'GET') {
            return { agents: mockAgents };
        }
        
        if (endpoint === '/agents' && method === 'POST') {
            const agent = { ...JSON.parse(options.body), id: `agent-${Date.now()}` };
            mockAgents.push(agent);
            return { agent };
        }
        
        throw new Error('Endpoint not found');
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

const api = {
    async getProducts() {
        return await apiCall('/products', { method: 'GET' });
    },
    async createProduct(product, token) {
        return await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(product)
        });
    },
    async updateProduct(id, product, token) {
        return await apiCall(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product)
        });
    },
    async deleteProduct(id, token) {
        return await apiCall(`/products/${id}`, { method: 'DELETE' });
    },
    async getOrders(token) {
        return await apiCall('/orders', { method: 'GET' });
    },
    async createOrder(order, token) {
        return await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(order)
        });
    },
    async updateOrderStatus(id, status, token) {
        return await apiCall(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    },
    async getAgents(token) {
        return await apiCall('/agents', { method: 'GET' });
    },
    async createAgent(agent, token) {
        return await apiCall('/agents', {
            method: 'POST',
            body: JSON.stringify(agent)
        });
    }
};
// ===== AUTHENTICATION =====
class AuthManager {
    constructor() {
        this.session = null;
        this.user = null;
        this.onAuthChange = null;
    }

    async init(onAuthChange) {
        // Skip initialization on orders page
        if (window.ORDERS_PAGE) {
            console.log('Skipping AuthManager initialization on orders page');
            return;
        }
        
        this.onAuthChange = onAuthChange;
        
        try {
            const session = storage.get('session');
            if (session) {
                this.session = session;
                this.user = session.user;
                if (this.onAuthChange) {
                    this.onAuthChange(true, session.user.role || 'customer');
                }
            } else {
                this.renderAuthPage();
            }
        } catch (error) {
            console.error('Session check error:', error);
            this.renderAuthPage();
        }
    }

    // Register new user
    async register(userData) {
        const { name, email, mobile, password } = userData;
        
        // Validate required fields
        if (!name || !password) {
            throw new Error('Name and password are required');
        }

        // Validate email format if provided
        if (email && !isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Validate mobile format if provided
        if (mobile && !/^[6-9]\d{9}$/.test(mobile)) {
            throw new Error('Please enter a valid 10-digit mobile number');
        }

        // Check if user already exists
        let userExists = null;
        
        if (email && email.trim() !== '') {
            const { data: existingUser } = await db.getUserByEmail(email);
            userExists = existingUser;
        }
        if (mobile && mobile.trim() !== '' && !userExists) {
            const { data: existingUser } = await db.getUserByMobile(mobile);
            userExists = existingUser;
        }

        if (userExists) {
            throw new Error('Email/mobile already registered successfully! Please login instead.');
        }

        // Create new user
        // Check if this is an admin email
        const isAdminEmail = email === 'varunraj173205@gmail.com';
        
        const newUser = {
            name,
            email: email || '',
            mobile: mobile || '',
            password: this.hashPassword(password),
            role: isAdminEmail ? 'admin' : 'customer',
            createdAt: new Date().toISOString()
        };
        
        console.log('Creating user with role:', newUser.role);

        // Save user to database
        const { data, error } = await db.createUser(newUser);
        if (error) {
            throw new Error('Failed to create user: ' + error.message);
        }

        // Auto-login after registration
        this.login(email || mobile, password);
        
        return data;
    }

    // Login user with email or mobile
    async login(identifier, password) {
        let user = null;
        
        // First check if it's a delivery agent
        const deliveryAgent = await this.checkDeliveryAgent(identifier, password);
        if (deliveryAgent) {
            return this.session;
        }
        
        // Try to find user by email first, then mobile
        if (isValidEmail(identifier)) {
            const { data } = await db.getUserByEmail(identifier);
            user = data;
        } else {
            const { data } = await db.getUserByMobile(identifier);
            user = data;
        }

        if (!user) {
            throw new Error('User not found');
        }

        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Invalid password');
        }

        // Create session
        this.session = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role || 'customer'
            },
            token: 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            loginTime: new Date().toISOString()
        };
        
        console.log('User logged in with role:', user.role);
        console.log('Session user role:', this.session.user.role);

        this.saveSession();
        return this.session;
    }

    // Check if identifier is a delivery agent
    async checkDeliveryAgent(identifier, password) {
        try {
            console.log('Checking delivery agent:', identifier);
            if (!supabase || !supabaseReady) {
                console.log('Supabase not ready');
                return null;
            }

            // Try to find delivery agent by agent_id, email, or mobile
            let query = supabase
                .from('delivery_agents')
                .select('*')
                .eq('status', 'active');
            
            // Check if identifier is email or mobile, otherwise treat as agent_id
            if (isValidEmail(identifier)) {
                console.log('Looking up by email:', identifier);
                query = query.eq('email', identifier);
            } else if (identifier.match(/^\d{10}$/)) {
                console.log('Looking up by mobile:', identifier);
                query = query.eq('mobile', identifier);
            } else {
                console.log('Looking up by agent_id:', identifier);
                query = query.eq('agent_id', identifier);
            }
            
            const { data: agent, error } = await query.single();
            console.log('Delivery agent query result:', { agent, error });
            
            if (error || !agent) {
                return null;
            }
            
            // Verify password
            if (agent.password !== btoa(password + 'mango_mart_salt')) {
                return null;
            }
            
            // Create delivery agent session
            this.session = {
                user: {
                    id: agent.id,
                    name: agent.name,
                    email: agent.email,
                    mobile: agent.mobile,
                    role: 'delivery',
                    agent_id: agent.agent_id
                },
                token: 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                loginTime: new Date().toISOString()
            };
            
            console.log('Delivery agent logged in:', this.session.user);
            this.saveSession();
            console.log('Delivery agent session saved');
            return this.session;
            
        } catch (error) {
            console.error('Delivery agent check error:', error);
            return null;
        }
    }

    saveSession() {
        if (this.session) {
            storage.set('session', this.session);
            this.user = this.session.user;
        }
    }

    // Hash password (simple hash for demo)
    hashPassword(password) {
        return btoa(password + 'mango_mart_salt');
    }

    // Verify password
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    // Get user's orders only
    async getUserOrders() {
        if (!this.session) return [];
        
        const { data, error } = await db.getUserOrders(this.session.user.id, this.session.user.email);
        if (error) {
            console.error('Error fetching user orders:', error);
            return [];
        }
        return data || [];
    }

    // Save order for current user
    async saveUserOrder(orderData) {
        console.log('=== SAVING USER ORDER ===');
        console.log('Session:', this.session);
        console.log('Order data:', orderData);
        
        if (!this.session) {
            throw new Error('User not logged in');
        }

        const userOrder = {
            id: orderData.id,
            customer_id: this.session.user.id,
            customer_name: this.session.user.name,
            customer_email: this.session.user.email,
            customer_mobile: this.session.user.mobile,
            customer_address: orderData.customerAddress,
            customer_landmark: orderData.customerLandmark,
            customer_pincode: orderData.customerPincode,
            items: orderData.items,
            total_amount: orderData.totalAmount,
            status: orderData.status,
            payment_status: orderData.paymentStatus,
            payment_id: orderData.paymentId,
            payment_signature: orderData.paymentSignature,
            razorpay_order_id: orderData.razorpayOrderId,
            created_at: orderData.createdAt,
            paid_at: orderData.paidAt
        };

        console.log('User order to save:', userOrder);
        console.log('Supabase status:', { supabase: !!supabase, supabaseReady });

        const { data, error } = await db.createOrder(userOrder);
        console.log('Create order result:', { data, error });
        
        if (error) {
            console.error('Failed to save order to Supabase:', error);
            throw new Error('Failed to save order: ' + error.message);
        }

        console.log('Order saved successfully to Supabase:', data);

        // Dispatch event for order creation
        window.dispatchEvent(new CustomEvent('orderCreated', { detail: data }));
        
        return data;
    }

    // User Cart Management
    async getUserCart(userId) {
        if (!this.session) return { data: [], error: null };
        
        const result = await db.getUserCart(userId);
        if (result.error) {
            console.error('Error fetching user cart:', result.error);
            return { data: [], error: result.error };
        }
        return { data: result.data || [], error: null };
    }

    async addToUserCart(userId, product) {
        if (!this.session) {
            throw new Error('User not logged in');
        }

        const { data, error } = await db.addToUserCart(userId, product);
        if (error) {
            throw new Error('Failed to add to cart: ' + error.message);
        }
        return { data, error };
    }

    async updateUserCartItem(userId, productId, quantity) {
        if (!this.session) {
            throw new Error('User not logged in');
        }

        const { data, error } = await db.updateUserCartItem(userId, productId, quantity);
        if (error) {
            throw new Error('Failed to update cart item: ' + error.message);
        }
        return { data, error };
    }

    async clearUserCart(userId) {
        if (!this.session) {
            throw new Error('User not logged in');
        }

        const { data, error } = await db.clearUserCart(userId);
        if (error) {
            throw new Error('Failed to clear cart: ' + error.message);
        }
        return { data, error };
    }

    // User Profile Management
    async getUserProfile() {
        if (!this.session) return {};
        
        const { data, error } = await db.getUserProfile(this.session.user.id);
        if (error) {
            console.error('Error fetching user profile:', error);
            return {};
        }
        return data || {};
    }

    async updateUserProfile(profileData) {
        if (!this.session) {
            throw new Error('User not logged in');
        }

        const { data, error } = await db.updateUserProfile(this.session.user.id, profileData);
        if (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
        return data;
    }

    async signUp(email, password, name, role) {
        try {
            // Use new registration system
            const userData = {
                name: name,
                email: email,
                password: password
            };
            
            const newUser = await this.register(userData);
            toast.success('Account created successfully! You are now logged in.');
            return { success: true, user: newUser };
        } catch (error) {
            throw error;
        }
    }

    async signIn(email, password) {
        try {
            // Use new login system
            const session = await this.login(email, password);
            toast.success(`Welcome back, ${session.user.name}!`);
            
            // Don't call onAuthChange here - let the form handler do it
            // This prevents double redirects
            console.log('Login successful, role:', session.user.role);

            return { role: session.user.role };
        } catch (error) {
            throw error;
        }
    }

    async signOut() {
        try {
            this.session = null;
            this.user = null;
            storage.remove('session');
            
            if (this.onAuthChange) {
                this.onAuthChange(false, null);
            }
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    getToken() {
        return this.session?.access_token || storage.get('session')?.access_token;
    }

    getUser() {
        return this.user || storage.get('session')?.user;
    }

    getUserRole() {
        const user = this.getUser();
        console.log('Getting user role for user:', user);
        // Check both user.role and user.user_metadata.role
        const role = user?.role || user?.user_metadata?.role || 'customer';
        console.log('User role:', role);
        return role;
    }

    renderAuthPage() {
        const app = document.getElementById('app');
        if (!app) {
            console.error('App element not found');
            return;
        }
        app.innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
                <div class="w-full max-w-md">
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full mb-4">
                            <i data-lucide="shopping-bag" class="w-8 h-8 text-white"></i>
                        </div>
                        <h1 class="text-3xl font-bold text-gray-900">Mango Mart</h1>
                        <p class="text-gray-600 mt-2">Fresh groceries delivered to your doorstep</p>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-8">
                        <div class="flex border-b mb-6">
                            <button id="signin-tab" class="flex-1 py-2 border-b-2 border-emerald-600 font-medium text-emerald-600">
                                Sign In
                            </button>
                            <button id="signup-tab" class="flex-1 py-2 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700">
                                Sign Up
                            </button>
                        </div>

                        <form id="signin-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
                                <input type="text" id="signin-identifier" required 
                                    class="input" placeholder="Enter your email or mobile number">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" id="signin-password" required 
                                    class="input" placeholder="••••••••">
                            </div>
                            <button type="submit" class="w-full btn btn-primary">
                                Sign In
                            </button>
                        </form>

                        <form id="signup-form" class="space-y-4 hidden">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="signup-name" required 
                                    class="input" placeholder="Enter your name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
                                <input type="text" id="signup-contact" required
                                    class="input" placeholder="Enter your email or mobile number">
                                <p class="text-xs text-gray-500 mt-1">Enter your email address or 10-digit mobile number</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" id="signup-password" required 
                                    class="input" placeholder="••••••••" minlength="6">
                            </div>
<button type="submit" class="w-full btn btn-primary">
                                Create Account
                            </button>
                        </form>

                        
                    </div>
                </div>
            </div>
        `;

        initIcons();
        this.attachAuthHandlers();
    }

    attachAuthHandlers() {
        const signinTab = document.getElementById('signin-tab');
        const signupTab = document.getElementById('signup-tab');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');

        signinTab.addEventListener('click', () => {
            signinTab.classList.add('border-emerald-600', 'text-emerald-600');
            signinTab.classList.remove('border-transparent', 'text-gray-500');
            signupTab.classList.remove('border-emerald-600', 'text-emerald-600');
            signupTab.classList.add('border-transparent', 'text-gray-500');
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        });

        signupTab.addEventListener('click', () => {
            signupTab.classList.add('border-emerald-600', 'text-emerald-600');
            signupTab.classList.remove('border-transparent', 'text-gray-500');
            signinTab.classList.remove('border-emerald-600', 'text-emerald-600');
            signinTab.classList.add('border-transparent', 'text-gray-500');
            signupForm.classList.remove('hidden');
            signinForm.classList.add('hidden');
        });

        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = document.getElementById('signin-identifier').value;
            const password = document.getElementById('signin-password').value;

            const loadingToast = toast.loading('Signing in...');
            try {
                await this.signIn(identifier, password);
                toast.dismiss(loadingToast);
                toast.success('Login successful! Redirecting to shopping...');
                
                // Redirect based on actual user role
                setTimeout(() => {
                    if (this.onAuthChange) {
                        const session = JSON.parse(localStorage.getItem('session') || 'null');
                        const role = session?.user?.role || 'customer';
                        console.log('Redirecting with role:', role);
                        this.onAuthChange(true, role);
                    }
                }, 1500);
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error(error.message || 'Failed to sign in');
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const contact = document.getElementById('signup-contact').value.trim();
            const password = document.getElementById('signup-password').value;
            const role = 'customer'; // Default role since account type selector was removed

            // Determine if contact is email or mobile
            let email = '';
            let mobile = '';
            
            console.log('Contact input:', contact);
            console.log('Is valid email:', isValidEmail(contact));
            console.log('Is valid mobile:', /^[6-9]\d{9}$/.test(contact));
            
            if (isValidEmail(contact)) {
                email = contact;
                console.log('Detected as email:', email);
            } else if (/^[6-9]\d{9}$/.test(contact)) {
                mobile = contact;
                console.log('Detected as mobile:', mobile);
            } else {
                toast.error('Please enter a valid email address or 10-digit mobile number');
                return;
            }

            if (password.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }

            const loadingToast = toast.loading('Creating account...');
            try {
                const userData = {
                    name,
                    email,
                    mobile,
                    password
                };
                
                await this.register(userData);
                toast.dismiss(loadingToast);
                toast.success('Account created successfully! Redirecting to shopping...');
                
                // Redirect based on actual user role
                setTimeout(() => {
                    if (this.onAuthChange) {
                        const session = JSON.parse(localStorage.getItem('session') || 'null');
                        const role = session?.user?.role || 'customer';
                        console.log('Redirecting with role:', role);
                        this.onAuthChange(true, role);
                    }
                }, 1500);
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error(error.message || 'Failed to create account');
                
                // If user already exists, switch to login tab and pre-fill the contact field
                if (error.message && error.message.includes('already registered')) {
                    // Switch to login tab
                    const signinTab = document.getElementById('signin-tab');
                    const signupTab = document.getElementById('signup-tab');
                    const signinForm = document.getElementById('signin-form');
                    const signupForm = document.getElementById('signup-form');
                    
                    if (signinTab && signupTab && signinForm && signupForm) {
                        signinTab.classList.add('border-emerald-600', 'text-emerald-600');
                        signinTab.classList.remove('border-transparent', 'text-gray-500');
                        signupTab.classList.remove('border-emerald-600', 'text-emerald-600');
                        signupTab.classList.add('border-transparent', 'text-gray-500');
                        signinForm.classList.remove('hidden');
                        signupForm.classList.add('hidden');
                        
                        // Pre-fill the login form with the contact info
                        const signinIdentifier = document.getElementById('signin-identifier');
                        if (signinIdentifier) {
                            signinIdentifier.value = contact;
                        }
                    }
                }
            }
        });
    }
}
// ===== CUSTOMER DASHBOARD =====
class CustomerDashboard {
    constructor(authManager) {
        this.authManager = authManager;
        this.products = [];
        this.cart = [];
        this.orders = [];
        this.selectedCategory = null;
        this.searchQuery = '';
        this.activeTab = 'home';
        this.currentView = 'home'; // 'home' or 'category'
        this.currentMainCategory = null;
        this.searchTimeout = null; // For debouncing search
        
        this.loadCart();
        this.initializeSampleOrders();
    }

    async init() {
        // Load data and render (Auth already initialized by MangoMartApp)
        await this.loadData();
        this.render();
    }

    initializeSampleOrders() {
        const existingOrders = storage.get('orders');
        if (!existingOrders || existingOrders.length === 0) {
            const sampleOrders = [
                {
                    id: 'ORD001',
                    customerId: 'customer1',
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    items: [
                        { id: '1', name: 'Fresh Mangoes', price: 120, quantity: 2, image: 'https://images.unsplash.com/photo-1605027990121-1b5a3b3b3b3b?w=400' },
                        { id: '2', name: 'Bananas', price: 60, quantity: 1, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b9e5?w=400' }
                    ],
                    total: 300,
                    status: 'pending',
                    paymentMethod: 'Credit Card',
                    deliveryAddress: '123 Main St, City, State',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'ORD002',
                    customerId: 'customer1',
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    items: [
                        { id: '4', name: 'Rice (1kg)', price: 45, quantity: 2, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
                        { id: '5', name: 'Lentils (500g)', price: 80, quantity: 1, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
                    ],
                    total: 170,
                    status: 'delivered',
                    paymentMethod: 'Cash on Delivery',
                    deliveryAddress: '123 Main St, City, State',
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                    updatedAt: new Date(Date.now() - 172800000).toISOString()
                },
                {
                    id: 'ORD003',
                    customerId: 'customer1',
                    customerName: 'John Doe',
                    customerEmail: 'john@example.com',
                    items: [
                        { id: '6', name: 'Notebook', price: 25, quantity: 3, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
                        { id: '7', name: 'Pen Set', price: 50, quantity: 1, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' }
                    ],
                    total: 125,
                    status: 'out_for_delivery',
                    paymentMethod: 'UPI',
                    deliveryAddress: '123 Main St, City, State',
                    createdAt: new Date(Date.now() - 259200000).toISOString(),
                    updatedAt: new Date(Date.now() - 259200000).toISOString()
                }
            ];
            storage.set('orders', sampleOrders);
        }
    }

    async loadData() {
        try {
            // Load products directly from Supabase
            if (supabase && supabaseReady) {
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (productsError) {
                    console.error('Error loading products from Supabase:', productsError);
                    this.products = [];
                } else {
                    this.products = productsData || [];
                    console.log('Products loaded from Supabase:', this.products.length);
                }
            } else {
                // Fallback to API if Supabase not ready
                const productsRes = await api.getProducts();
                this.products = productsRes.products || [];
                console.log('Products loaded from API:', this.products.length);
            }
            
            // Load orders
            const token = this.authManager.getToken();
            const ordersRes = await api.getOrders(token);
            this.orders = ordersRes.orders || [];
            
            // Load user's cart from Supabase
            await this.loadUserCart();
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        }
    }

    loadCart() {
        this.cart = storage.get('cart') || [];
        // Clean up any corrupted cart items
        this.cart = this.cart.filter(item => 
            item && 
            item.id && 
            item.name && 
            typeof item.price === 'number' && 
            typeof item.quantity === 'number' &&
            item.quantity > 0
        );
        this.saveCart();
    }

    saveCart() {
        storage.set('cart', this.cart);
    }

    getFilteredProducts() {
        let filtered = [...this.products];
        
        // If we're on a category page, filter by main category first
        if (this.currentView === 'category' && this.currentMainCategory) {
            const mainCategory = mainCategories.find(cat => cat.id === this.currentMainCategory);
            if (mainCategory) {
                // Check both category and subcategory fields for compatibility
                filtered = filtered.filter(p => {
                    const productCategory = p.subcategory || p.category;
                    return mainCategory.subcategories.includes(productCategory);
                });
            }
        }
        
        // Then filter by selected subcategory
        if (this.selectedCategory) {
            filtered = filtered.filter(p => {
                const productCategory = p.subcategory || p.category;
                return productCategory === this.selectedCategory;
            });
        }
        
        // Finally filter by search query
        if (this.searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
        
        return filtered;
    }

    getSearchResults() {
        if (!this.searchQuery) return [];
        
        return this.products.filter(p => {
            const productCategory = p.subcategory || p.category;
            return p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                productCategory.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
    }

    getRelevantProducts() {
        if (!this.searchQuery) return [];
        
        const searchResults = this.getSearchResults();
        const searchResultCategories = [...new Set(searchResults.map(p => p.category))];
        
        // Get products from the same categories as search results, excluding exact matches
        return this.products.filter(p => 
            searchResultCategories.includes(p.category) && 
            !searchResults.some(result => result.id === p.id)
        ).slice(0, 8); // Limit to 8 relevant products
    }

    async addToCart(product) {
        // Check if product is out of stock (check both field names)
        const stock = product.stock_quantity !== undefined ? product.stock_quantity : product.stock;
        if (stock === 0 || product.status === 'out_of_stock') {
            toast.error('This product is out of stock and cannot be ordered');
            return;
        }

        // Get current user
        const currentUser = this.authManager.getUser();
        
        if (!currentUser) {
            toast.error('Please login to add items to cart');
            return;
        }

        // Get user ID from the user object
        const userId = currentUser.id || currentUser.user_metadata?.id;
        if (!userId) {
            console.error('User ID not found in user object:', currentUser);
            toast.error('User session error. Please login again.');
            return;
        }

        // Validate user ID is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(String(userId).trim())) {
            toast.error('Invalid user session. Please login again.');
            return;
        }

        // Ensure product has all required properties
        const cartProduct = {
            id: product.id,
            name: product.name || 'Unknown Product',
            price: product.price || 0,
            image: product.image || 'https://via.placeholder.com/400x300?text=No+Image',
            description: product.description || '',
            category: product.category || 'general',
            stock: product.stock || 0,
            status: product.status || 'in_stock',
            quantity: 1
        };

        try {
            console.log('Adding to cart - userId:', userId, 'product:', cartProduct);
            // Save to Supabase
            const result = await this.authManager.addToUserCart(userId, cartProduct);
            console.log('Add to cart result:', result);
            
            if (result.error) {
                console.error('Supabase cart error:', result.error);
                toast.error('Failed to add item to cart');
            } else {
                // Reload cart from Supabase
                await this.loadUserCart();
                toast.success(`${cartProduct.name} added to cart!`);
            }
        } catch (error) {
            console.error('Cart save error:', error);
            toast.error('Failed to add item to cart: ' + error.message);
        }
        
        console.log('Cart after add:', this.cart);
        this.updateCartCount();
            
            // Immediately refresh the cart display
            try {
                if (this.currentView === "cart") {
                    await new Promise(r => setTimeout(r, 300));
                    await this.showCart();
                }
            } catch (e) {
                console.error("Error refreshing cart:", e);
            }
        this.render();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.classList.add('animate-pulse');
            } else {
                element.classList.remove('animate-pulse');
            }
        });
    }

    async loadUserCart() {
        const currentUser = this.authManager.getUser();
        if (!currentUser) {
            this.cart = [];
            return;
        }

        const userId = currentUser.id || currentUser.user_metadata?.id;
        if (!userId) {
            console.error('User ID not found in user object:', currentUser);
            this.cart = [];
            return;
        }

        try {
            console.log('=== LOADING USER CART ===');
            console.log('Loading user cart for userId:', userId);
            const result = await this.authManager.getUserCart(userId);
            console.log('Cart result from Supabase:', result);
            
            // Always set cart to empty array if no data
            if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
                this.cart = [];
            } else {
                // Convert Supabase cart data to local cart format
                console.log('Raw cart data from Supabase:', result.data);
                this.cart = result.data.map(item => ({
                    id: item.product_id,
                    name: item.product_name,
                    price: item.product_price,
                    image: item.product_image,
                    quantity: item.quantity,
                    status: 'in_stock' // Default status
                }));
                console.log('Converted cart for UI:', this.cart);
            }
        } catch (error) {
            console.error('Error loading user cart:', error);
            this.cart = [];
        }
    }

    async removeFromCart(productId) {
        const currentUser = this.authManager.getUser();
        
        try {
            if (currentUser) {
                const userId = currentUser.id || currentUser.user_metadata?.id;
                if (userId) {
                    // Validate user ID is a valid UUID
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    if (uuidRegex.test(String(userId).trim())) {
                        // Remove from Supabase
                        const result = await this.authManager.updateUserCartItem(userId, productId, 0);
                        if (result.error) {
                            console.error('Supabase cart remove error:', result.error);
                        }
                    }
                }
            }
            
            // Reload cart from Supabase
            await this.loadUserCart();
            this.updateCartCount();
            
            // Immediately refresh the cart display
            try {
                if (this.currentView === "cart") {
                    await new Promise(r => setTimeout(r, 300));
                    await this.showCart();
                }
            } catch (e) {
                console.error("Error refreshing cart:", e);
            }
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Cart remove error:', error);
            toast.error('Failed to remove item from cart');
        }
        
        this.render();
    }

    async updateCartQuantity(productId, quantity) {
        console.log('=== UPDATING CART QUANTITY ===');
        console.log('Product ID:', productId, 'New quantity:', quantity);
        
        const currentUser = this.authManager.getUser();
        
        try {
            if (currentUser) {
                const userId = currentUser.id || currentUser.user_metadata?.id;
                if (userId) {
                    // Validate user ID is a valid UUID
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    if (!uuidRegex.test(String(userId).trim())) {
                        toast.error('Invalid user session. Please login again.');
                        return;
                    }
                    
                    // If quantity is 0 or less, remove the item
                    if (quantity <= 0) {
                        console.log('Removing item from cart');
                        await this.removeFromCart(productId);
                        return;
                    }
                    
                    // Update in Supabase
                    console.log('Updating cart item in Supabase');
                    const result = await this.authManager.updateUserCartItem(userId, productId, quantity);
                    if (result.error) {
                        console.error('Supabase cart update error:', result.error);
                        toast.error('Failed to update cart item');
                        return;
                    }
                    console.log('Supabase cart update successful');
                }
            }
            
            // DON''T reload from Supabase - local cart is already updated
            // Just update the count badge
            console.log('✅ Updating cart count');
            this.updateCartCount();
            
            // NO need to refresh display - it''s already correct from handleQuantityChange()
            console.log('✅ Cart quantity update complete');
            
            // Note: Toast is already shown by handleQuantityChange()
            // No need to show another toast here
        } catch (error) {
            console.error('Cart update error:', error);
            toast.error('Failed to update cart item');
        }
    }

    async placeOrder() {
        console.log('🟠 PLACE ORDER STARTED');
        
        if (this.cart.length === 0) {
            console.log('❌ Cart is empty');
            toast.error('Your cart is empty');
            return;
        }

        console.log(`📦 Cart has ${this.cart.length} items`);

        // Get the first product ID from cart for product_id field
        const firstProductId = this.cart.length > 0 ? this.cart[0].id : null;
        console.log(`📝 First product ID: ${firstProductId}`);

        const user = this.authManager.getUser();
        console.log(`👤 User: ${user.email}`);
        
        const order = {
            customer_name: user.user_metadata?.name || user.name || 'Customer',
            customer_email: user.email || null,
            customer_mobile: user.user_metadata?.mobile || user.mobile || null,
            customer_address: '123 Main St, City, State 12345',
            customer_landmark: 'Near Main Street',
            customer_pincode: '123456',
            items: [...this.cart],
            product_id: firstProductId,
            total_amount: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            delivery_status: 'pending'
        };

        console.log('💾 Order object prepared:', order);

        try {
            console.log('📤 Creating order in Supabase...');
            const { data, error } = await db.createOrder(order);
            
            if (error) {
                console.error('❌ Order creation failed:', error);
                throw new Error('Failed to save order: ' + error.message);
            }
            
            console.log('✅ Order created successfully:', data);
            console.log(`🎯 NOW REDUCING STOCK - Cart items: ${JSON.stringify(this.cart)}`);
            
            // REDUCE STOCK - CRITICAL STEP
            await this.reduceProductStock(this.cart);
            
            console.log('✅ Stock reduction completed');
            
            // Clear cart from Supabase
            console.log('🧹 Clearing cart...');
            const currentUser = this.authManager.getUser();
            if (currentUser) {
                const userId = currentUser.id || currentUser.user_metadata?.id;
                if (userId) {
                    try {
                        await this.authManager.clearUserCart(userId);
                        await this.loadUserCart();
                        console.log('✅ Cart cleared');
                    } catch (cartError) {
                        console.error('⚠️ Error clearing cart:', cartError);
                    }
                }
            }
            
            console.log('🎉 Order placed successfully - reloading data...');
            toast.success('Order placed successfully!');
            await this.loadData();
            this.render();
            console.log('🟢 ORDER FLOW COMPLETE');
        } catch (error) {
            console.error('❌ CRITICAL ERROR in placeOrder:', error);
            console.error('Stack:', error.stack);
            toast.error('Failed to place order: ' + error.message);
        }
    }

    async reduceProductStock(cartItems) {
        console.log('🔴🔴🔴 REDUCE STOCK FUNCTION CALLED 🔴🔴🔴');
        console.log('Cart items:', cartItems);
        
        if (!supabase || !supabaseReady) {
            console.error('❌❌❌ SUPABASE NOT READY ❌❌❌');
            return;
        }

        for (const item of cartItems) {
            try {
                console.log(`\n===== UPDATING PRODUCT: ${item.id} =====`);
                console.log(`Current stock in cart: ${item.quantity}`);
                
                // Step 1: Fetch current stock
                const { data: product, error: fetchErr } = await supabase
                    .from('products')
                    .select('id, name, stock_quantity')
                    .eq('id', item.id)
                    .single();

                if (fetchErr) {
                    console.error(`❌ Fetch failed:`, fetchErr);
                    continue;
                }

                console.log(`Current stock in DB: ${product.stock_quantity}`);
                
                // Step 2: Calculate new stock
                const newStock = Math.max(0, product.stock_quantity - item.quantity);
                console.log(`New stock will be: ${newStock}`);
                
                // Step 3: UPDATE directly - SIMPLE AND DIRECT
                const { data: updateResult, error: updateErr } = await supabase
                    .from('products')
                    .update({ 
                        stock_quantity: newStock,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', item.id)
                    .select();

                if (updateErr) {
                    console.error(`❌❌❌ UPDATE FAILED ❌❌❌`, updateErr);
                } else {
                    console.log(`✅✅✅ UPDATE SUCCESS ✅✅✅`);
                    console.log('Updated data:', updateResult);
                }
                
                // Step 4: Verify it was updated
                const { data: verify } = await supabase
                    .from('products')
                    .select('id, stock_quantity')
                    .eq('id', item.id)
                    .single();
                    
                console.log(`VERIFICATION - New stock in DB: ${verify.stock_quantity}`);
                
            } catch (err) {
                console.error(`❌ Exception for ${item.id}:`, err);
            }
        }
        
        console.log('🔴🔴🔴 STOCK REDUCTION COMPLETE 🔴🔴🔴\n');
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.currentView === 'category') {
            this.renderCategoryPage();
        } else if (this.currentView === 'search') {
            this.renderSearchResults();
        } else {
            this.renderHomePage();
        }
    }
    renderHomePage() {
        const app = document.getElementById('app');
        
        if (!app) {
            console.error('App element not found');
            return;
        }

        // Debug: Log current products
        console.log('renderHomePage - Products available:', this.products.length);
        console.log('renderHomePage - Current view:', this.currentView);
        
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between h-16">
                            <!-- Left Section -->
                            <div class="flex items-center">
                                <button id="hamburger-btn" class="p-2 text-gray-600 hover:text-emerald-600 transition-colors mr-4">
                                    <i data-lucide="menu" class="w-6 h-6"></i>
                                </button>
                                <div class="flex-shrink-0">
                                    <h1 class="text-2xl font-bold text-emerald-600">Mango Mart</h1>
                                </div>
                            </div>
                            
                            <!-- Right Section -->
                            <div class="flex items-center">
                                <button id="cart-btn" class="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                    <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                                    <span id="cart-count" class="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${this.cart.length > 0 ? 'animate-pulse' : ''}">${this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Search Bar Section -->
                <div class="search-bar-container sticky top-16 z-30">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div class="search-input-wrapper">
                            <input type="text" id="search-input" placeholder="Search for products..." 
                                class="text-base">
                            <i data-lucide="search" class="search-icon"></i>
                        </div>
                    </div>
                </div>

                <!-- Mobile Menu Overlay -->
                <div id="mobile-menu" class="fixed inset-0 z-50 hidden">
                    <div class="fixed inset-0 bg-black bg-opacity-25" id="menu-overlay"></div>
                    <div class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform -translate-x-full transition-transform duration-300 ease-in-out" id="menu-panel">
                        <div class="flex items-center justify-between p-4 border-b">
                            <h2 class="text-xl font-semibold text-gray-900">Menu</h2>
                            <button id="close-menu-btn" class="p-2 text-gray-600 hover:text-emerald-600">
                                <i data-lucide="x" class="w-6 h-6"></i>
                            </button>
                        </div>
                        <nav class="p-4">
                            <ul class="space-y-2">
                                <li>
                                    <a href="orders.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="package" class="w-5 h-5 mr-3"></i>
                                        Your Orders
                                    </a>
                                </li>
                                <li>
                                    <a href="profile.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="user" class="w-5 h-5 mr-3"></i>
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="about.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="info" class="w-5 h-5 mr-3"></i>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="contact.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="phone" class="w-5 h-5 mr-3"></i>
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="privacy.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="shield-check" class="w-5 h-5 mr-3"></i>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="shipping.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="truck" class="w-5 h-5 mr-3"></i>
                                        Shipping Policy
                                    </a>
                                </li>
                                <li class="border-t pt-2 mt-4">
                                    <button id="logout-btn" class="flex items-center w-full p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
                                        <i data-lucide="log-out" class="w-5 h-5 mr-3"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Welcome Section -->
                    <div class="text-center py-12 mb-12">
                        <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Mango Mart</h2>
                        <p class="text-xl text-gray-600 mb-8">Choose a category below to start shopping</p>
                        <div class="flex justify-center space-x-8">
                            <div class="text-center">
                                <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i data-lucide="truck" class="w-10 h-10 text-emerald-600"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">Fast Delivery</p>
                            </div>
                            <div class="text-center">
                                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i data-lucide="shield-check" class="w-10 h-10 text-blue-600"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">Quality Assured</p>
                            </div>
                            <div class="text-center">
                                <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i data-lucide="credit-card" class="w-10 h-10 text-orange-600"></i>
                                </div>
                                <p class="text-sm font-medium text-gray-700">Easy Payment</p>
                            </div>
                        </div>
                    </div>

                    <!-- Categories Section -->
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Shop by Category</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${mainCategories.map(category => {
                                const categoryProducts = this.products.filter(p => category.subcategories.includes(p.subcategory || p.category));
                                return `
                                    <div class="main-category-card bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer" 
                                         data-category="${category.id}" style="aspect-ratio: 16/9; min-height: 300px;">
                                        <div class="h-full bg-gradient-to-br ${category.color} p-8 flex flex-col justify-between text-white relative overflow-hidden">
                                            <!-- Background Pattern -->
                                            <div class="absolute inset-0 opacity-10">
                                                <div class="absolute top-4 right-4 w-32 h-32 rounded-full bg-white"></div>
                                                <div class="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-white"></div>
                                            </div>
                                            
                                            <!-- Content -->
                                            <div class="relative z-10">
                                                <div class="flex items-center justify-between mb-4">
                                                    <i data-lucide="${category.icon}" class="w-12 h-12"></i>
                                                    <span class="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                                        ${categoryProducts.length} items
                                                    </span>
                                                </div>
                                                <h3 class="text-2xl font-bold mb-2">${category.name}</h3>
                                                <p class="text-white text-opacity-90 mb-4">${category.description}</p>
                                                
                                                <!-- Subcategories -->
                                                <div class="flex flex-wrap gap-2">
                                                    ${category.subcategories.map(sub => {
                                                        const subcat = sampleCategories.find(c => c.id === sub);
                                                        return subcat ? `
                                                            <span class="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                                                ${subcat.name}
                                                            </span>
                                                        ` : '';
                                                    }).join('')}
                                                </div>
                                            </div>
                                            
                                            <!-- Bottom Arrow -->
                                            <div class="relative z-10 flex justify-end">
                                                <i data-lucide="arrow-right" class="w-6 h-6"></i>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </main>

                <!-- Footer -->
                <footer class="bg-gray-900 text-white py-8 mt-16">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex flex-col md:flex-row justify-between items-center">
                            <!-- Copyright -->
                            <div class="text-center md:text-left mb-4 md:mb-0">
                                <p class="text-gray-400">&copy; 2024 Mango Mart. All rights reserved.</p>
                            </div>
                            
                            <!-- Social Media Links -->
                            <div class="flex space-x-6">
                                <a href="https://www.instagram.com/mangomart_srinivaspura?igsh=MXZ4NGZnM3owaXdkaw==" target="_blank" rel="noopener noreferrer" class="text-gray-400 social-instagram transition-colors duration-200" title="Follow us on Instagram">
                                    <i data-lucide="instagram" class="w-6 h-6"></i>
                                </a>
                                <a href="https://www.facebook.com/mangomartonline.2025?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" class="text-gray-400 social-facebook transition-colors duration-200" title="Follow us on Facebook">
                                    <i data-lucide="facebook" class="w-6 h-6"></i>
                                </a>
                                <a href="https://wa.me/918748922362" target="_blank" rel="noopener noreferrer" class="text-gray-400 social-whatsapp transition-colors duration-200" title="Chat with us on WhatsApp">
                                    <i data-lucide="message-circle" class="w-6 h-6"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        `;

        initIcons();
        this.attachEventListeners();
    }

    renderSearchResults() {
        const app = document.getElementById('app');
        const searchResults = this.getSearchResults();
        const relevantProducts = this.getRelevantProducts();
        
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center h-16">
                            <!-- Left Section -->
                            <div class="flex items-center">
                                <!-- Hamburger Menu Button -->
                                <button id="hamburger-btn" class="p-2 text-gray-600 hover:text-emerald-600 transition-colors mr-4">
                                    <i data-lucide="menu" class="w-6 h-6"></i>
                                </button>
                                <div class="flex-shrink-0">
                                    <h1 class="text-2xl font-bold text-emerald-600">Mango Mart</h1>
                                </div>
                            </div>
                            
                            <!-- Center Section - Search Bar -->
                            <div class="flex-1 flex justify-center px-8">
                                <div class="relative w-full max-w-md">
                                    <input type="text" id="search-input" placeholder="Search products..." 
                                        class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        value="${this.searchQuery}">
                                    <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                                </div>
                            </div>
                            
                            <!-- Right Section -->
                            <div class="flex items-center">
                                <button id="cart-btn" class="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                    <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                                    <span id="cart-count" class="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${this.cart.length > 0 ? 'animate-pulse' : ''}">${this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Mobile Menu Overlay -->
                <div id="mobile-menu" class="fixed inset-0 z-50 hidden">
                    <div class="fixed inset-0 bg-black bg-opacity-25" id="menu-overlay"></div>
                    <div class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform -translate-x-full transition-transform duration-300 ease-in-out" id="menu-panel">
                        <div class="flex items-center justify-between p-4 border-b">
                            <h2 class="text-xl font-semibold text-gray-900">Menu</h2>
                            <button id="close-menu-btn" class="p-2 text-gray-600 hover:text-emerald-600">
                                <i data-lucide="x" class="w-6 h-6"></i>
                            </button>
                        </div>
                        <nav class="p-4">
                            <ul class="space-y-2">
                                <li>
                                    <a href="orders.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="package" class="w-5 h-5 mr-3"></i>
                                        Your Orders
                                    </a>
                                </li>
                                <li>
                                    <a href="profile.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="user" class="w-5 h-5 mr-3"></i>
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="about.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="info" class="w-5 h-5 mr-3"></i>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="contact.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="phone" class="w-5 h-5 mr-3"></i>
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="privacy.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="shield-check" class="w-5 h-5 mr-3"></i>
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="shipping.html" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                        <i data-lucide="truck" class="w-5 h-5 mr-3"></i>
                                        Shipping Policy
                                    </a>
                                </li>
                                <li class="border-t pt-2 mt-4">
                                    <button id="logout-btn" class="flex items-center w-full p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
                                        <i data-lucide="log-out" class="w-5 h-5 mr-3"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Search Header -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">Search Results</h2>
                                <p class="text-gray-600">Found ${searchResults.length} results for "${this.searchQuery}"</p>
                            </div>
                            <button id="back-to-home" class="flex items-center text-gray-600 hover:text-emerald-600">
                                <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
                                Back to Home
                            </button>
                        </div>
                    </div>

                    <!-- Search Results -->
                    ${searchResults.length > 0 ? `
                        <div class="mb-12">
                            <h3 class="text-lg font-semibold text-gray-900 mb-6">Exact Matches</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                ${searchResults.map(product => {
                                    const cartItem = this.cart.find(item => item.id === product.id);
                                    const quantity = cartItem ? cartItem.quantity : 0;
                                    
                                    return `
                                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                            <div class="product-image-container"><img src="${product.image}" alt="${product.name}"></div>
                                            <div class="p-4">
                                                <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
                                                <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                                                <div class="flex items-center justify-between mb-3">
                                                    <span class="text-lg font-bold text-emerald-600">${formatCurrency(product.price)}</span>
                                                    <span class="text-sm text-gray-500">Stock: ${product.stock_quantity}</span>
                                                </div>
                                                ${(product.stock_quantity === 0 || product.status === 'out_of_stock') ? `
                                                    <button class="w-full btn btn-outline cursor-not-allowed opacity-50" disabled>
                                                        Out of Stock
                                                    </button>
                                                ` : quantity === 0 ? `
                                                    <button class="add-to-cart-btn w-full btn btn-primary" data-product-id="${product.id}">
                                                        Add to Cart
                                                    </button>
                                                ` : `
                                                    <div class="flex items-center justify-center space-x-3">
                                                        <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                                data-product-id="${product.id}" data-action="decrease">
                                                            <i data-lucide="minus" class="w-4 h-4"></i>
                                                        </button>
                                                        <span class="quantity-display font-semibold text-gray-900 min-w-[2rem] text-center">${quantity}</span>
                                                        <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                                data-product-id="${product.id}" data-action="increase">
                                                            <i data-lucide="plus" class="w-4 h-4"></i>
                                                        </button>
                                                    </div>
                                                `}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Relevant Products -->
                    ${relevantProducts.length > 0 ? `
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-gray-900 mb-6">You might also like</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                ${relevantProducts.map(product => {
                                    const cartItem = this.cart.find(item => item.id === product.id);
                                    const quantity = cartItem ? cartItem.quantity : 0;
                                    
                                    return `
                                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                            <div class="product-image-container"><img src="${product.image}" alt="${product.name}"></div>
                                            <div class="p-4">
                                                <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
                                                <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                                                <div class="flex items-center justify-between mb-3">
                                                    <span class="text-lg font-bold text-emerald-600">${formatCurrency(product.price)}</span>
                                                    <span class="text-sm text-gray-500">Stock: ${product.stock_quantity}</span>
                                                </div>
                                                ${(product.stock_quantity === 0 || product.status === 'out_of_stock') ? `
                                                    <button class="w-full btn btn-outline cursor-not-allowed opacity-50" disabled>
                                                        Out of Stock
                                                    </button>
                                                ` : quantity === 0 ? `
                                                    <button class="add-to-cart-btn w-full btn btn-primary" data-product-id="${product.id}">
                                                        Add to Cart
                                                    </button>
                                                ` : `
                                                    <div class="flex items-center justify-center space-x-3">
                                                        <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                                data-product-id="${product.id}" data-action="decrease">
                                                            <i data-lucide="minus" class="w-4 h-4"></i>
                                                        </button>
                                                        <span class="quantity-display font-semibold text-gray-900 min-w-[2rem] text-center">${quantity}</span>
                                                        <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                                data-product-id="${product.id}" data-action="increase">
                                                            <i data-lucide="plus" class="w-4 h-4"></i>
                                                        </button>
                                                    </div>
                                                `}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${searchResults.length === 0 && relevantProducts.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="search" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                            <p class="text-gray-500 mb-6">Try searching with different keywords</p>
                            <button id="clear-search" class="btn btn-primary">Clear Search</button>
                        </div>
                    ` : ''}
                </main>
            </div>
        `;

        initIcons();
        this.attachEventListeners();
    }

    renderOrdersPage() {
        const user = storage.get('user');
        const orders = storage.get('orders') || [];
        const userOrders = orders.filter(order => order.customerId === user.id);
        
        document.getElementById('app').innerHTML = `
            <!-- Header -->
            <header class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center h-16">
                        <!-- Left Section -->
                        <div class="flex items-center">
                            <!-- Hamburger Menu Button -->
                            <button id="hamburger-btn" class="p-2 text-gray-600 hover:text-emerald-600 transition-colors mr-4">
                                <i data-lucide="menu" class="w-6 h-6"></i>
                            </button>
                            <div class="flex-shrink-0">
                                <h1 class="text-2xl font-bold text-emerald-600">Mango Mart</h1>
                            </div>
                        </div>
                        
                        <!-- Center Section - Search Bar -->
                        <div class="flex-1 flex justify-center px-8">
                            <div class="relative w-full max-w-md">
                                <input type="text" id="search-input" placeholder="Search products..." 
                                    class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                <i data-lucide="search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                            </div>
                        </div>
                        
                        <!-- Right Section -->
                        <div class="flex items-center">
                            <button id="cart-btn" class="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                                <span id="cart-count" class="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${this.cart.length > 0 ? 'animate-pulse' : ''}">${this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Mobile Menu Overlay -->
            <div id="mobile-menu" class="fixed inset-0 z-50 hidden">
                <div class="fixed inset-0 bg-black bg-opacity-25" id="menu-overlay"></div>
                <div class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform -translate-x-full transition-transform duration-300 ease-in-out" id="menu-panel">
                    <div class="flex items-center justify-between p-4 border-b">
                        <h2 class="text-xl font-semibold text-gray-900">Menu</h2>
                        <button id="close-menu-btn" class="p-2 text-gray-600 hover:text-emerald-600">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <nav class="p-4">
                        <ul class="space-y-2">
                            <li>
                                <button id="orders-btn" class="flex items-center w-full p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                    <i data-lucide="package" class="w-5 h-5 mr-3"></i>
                                    Your Orders
                                </button>
                            </li>
                            <li>
                                <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                    <i data-lucide="user" class="w-5 h-5 mr-3"></i>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                    <i data-lucide="info" class="w-5 h-5 mr-3"></i>
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                    <i data-lucide="phone" class="w-5 h-5 mr-3"></i>
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                    <i data-lucide="shield-check" class="w-5 h-5 mr-3"></i>
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" class="flex items-center p-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                                    <i data-lucide="truck" class="w-5 h-5 mr-3"></i>
                                    Shipping Policy
                                </a>
                            </li>
                            <li class="border-t pt-2 mt-4">
                                <button id="logout-btn" class="flex items-center w-full p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
                                    <i data-lucide="log-out" class="w-5 h-5 mr-3"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Orders Header -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Your Orders</h1>
                            <p class="text-gray-600 mt-2">Track and manage your orders</p>
                        </div>
                        <button id="back-to-home" class="flex items-center px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                            <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>
                            Back to Home
                        </button>
                    </div>
                </div>

                <!-- Orders List -->
                ${userOrders.length > 0 ? `
                    <div class="space-y-6">
                        ${userOrders.map(order => this.renderOrderCard(order)).join('')}
                    </div>
                ` : `
                    <div class="text-center py-12">
                        <i data-lucide="package" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p class="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <button id="start-shopping" class="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                            Start Shopping
                        </button>
                    </div>
                `}
            </main>
        `;

        initIcons();
        this.attachEventListeners();
    }

    renderOrderCard(order) {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-blue-100 text-blue-800',
            'preparing': 'bg-orange-100 text-orange-800',
            'ready': 'bg-purple-100 text-purple-800',
            'out_for_delivery': 'bg-indigo-100 text-indigo-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };

        const statusLabels = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'preparing': 'Preparing',
            'ready': 'Ready',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };

        return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Order #${order.id}</h3>
                        <p class="text-sm text-gray-600">Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}">
                        ${statusLabels[order.status] || order.status}
                    </span>
                </div>
                
                <div class="space-y-3 mb-4">
                    ${order.items.map(item => `
                        <div class="flex items-center space-x-3">
                            <img src="${item.image || 'https://via.placeholder.com/60x60?text=No+Image'}" 
                                 alt="${item.name}" class="w-12 h-12 rounded-lg object-cover">
                            <div class="flex-1">
                                <h4 class="text-sm font-medium text-gray-900">${item.name}</h4>
                                <p class="text-sm text-gray-600">Qty: ${item.quantity} × ${formatCurrency(item.price)}</p>
                            </div>
                            <div class="text-sm font-medium text-gray-900">
                                ${formatCurrency(item.price * item.quantity)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="border-t pt-4">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-600">
                            <p>Total: <span class="font-semibold text-lg text-gray-900">${formatCurrency(order.total)}</span></p>
                            <p>Payment: ${order.paymentMethod}</p>
                        </div>
                        <div class="flex space-x-2">
                            ${order.status === 'delivered' ? `
                                <button class="px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
                                    Reorder
                                </button>
                            ` : ''}
                            ${order.status === 'pending' || order.status === 'confirmed' ? `
                                <button class="px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors">
                                    Cancel Order
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    renderCategoryPage() {
        const app = document.getElementById('app');
        const mainCategory = mainCategories.find(cat => cat.id === this.currentMainCategory);
        const filteredProducts = this.getFilteredProducts();
        
        if (!mainCategory) {
            this.currentView = 'home';
            this.render();
            return;
        }

        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex items-center justify-between h-16">
                            <!-- Left Section -->
                            <div class="flex items-center">
                                <button id="back-to-home" class="flex items-center text-gray-600 hover:text-emerald-600 mr-4">
                                    <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
                                    Back to Home
                                </button>
                                <h1 class="text-2xl font-bold text-emerald-600">${mainCategory.name}</h1>
                            </div>
                            
                            <!-- Right Section -->
                            <div class="flex items-center space-x-4">
                                <button id="cart-btn" class="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                    <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                                    <span id="cart-count" class="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${this.cart.length > 0 ? 'animate-pulse' : ''}">${this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span>
                                </button>
                                <button id="logout-btn" class="btn btn-outline">Sign Out</button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Search Bar Section -->
                <div class="search-bar-container sticky top-16 z-30">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div class="search-input-wrapper">
                            <input type="text" id="search-input" placeholder="Search for products in ${mainCategory.name}..." 
                                class="text-base">
                            <i data-lucide="search" class="search-icon"></i>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Category Header -->
                    <div class="mb-8">
                        <div class="bg-gradient-to-r ${mainCategory.color} rounded-2xl p-8 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h2 class="text-3xl font-bold mb-2">${mainCategory.name}</h2>
                                    <p class="text-white text-opacity-90 mb-4">${mainCategory.description}</p>
                                    <div class="flex flex-wrap gap-2">
                                        ${mainCategory.subcategories.slice().reverse().map(sub => {
                                            return `
                                                <span class="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                                    ${sub.charAt(0).toUpperCase() + sub.slice(1)}
                                                </span>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                                <i data-lucide="${mainCategory.icon}" class="w-16 h-16 text-white text-opacity-50"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Subcategories Filter -->
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filter by Subcategory</h3>
                        <div class="flex flex-wrap gap-2">
                            <button class="category-btn px-4 py-2 rounded-full border ${!this.selectedCategory ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}" data-category="">
                                All Products
                            </button>
                            ${mainCategory.subcategories.slice().reverse().map(sub => {
                                return `
                                    <button class="category-btn px-4 py-2 rounded-full border ${this.selectedCategory === sub ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}" data-category="${sub}">
                                        ${sub.charAt(0).toUpperCase() + sub.slice(1)}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Products Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        ${filteredProducts.map(product => {
                            const cartItem = this.cart.find(item => item.id === product.id);
                            const quantity = cartItem ? cartItem.quantity : 0;
                            
                            return `
                                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div class="product-image-container"><img src="${product.image}" alt="${product.name}"></div>
                                    <div class="p-4">
                                        <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
                                        <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                                        <div class="flex items-center justify-between mb-3">
                                            <span class="text-lg font-bold text-emerald-600">${formatCurrency(product.price)}</span>
                                            <span class="text-sm text-gray-500">Stock: ${product.stock_quantity}</span>
                                        </div>
                                        ${(product.stock_quantity === 0 || product.status === 'out_of_stock') ? `
                                            <button class="w-full btn btn-outline cursor-not-allowed opacity-50" disabled>
                                                Out of Stock
                                            </button>
                                        ` : quantity === 0 ? `
                                            <button class="add-to-cart-btn w-full btn btn-primary" data-product-id="${product.id}">
                                                Add to Cart
                                            </button>
                                        ` : `
                                            <div class="flex items-center justify-center space-x-3">
                                                <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                        data-product-id="${product.id}" data-action="decrease">
                                                    <i data-lucide="minus" class="w-4 h-4"></i>
                                                </button>
                                                <span class="quantity-display font-semibold text-gray-900 min-w-[2rem] text-center">${quantity}</span>
                                                <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                        data-product-id="${product.id}" data-action="increase">
                                                    <i data-lucide="plus" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        `}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    ${filteredProducts.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="search" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                            <p class="text-gray-500">No products found in this category</p>
                        </div>
                    ` : ''}
                </main>
            </div>
        `;

        initIcons();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                console.log('Search input:', this.searchQuery); // Debug logging
                
                // Debounce search - wait 800ms after user stops typing
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    console.log('Executing search for:', this.searchQuery); // Debug logging
                    if (this.searchQuery.trim()) {
                        this.currentView = 'search';
                        this.render();
                    } else {
                        this.currentView = 'home';
                        this.render();
                    }
                }, 800);
            });

            // Search on Enter key (immediate search)
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.searchQuery.trim()) {
                    console.log('Enter key pressed for search:', this.searchQuery); // Debug logging
                    clearTimeout(this.searchTimeout); // Cancel debounced search
                    this.currentView = 'search';
                    this.render();
                }
            });
        } else {
            console.warn('Search input element not found');
        }

        // Main Category Cards
        document.querySelectorAll('.main-category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.category;
                this.currentMainCategory = categoryId;
                this.currentView = 'category';
                this.selectedCategory = null; // Reset subcategory filter
                this.render();
            });
        });

        // Back to Home button
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.currentView = 'home';
                this.currentMainCategory = null;
                this.selectedCategory = null;
                this.searchQuery = '';
                this.render();
            });
        }

        // Clear Search button
        const clearSearchBtn = document.getElementById('clear-search');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.searchQuery = '';
                this.currentView = 'home';
                this.render();
            });
        }

        // Orders button is now a direct link to orders.html

        // Start shopping button
        const startShoppingBtn = document.getElementById('start-shopping');
        if (startShoppingBtn) {
            startShoppingBtn.addEventListener('click', () => {
                this.currentView = 'home';
                this.render();
            });
        }

        // Subcategory Filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedCategory = e.target.dataset.category || null;
                this.render();
            });
        });

        // Add to cart
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.addToCart(product);
                }
            });
        });

        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.quantity-btn').dataset.productId;
                const action = e.target.closest('.quantity-btn').dataset.action;
                const product = this.products.find(p => p.id === productId);
                
                if (product) {
                    if (action === 'increase') {
                        this.addToCart(product);
                    } else if (action === 'decrease') {
                        this.updateCartQuantity(productId, this.cart.find(item => item.id === productId)?.quantity - 1 || 0);
                    }
                }
            });
        });

        // Cart button
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', async () => {
                await this.showCart();
            });
        }

        // Hamburger Menu
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuPanel = document.getElementById('menu-panel');
        const closeMenuBtn = document.getElementById('close-menu-btn');

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    menuPanel.classList.remove('-translate-x-full');
                }, 10);
            });
        }

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                menuPanel.classList.add('-translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            });
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                menuPanel.classList.add('-translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            });
        }

        // Back to shop button (for cart page)
        const backToShopBtn = document.getElementById('back-to-shop');
        if (backToShopBtn) {
            backToShopBtn.addEventListener('click', () => {
                this.currentView = 'home';
                this.render();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authManager.signOut();
            });
        }
    }

    async showCart() { console.clear(); console.log("=== SHOW CART DEBUG ==="); console.log("Current cart:", this.cart); 
        // NEVER reload from Supabase - use the local cart that was just updated!
        // This prevents the quantity mismatch bug
        console.log('=== SHOWING CART ===');
        console.log('Cart items count:', this.cart.length);
        console.log('Current local cart:', this.cart);
        
        // Force refresh the cart display
        console.log('Refreshing cart display...');
        
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <button id="back-to-shop" class="flex items-center text-gray-600 hover:text-emerald-600">
                                <i data-lucide="arrow-left" class="w-5 h-5 mr-2"></i>
                                Back to Shop
                            </button>
                            <h1 class="text-xl font-semibold">Shopping Cart</h1>
                            <div></div>
                        </div>
                    </div>
                </header>

                <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    ${this.cart.length === 0 ? `
                        <div class="text-center py-12">
                            <i data-lucide="shopping-cart" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                            <h2 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                            <p class="text-gray-600 mb-6">Add some products to get started!</p>
                            <button id="continue-shopping" class="btn btn-primary">Continue Shopping</button>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            ${this.cart.map(item => `
                                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <div class="flex items-center space-x-4">
                                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                                        <div class="flex-1">
                                            <h3 class="font-semibold text-gray-900">${item.name || 'Unknown Product'}</h3>
                                            <p class="text-gray-600">${formatCurrency(item.price || 0)} each</p>
                                        </div>
                                        <div class="flex items-center space-x-3">
                                            <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                    data-id="${item.id}" data-action="decrease">
                                                <i data-lucide="minus" class="w-4 h-4"></i>
                                            </button>
                                            <span class="quantity font-semibold text-gray-900 min-w-[2rem] text-center">${item.quantity}</span>
                                            <button class="quantity-btn w-10 h-10 md:w-8 md:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95" 
                                                    data-id="${item.id}" data-action="increase">
                                                <i data-lucide="plus" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                        <div class="text-lg font-semibold">${formatCurrency((item.price || 0) * (item.quantity || 0))}</div>
                                        <button class="remove-btn text-red-600 hover:text-red-800" data-id="${item.id}">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Checkout Form -->
                        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-6">Checkout Details</h3>
                            
                            <form id="checkout-form" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                        <input type="text" id="customer-name" required 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter your full name">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                                        <input type="tel" id="customer-mobile" required 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter your mobile number">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                    <textarea id="customer-address" required rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Enter your complete address"></textarea>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                                        <input type="text" id="customer-landmark" 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Nearby landmark (optional)">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                        <input type="text" id="customer-pincode" required 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter pincode">
                                    </div>
                                </div>
                                
                                <div class="border-t pt-4">
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="text-lg font-semibold">Total Amount:</span>
                                        <span class="text-2xl font-bold text-emerald-600">${formatCurrency(this.cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0))}</span>
                                    </div>
                                    <div class="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-transparent rounded-lg border-2 border-emerald-200">
                                        <label class="block text-sm font-bold text-gray-800 mb-4 flex items-center">
                                            <i data-lucide="credit-card" class="w-5 h-5 mr-2 text-emerald-600"></i>
                                            Choose Payment Method
                                        </label>
                                        <div class="space-y-3">
                                            <!-- Online Payment Option -->
                                            <label class="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all duration-200 active:bg-emerald-50">
                                                <input type="radio" name="payment-method" value="razorpay" class="payment-method-radio w-5 h-5 cursor-pointer" checked>
                                                <div class="ml-3 flex-1">
                                                    <div class="font-semibold text-gray-800">Online Payment</div>
                                                    <div class="text-xs text-gray-500 mt-1">Credit/Debit Card, UPI, Wallets</div>
                                                </div>
                                                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600 flex-shrink-0"></i>
                                            </label>
                                            
                                            <!-- Cash on Delivery Option -->
                                            <label class="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all duration-200 active:bg-emerald-50">
                                                <input type="radio" name="payment-method" value="cod" class="payment-method-radio w-5 h-5 cursor-pointer">
                                                <div class="ml-3 flex-1">
                                                    <div class="font-semibold text-gray-800">Cash on Delivery</div>
                                                    <div class="text-xs text-gray-500 mt-1">Pay when you receive your order</div>
                                                </div>
                                                <i data-lucide="banknote" class="w-5 h-5 text-blue-600 flex-shrink-0"></i>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" id="place-order" class="w-full btn btn-primary">
                                        <i data-lucide="credit-card" class="w-4 h-4 mr-2"></i>
                                        Place Order & Pay
                                    </button>
                                </div>
                            </form>
                        </div>
                    `}
                </main>
            </div>
        `;

                initIcons();
        
        // IMPORTANT: Attach event listeners AFTER icons are initialized
        const self = this;
        setTimeout(() => {
            console.log('🔵 Cart view initialized, attaching listeners in 100ms...');
            self.attachCartEventListeners();
        }, 100);
    }

    attachCartEventListeners() {
        // Back to shop
        const backBtn = document.getElementById('back-to-shop');
        const continueBtn = document.getElementById('continue-shopping');
        if (backBtn) backBtn.addEventListener('click', () => this.render());
        if (continueBtn) continueBtn.addEventListener('click', () => this.render());

        // Quantity controls - Attach with proper context and immediate updates
        const self = this;
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        console.log('🔵 Found', quantityBtns.length, 'quantity buttons at attach time');
        console.log('Current cart:', this.cart);
        
                // Amazon-like quantity handler - Simple and reliable
        const handleQuantityChange = async (productId, action) => {
            try {
                // Find item in cart
                const itemIndex = self.cart.findIndex(item => String(item.id) === String(productId));
                if (itemIndex === -1) {
                    console.error('Product not found in cart:', productId);
                    toast.error('Product not found');
                    return;
                }
                
                const item = self.cart[itemIndex];
                const currentQty = item.quantity || 1;
                console.log(`📦 Cart update: ${item.name} - Current: ${currentQty}`);
                let newQty = currentQty;
                
                // Calculate new quantity
                if (action === 'increase') {
                    newQty = currentQty + 1;
                    console.log(`✅ INCREASE: ${currentQty} + 1 = ${newQty}`);
                } else if (action === 'decrease') {
                    newQty = currentQty - 1;
                    console.log(`✅ DECREASE: ${currentQty} - 1 = ${newQty}`);
                } else {
                    console.error('Invalid action:', action);
                    return;
                }
                
                console.log(`📦 New quantity calculated: ${newQty}`);
                
                // Validate quantity
                if (newQty < 0) {
                    newQty = 0;
                    console.log(`⚠️ Clamped to 0`);
                } else if (newQty > 999) {
                    console.error('❌ Quantity too high:', newQty);
                    toast.error('Maximum 999 items allowed');
                    return;
                }
                
                // Update or remove
                if (newQty === 0) {
                    // Remove from cart
                    const itemName = item.name || 'Product';
                    self.cart.splice(itemIndex, 1);
                    
                    // Show toast BEFORE re-rendering
                    toast.success(`✅ ${itemName} removed from cart`);
                    
                    // Then update UI and sync
                    self.showCart();
                    self.removeFromCart(productId).catch(e => console.error('Remove error:', e));
                } else {
                    // Update quantity
                    console.log(`📝 Before update - cart[${itemIndex}].quantity:`, self.cart[itemIndex].quantity);
                    self.cart[itemIndex].quantity = newQty;
                    console.log(`📝 After update - cart[${itemIndex}].quantity:`, self.cart[itemIndex].quantity);
                    console.log(`📝 Full item object:`, self.cart[itemIndex]);
                    
                    // Show toast with the ACTUAL new quantity we just set
                    toast.success(`✅ ${item.name} - Qty: ${newQty}`);
                    
                    // Then update UI and sync
                    console.log(`🎨 Calling showCart()`);
                    self.showCart();
                    
                    console.log(`💾 Calling updateCartQuantity(${productId}, ${newQty})`);
                    self.updateCartQuantity(productId, newQty).catch(e => console.error('Update error:', e));
                }
            } catch (err) {
                console.error('Quantity error:', err);
                toast.error('Failed to update quantity');
            }
        };
        
        quantityBtns.forEach((btn, idx) => {
            btn.removeEventListener('click', btn.__quantityHandler);  // Remove old listener if exists
            
            btn.__quantityHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = btn.dataset.id;
                const action = btn.dataset.action;
                
                if (!productId || !action) return;
                
                // Handle synchronously for instant feedback (Amazon style)
                btn.disabled = true;
                handleQuantityChange(productId, action).finally(() => {
                    btn.disabled = false;
                });
            };
            
            btn.addEventListener('click', btn.__quantityHandler);
        });

        // Remove items
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.remove-btn').dataset.id;
                this.removeFromCart(id);
            });
        });

        // GLOBAL BACKUP LISTENER for quantity buttons  
        // This catches quantity button clicks using event delegation
        const mainElement = document.querySelector('main');
        if (mainElement && !mainElement.__quantityListenerAttached) {
            mainElement.__quantityListenerAttached = true;
            console.log('🟡 Attaching global quantity button handler');
            
            mainElement.addEventListener('click', (e) => {
                const btn = e.target.closest('.quantity-btn');
                if (!btn || !btn.dataset.id || !btn.dataset.action) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                const productId = btn.dataset.id;
                const action = btn.dataset.action;
                
                btn.disabled = true;
                handleQuantityChange(productId, action).finally(() => {
                    btn.disabled = false;
                });
            }, true);
        }

        // Checkout form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCheckout();
            });
        }
    }

    handleCheckout() {
        // Get form data
        const customerName = document.getElementById('customer-name').value.trim();
        const customerMobile = document.getElementById('customer-mobile').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        const customerLandmark = document.getElementById('customer-landmark').value.trim();
        const customerPincode = document.getElementById('customer-pincode').value.trim();
        
        // Get selected payment method
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'razorpay';

        // Validate form
        if (!customerName || !customerMobile || !customerAddress || !customerPincode) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate mobile number
        if (!/^\d{10}$/.test(customerMobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        // Validate pincode
        if (!/^\d{6}$/.test(customerPincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return;
        }

        // Calculate total amount
        const totalAmount = this.cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
        
        if (totalAmount <= 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Validate minimum amount for Razorpay (₹1 = 100 paise)
        if (totalAmount < 1) {
            toast.error('Minimum order amount is ₹1');
            return;
        }

        // Show loading state
        const placeOrderBtn = document.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i>Processing...';
            initIcons();
        }

        // Generate order ID
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Create order data
        const orderData = {
            id: orderId,
            customerName,
            customerMobile,
            customerAddress,
            customerLandmark,
            customerPincode,
            items: [...this.cart],
            totalAmount,
            status: 'pending',
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            paymentMethod: paymentMethod,
            createdAt: new Date().toISOString()
        };

        // Store order data temporarily
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));

        // Route to appropriate payment method
        setTimeout(() => {
            if (paymentMethod === 'cod') {
                // Cash on Delivery - skip Razorpay and go directly to order completion
                console.log('Processing Cash on Delivery order...');
                this.handleCashOnDelivery(orderData);
            } else if (typeof Razorpay !== 'undefined' && checkRazorpayAvailability()) {
                console.log('Razorpay is available, initiating payment...');
                this.initiateRazorpayPayment(orderData);
            } else {
                console.log('Razorpay not available, using mock payment...');
                // Fallback to mock payment for testing
                this.initiateMockPayment(orderData);
            }
        }, 500);
    }

    initiateRazorpayPayment(orderData) {
        // Check if Razorpay is available
        if (typeof Razorpay === 'undefined') {
            toast.error('Payment gateway is not loaded. Please refresh the page and try again.');
            console.error('Razorpay is not available');
            this.resetPlaceOrderButton();
            return;
        }

        const options = {
            key: RAZORPAY_CONFIG.key,
            amount: Math.round(orderData.totalAmount * 100), // Convert to paise
            currency: RAZORPAY_CONFIG.currency,
            name: RAZORPAY_CONFIG.name,
            description: `Order #${orderData.id} - ${RAZORPAY_CONFIG.description}`,
            image: RAZORPAY_CONFIG.image,
            handler: (response) => {
                this.handlePaymentSuccess(response, orderData);
            },
            prefill: {
                name: orderData.customerName,
                contact: orderData.customerMobile,
                email: 'customer@mangomart.com'
            },
            notes: {
                order_id: orderData.id,
                address: orderData.customerAddress,
                landmark: orderData.customerLandmark,
                pincode: orderData.customerPincode
            },
            theme: {
                color: '#10B981'
            }
        };

        try {
            console.log('Razorpay options:', options);
            const razorpay = new Razorpay(options);
            
            razorpay.on('payment.failed', (response) => {
                toast.error('Payment failed. Please try again.');
                console.error('Payment failed:', response.error);
                this.resetPlaceOrderButton();
            });

            razorpay.open();
        } catch (error) {
            toast.error('Failed to initialize payment. Please try again.');
            console.error('Razorpay initialization error:', error);
            this.resetPlaceOrderButton();
        }
    }
    async handlePaymentSuccess(response, orderData) {
        console.log('=== PAYMENT SUCCESS ===');
        
        // Get current user
        const session = JSON.parse(localStorage.getItem('session') || 'null');
        if (!session || !session.user) {
            console.error('No user session found');
            toast.error('Please login to place an order');
            return;
        }

        // Create simple order object
        const order = {
            id: orderData.id,
            customer_id: session.user.id, // This should be a valid UUID
            customer_name: orderData.customerName || session.user.name,
            customer_email: session.user.email || null, // Allow null for mobile-only users
            customer_mobile: orderData.customerMobile || session.user.mobile || null, // Allow null for email-only users
            customer_address: orderData.customerAddress,
            customer_landmark: orderData.customerLandmark,
            customer_pincode: orderData.customerPincode,
            items: orderData.items,
            product_id: orderData.items && orderData.items.length > 0 ? orderData.items[0].id : null,
            total_amount: orderData.totalAmount,
            status: 'confirmed',
            payment_status: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
            payment_id: response.razorpay_payment_id,
            payment_signature: response.razorpay_signature,
            created_at: new Date().toISOString(),
            paid_at: orderData.paymentMethod === 'cod' ? null : new Date().toISOString(),
            delivery_status: 'pending'
        };

        // Ensure at least one contact method is provided
        if (!order.customer_email && !order.customer_mobile) {
            console.error('Both email and mobile are null for user:', session.user);
            toast.error('User contact information is missing');
            return;
        }

        console.log('Order customer_id:', order.customer_id);
        console.log('Session user ID:', session.user.id);

        console.log('Saving order:', order);

        // Save to Supabase
        try {
            console.log('Supabase status:', { supabase: !!supabase, supabaseReady });
            
            if (supabase && supabaseReady) {
                console.log('Attempting to save order to Supabase...');
                console.log('Order data being sent:', JSON.stringify(order, null, 2));
                
                const { data, error } = await supabase
                    .from('orders')
                    .insert([order])
                    .select();
                
                if (error) {
                    console.error('❌ Supabase error:', error);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                    
                    // Check if it's a column error
                    if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
                        console.error('Column error detected - product_id column might be missing');
                        alert('Database error: Missing column. Please run the SQL setup script.');
                    }
                    
                    throw error;
                }
                
                console.log('✅ Order saved to Supabase successfully:', data);
                toast.success('Order placed successfully!');
                
                // Verify the order was saved
                setTimeout(async () => {
                    try {
                        const { data: verifyData, error: verifyError } = await supabase
                            .from('orders')
                            .select('*')
                            .eq('id', order.id);
                        
                        if (verifyError) {
                            console.error('Verification error:', verifyError);
                        } else {
                            console.log('Order verification successful:', verifyData);
                        }
                    } catch (verifyErr) {
                        console.error('Order verification failed:', verifyErr);
                    }
                }, 1000);
                
            } else {
                console.log('Supabase not available, using localStorage');
                throw new Error('Supabase not available');
            }
        } catch (error) {
            console.error('Failed to save to Supabase:', error);
            console.log('Falling back to localStorage...');
            
            // Save to localStorage as backup
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            console.log('Order saved to localStorage as fallback');
            toast.success('Order placed successfully!');
        }

        // Store order details for thanks page
        localStorage.setItem('lastOrderId', order.id);
        localStorage.setItem('lastOrderTotal', formatCurrency(order.total_amount));
        localStorage.setItem('lastOrderDate', new Date(order.created_at).toLocaleDateString());

        // Clear cart from Supabase and local storage
        try {
            const currentUser = this.authManager.getUser();
            if (currentUser) {
                const userId = currentUser.id || currentUser.user_metadata?.id;
                if (userId) {
                    console.log('Clearing user cart from Supabase for userId:', userId);
                    await this.authManager.clearUserCart(userId);
                    console.log('Cart cleared from Supabase');
                }
            }
        } catch (error) {
            console.error('Error clearing cart from Supabase:', error);
        }
        
        // Clear local cart
        this.cart = [];
        localStorage.setItem('cart', JSON.stringify(this.cart));
        console.log('Local cart cleared');

        // Show success message
        toast.success('� Redirecting...');

        // Redirect to thanks page
        console.log('=== PAYMENT SUCCESS - REDIRECTING ===');
        console.log('Order ID:', order.id);
        console.log('Total Amount:', order.total_amount);
        console.log('Formatted Total:', formatCurrency(order.total_amount));
        console.log('Order Date:', new Date(order.created_at).toLocaleDateString());
        
        const redirectUrl = `thanks.html?orderId=${order.id}&total=${formatCurrency(order.total_amount)}&date=${new Date(order.created_at).toLocaleDateString()}`;
        console.log('Redirect URL:', redirectUrl);
        
        setTimeout(() => {
            console.log('Executing redirect to:', redirectUrl);
            window.location.href = redirectUrl;
        }, 1500);
    }

    resetPlaceOrderButton() {
        const placeOrderBtn = document.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i data-lucide="credit-card" class="w-4 h-4 mr-2"></i>Place Order & Pay';
            initIcons();
        }
    }

    initiateMockPayment(orderData) {
        // Mock payment for testing when Razorpay is not available
        console.log('Initiating mock payment for order:', orderData.id);
        toast.success('Using mock payment for testing. Razorpay is not available.');
        
        // Ensure order has user information
        const session = JSON.parse(localStorage.getItem('session') || 'null');
        if (session && session.user) {
            orderData.customerId = orderData.customerId || session.user.id;
            orderData.customerName = orderData.customerName || session.user.name;
            orderData.customerEmail = orderData.customerEmail || session.user.email;
            orderData.customerMobile = orderData.customerMobile || session.user.mobile;
        }
        
        // Simulate payment success after 2 seconds
        setTimeout(() => {
            const mockResponse = {
                razorpay_payment_id: 'mock_payment_' + Date.now(),
                razorpay_signature: 'mock_signature_' + Math.random().toString(36).substr(2, 9)
            };
            
            console.log('Mock payment successful:', mockResponse);
            this.handlePaymentSuccess(mockResponse, orderData);
        }, 2000);
    }

    async handleCashOnDelivery(orderData) {
        console.log('Processing Cash on Delivery order:', orderData.id);
        toast.success('� Redirecting...');
        
        // Create mock payment response for COD
        const codResponse = {
            razorpay_payment_id: 'cod_' + Date.now(),
            razorpay_signature: 'cod_signature_' + Math.random().toString(36).substr(2, 9)
        };
        
        // Set payment status as pending (to be paid on delivery)
        orderData.paymentStatus = 'cash_on_delivery';
        orderData.payment_id = codResponse.razorpay_payment_id;
        
        // Process the order
        setTimeout(() => {
            console.log('Cash on Delivery order confirmed:', orderData.id);
            this.handlePaymentSuccess(codResponse, orderData);
        }, 1500);
    }
}

// ===== DELIVERY DASHBOARD =====
class DeliveryDashboard {
    constructor(authManager) {
        this.authManager = authManager;
        this.orders = [];
        this.previousOrders = [];
        this.currentOrder = null;
    }

    async init() {
        await this.loadOrders();
        this.render();
    }

    async loadOrders() {
        try {
            console.log('Loading delivery orders...');
            if (supabase && supabaseReady) {
                // Use orders table directly to avoid enhanced view data mismatches
                const { data: allOrders, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('Error loading orders from table:', error);
                    return;
                }
                
                // Separate active and previous orders
                this.orders = allOrders.filter(order => 
                    ['pending', 'picked_up', 'out_for_delivery'].includes(order.delivery_status)
                ) || [];
                
                this.previousOrders = allOrders.filter(order => 
                    order.delivery_status === 'delivered'
                ) || [];
                
                console.log('Loaded active orders:', this.orders.length);
                console.log('Loaded previous orders:', this.previousOrders.length);
            } else {
                console.log('Supabase not ready');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    render() {
        console.log('DeliveryDashboard render called');
        const app = document.getElementById('app');
        if (!app) {
            console.error('App element not found');
            return;
        }

        const agent = this.authManager.getUser();
        console.log('Current delivery agent:', agent);
        const stats = this.getStats();
        console.log('Delivery stats:', stats);

        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <h1 class="text-2xl font-bold text-emerald-600">Delivery Dashboard</h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="text-gray-700">Welcome, ${agent.name} (${agent.agent_id})</span>
                                <button id="logout-btn" class="btn btn-outline">Sign Out</button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="flex items-center">
                                <div class="p-2 bg-yellow-100 rounded-lg">
                                    <i data-lucide="clock" class="w-6 h-6 text-yellow-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Pending</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.pending}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="flex items-center">
                                <div class="p-2 bg-blue-100 rounded-lg">
                                    <i data-lucide="package" class="w-6 h-6 text-blue-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Picked Up</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.picked_up}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="flex items-center">
                                <div class="p-2 bg-purple-100 rounded-lg">
                                    <i data-lucide="truck" class="w-6 h-6 text-purple-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Out for Delivery</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.out_for_delivery}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="flex items-center">
                                <div class="p-2 bg-green-100 rounded-lg">
                                    <i data-lucide="check-circle" class="w-6 h-6 text-green-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Delivered</p>
                                    <p class="text-2xl font-bold text-gray-900">${stats.delivered}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Orders List -->
                    <div class="bg-white rounded-lg shadow">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-semibold text-gray-900">Orders</h2>
                                <button id="refresh-btn" class="btn btn-primary">
                                    <i data-lucide="refresh-cw" class="w-4 h-4 mr-2"></i>
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div id="orders-container" class="p-6">
                            ${this.renderOrders()}
                        </div>
                    </div>
                </main>
            </div>

            <!-- Order Details Modal -->
            <div id="order-modal" class="fixed inset-0 z-50 hidden">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
                <div class="fixed inset-0 flex items-center justify-center p-4">
                    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold">Order Details</h3>
                                <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                                    <i data-lucide="x" class="w-6 h-6"></i>
                                </button>
                            </div>
                            <div id="order-details">
                                <!-- Order details will be loaded here -->
                            </div>
                            <div class="mt-6 flex space-x-3">
                                <button id="update-status-btn" class="btn btn-primary">Update Status</button>
                                <button id="close-modal-btn" class="btn btn-outline">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Update Modal -->
            <div id="status-modal" class="fixed inset-0 z-50 hidden">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
                <div class="fixed inset-0 flex items-center justify-center p-4">
                    <div class="bg-white rounded-lg max-w-md w-full">
                        <div class="p-6">
                            <h3 class="text-lg font-semibold mb-4">Update Order Status</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                                    <select id="status-select" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                        <option value="picked_up">Picked Up</option>
                                        <option value="out_for_delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                    <textarea id="delivery-notes" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" rows="3" placeholder="Add delivery notes..."></textarea>
                                </div>
                            </div>
                            <div class="mt-6 flex space-x-3">
                                <button id="save-status-btn" class="btn btn-primary">Update Status</button>
                                <button id="cancel-status-btn" class="btn btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        initIcons();
        this.attachEventListeners();
    }

    renderOrders() {
        const activeOrdersHtml = this.orders.length === 0 ? `
            <div class="text-center py-8">
                <i data-lucide="package" class="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No active orders</h3>
                <p class="text-gray-600">There are no orders to deliver at the moment.</p>
            </div>
        ` : this.orders.map(order => `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-4">
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Order ID:</span> ${order.id}
                        </div>
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Customer:</span> ${order.customer_name}
                        </div>
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Amount:</span> ₹${order.total_amount}
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${this.getDeliveryStatusClass(order.delivery_status)}">
                            ${this.getDeliveryStatusText(order.delivery_status)}
                        </span>
                        <button class="btn btn-primary text-sm" onclick="app.currentDashboard.viewOrderDetails('${order.id}')">
                            <i data-lucide="eye" class="w-4 h-4 mr-1"></i>
                            View Details
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-600">
                    <div class="flex items-center space-x-4">
                        <span><i data-lucide="phone" class="w-4 h-4 inline mr-1"></i> ${order.customer_mobile}</span>
                        <span><i data-lucide="map-pin" class="w-4 h-4 inline mr-1"></i> ${order.customer_address}</span>
                        <span><i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i> ${new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                ${this.renderOrderItems(order)}
            </div>
        `).join('');

        const previousOrdersHtml = this.previousOrders.length === 0 ? `
            <div class="text-center py-8">
                <i data-lucide="check-circle" class="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No previous orders</h3>
                <p class="text-gray-600">Completed orders will appear here.</p>
            </div>
        ` : this.previousOrders.map(order => `
            <div class="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-4">
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Order ID:</span> ${order.id}
                        </div>
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Customer:</span> ${order.customer_name}
                        </div>
                        <div class="text-sm text-gray-600">
                            <span class="font-medium">Amount:</span> ₹${order.total_amount}
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Delivered
                        </span>
                        <button class="btn btn-outline text-sm" onclick="app.currentDashboard.viewOrderDetails('${order.id}')">
                            View Details
                        </button>
                    </div>
                </div>
                <div class="text-sm text-gray-600">
                    <div class="flex items-center space-x-4">
                        <span><i data-lucide="phone" class="w-4 h-4 inline mr-1"></i> ${order.customer_mobile}</span>
                        <span><i data-lucide="map-pin" class="w-4 h-4 inline mr-1"></i> ${order.customer_address}</span>
                        <span><i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i> ${new Date(order.created_at).toLocaleDateString()}</span>
                        ${order.delivered_at ? `<span><i data-lucide="check-circle" class="w-4 h-4 inline mr-1"></i> Delivered: ${new Date(order.delivered_at).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                ${this.renderOrderItems(order)}
            </div>
        `).join('');

        return `
            <!-- Active Orders Section -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Active Orders</h2>
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">${this.orders.length} Active</span>
                </div>
                <div class="space-y-4">
                    ${activeOrdersHtml}
                </div>
            </div>

            <!-- Previous Orders Section -->
            <div>
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Previous Orders</h2>
                    <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">${this.previousOrders.length} Delivered</span>
                </div>
                <div class="space-y-4">
                    ${previousOrdersHtml}
                </div>
            </div>
        `;
    }

    getStats() {
        return {
            pending: this.orders.filter(o => o.delivery_status === 'pending').length,
            picked_up: this.orders.filter(o => o.delivery_status === 'picked_up').length,
            out_for_delivery: this.orders.filter(o => o.delivery_status === 'out_for_delivery').length,
            delivered: this.previousOrders.length
        };
    }

    getDeliveryStatusText(status) {
        const statusMap = {
            'pending': 'Pending Pickup',
            'picked_up': 'Picked Up',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered'
        };
        return statusMap[status] || status;
    }

    getDeliveryStatusClass(status) {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'picked_up': 'bg-blue-100 text-blue-800',
            'out_for_delivery': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    }

    renderOrderItems(order) {
        console.log('Rendering order items for order:', order.id, order);
        
        // ALWAYS prioritize the actual items from the order over enhanced view data
        // This ensures we show what was actually ordered, not what the view thinks it is
        
        // Handle items array (multi-item orders) - ALWAYS use this for accurate product display
        if (order.items && Array.isArray(order.items) && order.items.length > 0) {
            console.log('Using items array:', order.items.length, 'items');
            return `
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-2 mb-3">
                        <i data-lucide="package" class="w-4 h-4 text-gray-600"></i>
                        <span class="text-sm font-medium text-gray-700">Items to Deliver (${order.items.length})</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${order.items.map((item, index) => `
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <img src="${item.image || 'https://images.unsplash.com/photo-1605027990121-75fd594d6565?w=400'}" 
                                     alt="${item.name || 'Product'}" 
                                     class="w-12 h-12 rounded-lg object-cover">
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm font-medium text-gray-900 truncate">${item.name || 'Product'}</h4>
                                    <p class="text-xs text-gray-600">Qty: ${item.quantity || 1}</p>
                                    <p class="text-xs text-gray-600">₹${item.price || 0}</p>
                                    <p class="text-xs text-gray-500">Total: ₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // No product information available
        console.log('No product information available for order:', order.id);
        return `
            <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <i data-lucide="package" class="w-4 h-4"></i>
                    <span>Product details not available</span>
                </div>
                <div class="mt-2 p-3 bg-yellow-50 rounded-lg">
                    <p class="text-xs text-yellow-700">Order total: ₹${order.total_amount || order.total || 0}</p>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadOrders().then(() => {
                this.render();
            });
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.authManager.signOut();
        });

        // Modal close buttons
        document.getElementById('close-modal').addEventListener('click', () => this.closeOrderModal());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeOrderModal());
        document.getElementById('cancel-status-btn').addEventListener('click', () => this.closeStatusModal());

        // Status update
        document.getElementById('update-status-btn').addEventListener('click', () => this.openStatusModal());
        document.getElementById('save-status-btn').addEventListener('click', () => this.updateOrderStatus());
    }

    async viewOrderDetails(orderId) {
        try {
            const { data: order, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();
            
            if (error) {
                console.error('Error loading order details:', error);
                return;
            }
            
            this.currentOrder = order;
            this.showOrderModal(order);
            
        } catch (error) {
            console.error('Error loading order details:', error);
        }
    }

    showOrderModal(order) {
        const modal = document.getElementById('order-modal');
        const details = document.getElementById('order-details');
        
        details.innerHTML = `
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Order ID</label>
                        <p class="text-sm text-gray-900">${order.id}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <p class="text-sm text-gray-900">${this.getDeliveryStatusText(order.delivery_status)}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Customer Name</label>
                        <p class="text-sm text-gray-900">${order.customer_name}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Mobile</label>
                        <p class="text-sm text-gray-900">${order.customer_mobile}</p>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <p class="text-sm text-gray-900">${order.customer_address}</p>
                    <p class="text-sm text-gray-600">${order.customer_landmark}, ${order.customer_pincode}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Total Amount</label>
                        <p class="text-sm text-gray-900">₹${order.total_amount}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Order Date</label>
                        <p class="text-sm text-gray-900">${new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>
                ${order.delivery_notes ? `
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Delivery Notes</label>
                        <p class="text-sm text-gray-900">${order.delivery_notes}</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    closeOrderModal() {
        document.getElementById('order-modal').classList.add('hidden');
    }

    openStatusModal() {
        document.getElementById('status-modal').classList.remove('hidden');
    }

    closeStatusModal() {
        document.getElementById('status-modal').classList.add('hidden');
    }

    async updateOrderStatus() {
        const newStatus = document.getElementById('status-select').value;
        const notes = document.getElementById('delivery-notes').value;
        
        if (!this.currentOrder) {
            alert('No order selected');
            return;
        }
        
        try {
            const agent = this.authManager.getUser();
            
            // Update order status
            const { error } = await supabase
                .from('orders')
                .update({
                    delivery_status: newStatus,
                    delivery_agent_id: agent.id,
                    delivery_notes: notes,
                    picked_up_at: newStatus === 'picked_up' ? new Date().toISOString() : this.currentOrder.picked_up_at,
                    out_for_delivery_at: newStatus === 'out_for_delivery' ? new Date().toISOString() : this.currentOrder.out_for_delivery_at,
                    delivered_at: newStatus === 'delivered' ? new Date().toISOString() : this.currentOrder.delivered_at,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.currentOrder.id);
            
            if (error) {
                console.error('Error updating order status:', error);
                alert('Failed to update order status');
                return;
            }
            
            alert('Order status updated successfully!');
            this.closeStatusModal();
            this.closeOrderModal();
            await this.loadOrders();
            this.render();
            
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    }
}
// ===== ADMIN DASHBOARD =====
class AdminDashboard {
    constructor(authManager) {
        this.authManager = authManager;
        this.products = [];
        this.orders = [];
        this.agents = [];
        this.activeTab = 'overview';
    }

    async init() {
        await this.loadData();
        this.render();
    }

    async loadData() {
        try {
            // Load products directly from Supabase
            if (supabase && supabaseReady) {
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (productsError) {
                    console.error('Error loading products from Supabase:', productsError);
                    this.products = [];
                } else {
                    this.products = productsData || [];
                }
            } else {
                // Fallback to API if Supabase not ready
                const productsRes = await api.getProducts();
                this.products = productsRes.products || [];
            }
            
            // Load orders
            const token = this.authManager.getToken();
            const ordersRes = await api.getOrders(token);
            this.orders = ordersRes.orders || [];
            
            // Load delivery agents from Supabase
            if (supabase && supabaseReady) {
                const { data: agents, error } = await supabase
                    .from('delivery_agents')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('Error loading delivery agents:', error);
                } else {
                    this.agents = agents || [];
                }
            } else {
                this.agents = [];
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        }
    }

    async seedProducts() {
        const loadingToast = toast.loading('Adding sample products...');
        try {
            let count = 0;
            
            if (supabase && supabaseReady) {
                for (const product of sampleProducts) {
                    // Use Supabase directly for seeding
                    const { error } = await supabase
                        .from('products')
                        .insert([product]);
                    
                    if (error) {
                        console.error('Error seeding product:', error);
                    } else {
                        count++;
                    }
                }
            } else {
                // Fallback to API
                const token = this.authManager.getToken();
                for (const product of sampleProducts) {
                    await api.createProduct(product, token);
                    count++;
                }
            }
            
            toast.dismiss(loadingToast);
            toast.success(`Added ${count} sample products!`);
            await this.loadData();
            this.render();
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Failed to add sample products');
        }
    }

    render() {
        const app = document.getElementById('app');
        if (!app) {
            console.error('App element not found');
            return;
        }
        console.log('AdminDashboard render called, agents count:', this.agents.length);
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <h1 class="text-2xl font-bold text-emerald-600">Admin Dashboard</h1>
                            </div>
                            <div class="flex items-center space-x-4">
                                <button id="create-main-category" class="btn btn-outline">Create Main Category</button>
                                <button id="make-all-instock" class="btn btn-primary">Make All In Stock</button>
                                <button id="seed-products" class="btn btn-outline">Add Sample Products</button>
                                <button id="logout-btn" class="btn btn-outline">Sign Out</button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-emerald-100 rounded-lg">
                                    <i data-lucide="package" class="w-6 h-6 text-emerald-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Total Products</p>
                                    <p class="text-2xl font-semibold text-gray-900">${this.products.length}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-blue-100 rounded-lg">
                                    <i data-lucide="shopping-cart" class="w-6 h-6 text-blue-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p class="text-2xl font-semibold text-gray-900">${this.orders.length}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center">
                                <div class="p-2 bg-purple-100 rounded-lg">
                                    <i data-lucide="truck" class="w-6 h-6 text-purple-600"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-600">Delivery Agents</p>
                                    <p class="text-2xl font-semibold text-gray-900">${this.agents.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add Product Form -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h2 class="text-lg font-semibold text-gray-900">Add New Product</h2>
                        </div>
                        <div class="p-6">
                            <form id="add-product-form" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                        <input type="text" id="product-name" required 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter product name">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Main Category Card *</label>
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            ${mainCategories.map(category => `
                                                <div class="main-category-select-card border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-emerald-400 transition-colors" 
                                                     data-category-id="${category.id}">
                                                    <div class="flex items-center space-x-3">
                                                        <div class="w-8 h-8 rounded-lg ${category.color} flex items-center justify-center">
                                                            <i data-lucide="${category.icon}" class="w-4 h-4 text-white"></i>
                                                        </div>
                                                        <div>
                                                            <h4 class="text-sm font-medium text-gray-900">${category.name}</h4>
                                                            <p class="text-xs text-gray-500">${category.subcategories.length} subcategories</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <input type="hidden" id="product-main-category" name="product-main-category">
                                    </div>
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <label class="block text-sm font-medium text-gray-700">Subcategory *</label>
                                            <button type="button" id="create-category-btn" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                                + Create New Category
                                            </button>
                                        </div>
                                        <select id="product-category" required 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                            <option value="">Select Subcategory</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                    <textarea id="product-description" required rows="3"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Enter product description"></textarea>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                        <input type="number" id="product-price" required min="0" step="0.01"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="0.00">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                        <input type="number" id="product-stock" required min="0"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="0">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                        <select id="product-status" required 
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                            <option value="in_stock">In Stock</option>
                                            <option value="out_of_stock">Out of Stock</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
                                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-400 transition-colors">
                                        <div class="space-y-1 text-center">
                                            <i data-lucide="upload" class="mx-auto h-12 w-12 text-gray-400"></i>
                                            <div class="flex text-sm text-gray-600">
                                                <label for="product-image-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                                    <span>Upload a file</span>
                                                    <input id="product-image-upload" name="product-image-upload" type="file" accept="image/*" class="sr-only">
                                                </label>
                                                <p class="pl-1">or drag and drop</p>
                                            </div>
                                            <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                    <div id="product-image-preview" class="mt-3 hidden">
                                        <img id="product-image-preview-img" class="mx-auto h-32 w-32 object-cover rounded-lg">
                                        <button type="button" id="remove-product-image" class="mt-2 text-sm text-red-600 hover:text-red-500">Remove Image</button>
                                    </div>
                                    <input type="hidden" id="product-image" name="product-image">
                                </div>
                                
                                <div class="flex justify-end space-x-3">
                                    <button type="reset" class="btn btn-outline">Clear Form</button>
                                    <button type="submit" class="btn btn-primary">Add Product</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Edit Product Modal -->
                    <div id="edit-product-modal" class="fixed inset-0 z-50 hidden">
                        <div class="fixed inset-0 bg-black bg-opacity-25" id="edit-modal-overlay"></div>
                        <div class="fixed inset-0 flex items-center justify-center p-4">
                            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div class="px-6 py-4 border-b border-gray-200">
                                    <div class="flex items-center justify-between">
                                        <h2 class="text-lg font-semibold text-gray-900">Edit Product</h2>
                                        <button id="close-edit-modal" class="text-gray-400 hover:text-gray-600">
                                            <i data-lucide="x" class="w-6 h-6"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="p-6">
                                    <form id="edit-product-form" class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                            <input type="text" id="edit-product-name" required 
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                placeholder="Enter product name">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Main Category Card *</label>
                                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                                ${mainCategories.map(category => `
                                                    <div class="edit-main-category-select-card border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-emerald-400 transition-colors" 
                                                         data-category-id="${category.id}">
                                                        <div class="flex items-center space-x-3">
                                                            <div class="w-8 h-8 rounded-lg ${category.color} flex items-center justify-center">
                                                                <i data-lucide="${category.icon}" class="w-4 h-4 text-white"></i>
                                                            </div>
                                                            <div>
                                                                <h4 class="text-sm font-medium text-gray-900">${category.name}</h4>
                                                                <p class="text-xs text-gray-500">${category.subcategories.length} subcategories</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                            <input type="hidden" id="edit-product-main-category" name="edit-product-main-category">
                                        </div>
                                        
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="block text-sm font-medium text-gray-700">Subcategory *</label>
                                                <button type="button" id="edit-create-category-btn" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                                    + Create New Category
                                                </button>
                                            </div>
                                            <select id="edit-product-category" required 
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                                <option value="">Select Subcategory</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                            <textarea id="edit-product-description" required rows="3"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                placeholder="Enter product description"></textarea>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                                <input type="number" id="edit-product-price" required min="0" step="0.01"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    placeholder="0.00">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                                                <input type="number" id="edit-product-stock" required min="0"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                    placeholder="0">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                                <select id="edit-product-status" required 
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                                    <option value="in_stock">In Stock</option>
                                                    <option value="out_of_stock">Out of Stock</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
                                            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-400 transition-colors">
                                                <div class="space-y-1 text-center">
                                                    <i data-lucide="upload" class="mx-auto h-12 w-12 text-gray-400"></i>
                                                    <div class="flex text-sm text-gray-600">
                                                        <label for="edit-product-image-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                                            <span>Upload a file</span>
                                                            <input id="edit-product-image-upload" name="edit-product-image-upload" type="file" accept="image/*" class="sr-only">
                                                        </label>
                                                        <p class="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                            <div id="edit-product-image-preview" class="mt-3">
                                                <img id="edit-product-image-preview-img" class="mx-auto h-32 w-32 object-cover rounded-lg">
                                                <button type="button" id="remove-edit-product-image" class="mt-2 text-sm text-red-600 hover:text-red-500">Remove Image</button>
                                            </div>
                                            <input type="hidden" id="edit-product-image" name="edit-product-image">
                                        </div>
                                        
                                        <div class="flex justify-end space-x-3">
                                            <button type="button" id="cancel-edit" class="btn btn-outline">Cancel</button>
                                            <button type="submit" class="btn btn-primary">Update Product</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Products -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h2 class="text-lg font-semibold text-gray-900">Products (${this.products.length})</h2>
                        </div>
                        <div class="p-6">
                            ${this.products.length === 0 ? `
                                <div class="text-center py-8">
                                    <i data-lucide="package" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                                    <p class="text-gray-500 mb-4">No products yet</p>
                                    <button id="add-sample-products" class="btn btn-primary">Add Sample Products</button>
                                </div>
                            ` : `
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${this.products.map(product => `
                                        <div class="border border-gray-200 rounded-lg p-4 ${(product.stock_quantity === 0 || product.status === 'out_of_stock') ? 'opacity-60' : ''}">
                                            <div style="height: 180px; width: 100%; overflow: hidden; border-radius: 0.375rem; margin-bottom: 0.75rem;"><img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                                            <h3 class="font-semibold text-gray-900 mb-2">${product.name}</h3>
                                            <p class="text-gray-600 text-sm mb-2">${product.description}</p>
                                            <p class="text-lg font-bold text-emerald-600 mb-2">${formatCurrency(product.price)}</p>
                                            <div class="mb-3">
                                                <span class="text-xs ${product.stock_quantity > 0 && product.status === 'in_stock' ? 'text-green-600' : 'text-red-600'} font-medium">
                                                    ${product.stock_quantity > 0 && product.status === 'in_stock' ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                                                </span>
                                            </div>
                                            <div class="flex space-x-2">
                                                <button class="edit-product-btn btn btn-outline text-xs" data-id="${product.id}" data-product='${JSON.stringify(product)}'>Edit</button>
                                                <button class="delete-product-btn btn btn-destructive text-xs" data-id="${product.id}">Delete</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Delivery Agents Management -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-semibold text-gray-900">Delivery Agents</h2>
                                <button id="add-delivery-agent" class="btn btn-primary">
                                    <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                                    Add Agent
                                </button>
                            </div>
                        </div>
                        <div class="p-6">
                            <div id="delivery-agents-list">
                                <!-- Delivery agents will be rendered here -->
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        initIcons();
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Add product form
        const addProductForm = document.getElementById('add-product-form');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddProduct();
            });
        }

        // Auto-update status based on stock quantity
        const stockInput = document.getElementById('product-stock');
        const statusSelect = document.getElementById('product-status');
        if (stockInput && statusSelect) {
            stockInput.addEventListener('input', (e) => {
                const stock = parseInt(e.target.value) || 0;
                if (stock === 0) {
                    statusSelect.value = 'out_of_stock';
                } else {
                    statusSelect.value = 'in_stock';
                }
            });

            // Auto-update stock quantity based on status
            statusSelect.addEventListener('change', (e) => {
                const status = e.target.value;
                if (status === 'out_of_stock') {
                    stockInput.value = 0;
                } else if (status === 'in_stock' && (parseInt(stockInput.value) || 0) === 0) {
                    stockInput.value = 1; // Set minimum stock of 1 for in_stock
                }
            });
        }

        // Image upload handling for add product form
        this.setupImageUpload('product-image-upload', 'product-image-preview', 'product-image-preview-img', 'remove-product-image', 'product-image');

        // Category card selection for add product form
        this.setupCategoryCardSelection('main-category-select-card', 'product-main-category', 'product-category');

        // Create category button for add product form
        const createCategoryBtn = document.getElementById('create-category-btn');
        if (createCategoryBtn) {
            createCategoryBtn.addEventListener('click', () => {
                this.openCreateCategoryModal('product-main-category', 'product-category');
            });
        }

        // Edit product form
        const editProductForm = document.getElementById('edit-product-form');
        if (editProductForm) {
            editProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditProduct();
            });
        }

        // Auto-update status for edit form
        const editStockInput = document.getElementById('edit-product-stock');
        const editStatusSelect = document.getElementById('edit-product-status');
        if (editStockInput && editStatusSelect) {
            editStockInput.addEventListener('input', (e) => {
                const stock = parseInt(e.target.value) || 0;
                if (stock === 0) {
                    editStatusSelect.value = 'out_of_stock';
                } else {
                    editStatusSelect.value = 'in_stock';
                }
            });

            // Auto-update stock quantity based on status
            editStatusSelect.addEventListener('change', (e) => {
                const status = e.target.value;
                if (status === 'out_of_stock') {
                    editStockInput.value = 0;
                } else if (status === 'in_stock' && (parseInt(editStockInput.value) || 0) === 0) {
                    editStockInput.value = 1; // Set minimum stock of 1 for in_stock
                }
            });
        }

        // Image upload handling for edit product form
        this.setupImageUpload('edit-product-image-upload', 'edit-product-image-preview', 'edit-product-image-preview-img', 'remove-edit-product-image', 'edit-product-image');

        // Category card selection for edit product form
        this.setupCategoryCardSelection('edit-main-category-select-card', 'edit-product-main-category', 'edit-product-category');

        // Create category button for edit product form
        const editCreateCategoryBtn = document.getElementById('edit-create-category-btn');
        if (editCreateCategoryBtn) {
            editCreateCategoryBtn.addEventListener('click', () => {
                this.openCreateCategoryModal('edit-product-main-category', 'edit-product-category');
            });
        }

        // Edit product buttons
        document.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productData = JSON.parse(e.target.dataset.product);
                this.openEditModal(productData);
            });
        });

        // Delete product buttons
        document.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.handleDeleteProduct(productId);
            });
        });

        // Close edit modal
        const closeEditModal = document.getElementById('close-edit-modal');
        const cancelEdit = document.getElementById('cancel-edit');
        const editModalOverlay = document.getElementById('edit-modal-overlay');
        const editModal = document.getElementById('edit-product-modal');

        if (closeEditModal) {
            closeEditModal.addEventListener('click', () => this.closeEditModal());
        }
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.closeEditModal());
        }
        if (editModalOverlay) {
            editModalOverlay.addEventListener('click', () => this.closeEditModal());
        }

        // Create main category
        const createMainCategoryBtn = document.getElementById('create-main-category');
        if (createMainCategoryBtn) {
            createMainCategoryBtn.addEventListener('click', () => this.openCreateMainCategoryModal());
        }

        // Make all in stock
        const makeAllInStockBtn = document.getElementById('make-all-instock');
        if (makeAllInStockBtn) {
            makeAllInStockBtn.addEventListener('click', () => this.makeAllInStock());
        }

        // Seed products
        const seedBtn = document.getElementById('seed-products');
        const addSampleBtn = document.getElementById('add-sample-products');
        if (seedBtn) seedBtn.addEventListener('click', () => this.seedProducts());
        if (addSampleBtn) addSampleBtn.addEventListener('click', () => this.seedProducts());

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.authManager.signOut();
        });

        // Delivery agent management
        this.setupDeliveryAgentManagement();
    }

    setupDeliveryAgentManagement() {
        console.log('Setting up delivery agent management...');
        // Add delivery agent button
        const addDeliveryAgentBtn = document.getElementById('add-delivery-agent');
        console.log('Add delivery agent button found:', !!addDeliveryAgentBtn);
        if (addDeliveryAgentBtn) {
            addDeliveryAgentBtn.addEventListener('click', () => {
                this.openAddDeliveryAgentModal();
            });
        }

        // Load delivery agents
        this.loadDeliveryAgents();
    }

    async loadDeliveryAgents() {
        try {
            if (supabase && supabaseReady) {
                const { data: agents, error } = await supabase
                    .from('delivery_agents')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.error('Error loading delivery agents:', error);
                    return;
                }
                
                this.agents = agents || [];
                this.renderDeliveryAgents();
            }
        } catch (error) {
            console.error('Error loading delivery agents:', error);
        }
    }

    renderDeliveryAgents() {
        const container = document.getElementById('delivery-agents-list');
        if (!container) return;

        if (this.agents.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="truck" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">No delivery agents</h3>
                    <p class="text-gray-600">Add your first delivery agent to get started.</p>
                </div>
            `;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        const agentsHtml = this.agents.map(agent => `
            <div class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                            <i data-lucide="user" class="w-6 h-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${agent.name}</h3>
                            <p class="text-sm text-gray-600">ID: ${agent.agent_id}</p>
                            <p class="text-sm text-gray-600">${agent.email || agent.mobile}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            agent.status === 'active' ? 'bg-green-100 text-green-800' : 
                            agent.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                        }">
                            ${agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                        <button class="text-red-600 hover:text-red-700 text-sm" onclick="app.currentDashboard.deleteDeliveryAgent('${agent.id}')">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = agentsHtml;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    openAddDeliveryAgentModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full mx-4">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Add Delivery Agent</h3>
                        <button id="close-agent-modal" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <form id="add-agent-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Agent ID</label>
                            <div class="flex space-x-2">
                                <input type="text" id="agent-id" required
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="e.g., DEL001">
                                <button type="button" id="generate-agent-id" class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" id="agent-name" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter agent name">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="agent-email"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter email (optional)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                            <input type="tel" id="agent-mobile"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter mobile number (optional)">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" id="agent-password" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter password">
                        </div>
                        <div class="flex space-x-3">
                            <button type="submit" class="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                                Add Agent
                            </button>
                            <button type="button" id="cancel-agent" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Event listeners
        document.getElementById('close-agent-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('cancel-agent').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('add-agent-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddDeliveryAgent();
        });

        // Generate unique agent ID
        document.getElementById('generate-agent-id').addEventListener('click', () => {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 1000);
            const agentId = `DEL${timestamp.toString().slice(-6)}${randomNum}`;
            document.getElementById('agent-id').value = agentId;
        });
    }
    async handleAddDeliveryAgent() {
        try {
            const agentId = document.getElementById('agent-id').value.trim();
            const name = document.getElementById('agent-name').value.trim();
            const email = document.getElementById('agent-email').value.trim();
            const mobile = document.getElementById('agent-mobile').value.trim();
            const password = document.getElementById('agent-password').value;

            if (!agentId || !name || !password) {
                toast.error('Please fill in all required fields');
                return;
            }

            if (!email && !mobile) {
                toast.error('Please provide either email or mobile number');
                return;
            }

            const hashedPassword = btoa(password + 'mango_mart_salt');

            if (supabase && supabaseReady) {
                const { error } = await supabase
                    .from('delivery_agents')
                    .insert({
                        agent_id: agentId,
                        name: name,
                        email: email || null,
                        mobile: mobile || null,
                        password: hashedPassword,
                        status: 'active'
                    });

                if (error) {
                    console.error('Error creating delivery agent:', error);
                    if (error.code === '23505') {
                        toast.error('Agent ID already exists. Please use a different ID.');
                    } else {
                        toast.error('Failed to create delivery agent');
                    }
                    return;
                }

                toast.success('Delivery agent created successfully!');
                
                // Close modal
                const modal = document.querySelector('.fixed.inset-0.z-50');
                if (modal && modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }

                // Reload agents
                await this.loadDeliveryAgents();
            } else {
                toast.error('Database not available');
            }

        } catch (error) {
            console.error('Error creating delivery agent:', error);
            toast.error('Failed to create delivery agent');
        }
    }

    async deleteDeliveryAgent(agentId) {
        if (!confirm('Are you sure you want to delete this delivery agent?')) {
            return;
        }

        try {
            if (supabase && supabaseReady) {
                const { error } = await supabase
                    .from('delivery_agents')
                    .delete()
                    .eq('id', agentId);

                if (error) {
                    console.error('Error deleting delivery agent:', error);
                    toast.error('Failed to delete delivery agent');
                    return;
                }

                toast.success('Delivery agent deleted successfully!');
                await this.loadDeliveryAgents();
            } else {
                toast.error('Database not available');
            }

        } catch (error) {
            console.error('Error deleting delivery agent:', error);
            toast.error('Failed to delete delivery agent');
        }
    }

    async handleAddProduct() {
        try {
            const name = document.getElementById('product-name').value;
            const mainCategoryId = document.getElementById('product-main-category').value;
            const subcategory = document.getElementById('product-category').value;
            const description = document.getElementById('product-description').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const stock = parseInt(document.getElementById('product-stock').value);
            const statusInput = document.getElementById('product-status').value;
            const image = document.getElementById('product-image').value;

            // Validate main category selection
            if (!mainCategoryId) {
                toast.error('Please select a main category card');
                return;
            }

            // Auto-set status based on stock
            let status = stock === 0 ? 'out_of_stock' : statusInput;

            const newProduct = {
                id: 'PROD' + Date.now(),
                name,
                main_category: mainCategoryId,
                subcategory: subcategory,
                description,
                price,
                stock_quantity: stock,
                status,
                image,
                created_at: new Date().toISOString()
            };

            const loadingToast = toast.loading('Adding product...');
            
            if (supabase && supabaseReady) {
                // Insert directly into Supabase
                const { data, error } = await supabase
                    .from('products')
                    .insert([newProduct])
                    .select()
                    .single();
                
                if (error) {
                    console.error('Supabase error:', error);
                    toast.dismiss(loadingToast);
                    toast.error('Failed to add product: ' + (error.message || 'Unknown error'));
                    return;
                }
            } else {
                // Fallback to API
                const token = this.authManager.getToken();
                await api.createProduct(newProduct, token);
            }
            
            toast.dismiss(loadingToast);
            toast.success('Product added successfully!');
            
            // Reset form
            document.getElementById('add-product-form').reset();
            document.getElementById('product-image-preview').classList.add('hidden');
            
            // Reload data and refresh
            await this.loadData();
            this.render();
            
            // Notify other dashboards to refresh their data
            this.notifyDataChange();
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product: ' + (error.message || 'Unknown error'));
        }
    }

    async openEditModal(product) {
        this.currentEditingProduct = product;
        
        // Populate form with product data
        document.getElementById('edit-product-name').value = product.name || '';
        document.getElementById('edit-product-description').value = product.description || '';
        document.getElementById('edit-product-price').value = product.price || '';
        document.getElementById('edit-product-stock').value = product.stock_quantity || 0;
        document.getElementById('edit-product-status').value = product.status || 'in_stock';
        
        // Handle category selection
        if (product.category) {
            const mainCategory = this.findMainCategoryFromSubcategory(product.category);
            if (mainCategory) {
                // Select the main category card
                const categoryCard = document.querySelector(`[data-category-id="${mainCategory.id}"]`);
                if (categoryCard) {
                    // Remove selection from all cards
                    document.querySelectorAll('.edit-main-category-select-card').forEach(c => 
                        c.classList.remove('border-emerald-500', 'bg-emerald-50'));
                    
                    // Add selection to the correct card
                    categoryCard.classList.add('border-emerald-500', 'bg-emerald-50');
                    
                    // Set hidden input
                    document.getElementById('edit-product-main-category').value = mainCategory.id;
                    
                    // Populate subcategories with newest first
                    const subcategorySelect = document.getElementById('edit-product-category');
                    subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
                    const subcategories = [...mainCategory.subcategories];
                    subcategories.reverse().forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory;
                        option.textContent = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
                        if (subcategory === product.category) {
                            option.selected = true;
                        }
                        subcategorySelect.appendChild(option);
                    });
                }
            }
        }
        
        // Handle existing image
        if (product.image) {
            const editPreviewImg = document.getElementById('edit-product-image-preview-img');
            const editPreviewDiv = document.getElementById('edit-product-image-preview');
            const editHiddenInput = document.getElementById('edit-product-image');
            
            if (product.image.startsWith('data:')) {
                // Already a base64 image
                editPreviewImg.src = product.image;
                editHiddenInput.value = product.image;
            } else {
                // Convert URL to base64
                try {
                    const base64Image = await this.loadImageAsBase64(product.image);
                    editPreviewImg.src = base64Image;
                    editHiddenInput.value = base64Image;
                } catch (error) {
                    // Fallback to original URL
                    editPreviewImg.src = product.image;
                    editHiddenInput.value = product.image;
                }
            }
            editPreviewDiv.classList.remove('hidden');
        }
        
        // Show modal
        document.getElementById('edit-product-modal').classList.remove('hidden');
    }

    closeEditModal() {
        document.getElementById('edit-product-modal').classList.add('hidden');
        this.currentEditingProduct = null;
    }

    async handleEditProduct() {
        try {
            const name = document.getElementById('edit-product-name').value;
            const mainCategoryId = document.getElementById('edit-product-main-category').value;
            const subcategory = document.getElementById('edit-product-category').value;
            const description = document.getElementById('edit-product-description').value;
            const price = parseFloat(document.getElementById('edit-product-price').value);
            const stock = parseInt(document.getElementById('edit-product-stock').value);
            const statusInput = document.getElementById('edit-product-status').value;
            const image = document.getElementById('edit-product-image').value;

            // Validate main category selection
            if (!mainCategoryId) {
                toast.error('Please select a main category card');
                return;
            }

            // Auto-set status based on stock
            let status = stock === 0 ? 'out_of_stock' : statusInput;

            const updatedProduct = {
                name,
                main_category: mainCategoryId,
                subcategory: subcategory,
                description,
                price,
                stock_quantity: stock,
                status,
                image,
                updated_at: new Date().toISOString()
            };

            const loadingToast = toast.loading('Updating product...');
            
            if (supabase && supabaseReady) {
                // Update directly in Supabase
                const { data, error } = await supabase
                    .from('products')
                    .update(updatedProduct)
                    .eq('id', this.currentEditingProduct.id)
                    .select()
                    .single();
                
                if (error) {
                    console.error('Supabase error:', error);
                    toast.dismiss(loadingToast);
                    toast.error('Failed to update product: ' + (error.message || 'Unknown error'));
                    return;
                }
            } else {
                // Fallback to API
                const token = this.authManager.getToken();
                await api.updateProduct(this.currentEditingProduct.id, updatedProduct, token);
            }
            
            toast.dismiss(loadingToast);
            toast.success('Product updated successfully!');
            
            // Close modal
            this.closeEditModal();
            
            // Reload data and refresh
            await this.loadData();
            this.render();
            
            // Notify other dashboards to refresh their data
            this.notifyDataChange();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product: ' + (error.message || 'Unknown error'));
        }
    }

    async handleDeleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        try {
            const loadingToast = toast.loading('Deleting product...');
            
            if (supabase && supabaseReady) {
                // Delete directly from Supabase
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productId);
                
                if (error) {
                    console.error('Supabase error:', error);
                    toast.dismiss(loadingToast);
                    toast.error('Failed to delete product: ' + (error.message || 'Unknown error'));
                    return;
                }
            } else {
                // Fallback to API
                const token = this.authManager.getToken();
                await api.deleteProduct(productId, token);
            }
            
            toast.dismiss(loadingToast);
            toast.success('Product deleted successfully!');
            
            // Reload data and refresh
            await this.loadData();
            this.render();
            
            // Notify other dashboards to refresh their data
            this.notifyDataChange();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product: ' + (error.message || 'Unknown error'));
        }
    }

    setupImageUpload(uploadInputId, previewDivId, previewImgId, removeBtnId, hiddenInputId) {
        const uploadInput = document.getElementById(uploadInputId);
        const previewDiv = document.getElementById(previewDivId);
        const previewImg = document.getElementById(previewImgId);
        const removeBtn = document.getElementById(removeBtnId);
        const hiddenInput = document.getElementById(hiddenInputId);

        if (!uploadInput || !previewDiv || !previewImg || !removeBtn || !hiddenInput) return;

        // Handle file selection
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file, previewImg, previewDiv, hiddenInput);
            }
        });

        // Handle drag and drop
        const uploadArea = uploadInput.closest('.border-dashed');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('border-emerald-400', 'bg-emerald-50');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-emerald-400', 'bg-emerald-50');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-emerald-400', 'bg-emerald-50');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleImageUpload(files[0], previewImg, previewDiv, hiddenInput);
                }
            });
        }

        // Handle remove image
        removeBtn.addEventListener('click', () => {
            this.removeImage(uploadInput, previewDiv, hiddenInput);
        });
    }

    handleImageUpload(file, previewImg, previewDiv, hiddenInput) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size must be less than 10MB');
            return;
        }

        // Load image and validate aspect ratio
        const img = new Image();
        img.onload = () => {
            // Check aspect ratio (16:9)
            const width = img.width;
            const height = img.height;
            const aspectRatio = width / height;
            const targetRatio = 16 / 9; // 1.777...
            const tolerance = 0.05; // 5% tolerance
            
            // Allow slight variations in aspect ratio
            if (Math.abs(aspectRatio - targetRatio) > tolerance) {
                const optimalWidth = 2560;
                const optimalHeight = 1440;
                const message = `Image aspect ratio must be 16:9 (current: ${aspectRatio.toFixed(2)}).\n\nRecommended dimensions: ${optimalWidth}×${optimalHeight}px\n\nAccepted range: ${(targetRatio - tolerance).toFixed(2)} to ${(targetRatio + tolerance).toFixed(2)}`;
                toast.error(message);
                console.warn('Image aspect ratio error:', { width, height, aspectRatio, targetRatio });
                return;
            }

            // Aspect ratio is correct, proceed with upload
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result;
                previewImg.src = base64Data;
                previewDiv.classList.remove('hidden');
                hiddenInput.value = base64Data;
                
                // Show success message with image dimensions
                console.log(`✅ Image validated: ${width}×${height}px (Aspect ratio: ${aspectRatio.toFixed(3)})`);
            };
            reader.readAsDataURL(file);
        };

        img.onerror = () => {
            toast.error('Failed to load image. Please try another file');
        };

        // Start loading the image
        img.src = URL.createObjectURL(file);
    }

    removeImage(uploadInput, previewDiv, hiddenInput) {
        uploadInput.value = '';
        previewDiv.classList.add('hidden');
        hiddenInput.value = '';
    }

    // Helper method to convert image URL to base64 (for edit modal)
    async loadImageAsBase64(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error loading image:', error);
            return imageUrl; // Fallback to original URL
        }
    }

    setupCategoryCardSelection(cardSelector, hiddenInputId, subcategorySelectId) {
        const cards = document.querySelectorAll(`.${cardSelector}`);
        const hiddenInput = document.getElementById(hiddenInputId);
        const subcategorySelect = document.getElementById(subcategorySelectId);

        if (!cards.length || !hiddenInput || !subcategorySelect) return;

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selection from all cards
                cards.forEach(c => c.classList.remove('border-emerald-500', 'bg-emerald-50'));
                
                // Add selection to clicked card
                card.classList.add('border-emerald-500', 'bg-emerald-50');
                
                // Get selected category
                const categoryId = card.dataset.categoryId;
                const selectedCategory = mainCategories.find(cat => cat.id === categoryId);
                
                if (selectedCategory) {
                    // Set hidden input
                    hiddenInput.value = categoryId;
                    
                    // Populate subcategories with newest first
                    subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
                    const subcategories = [...selectedCategory.subcategories];
                    subcategories.reverse().forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory;
                        option.textContent = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
                        subcategorySelect.appendChild(option);
                    });
                }
            });
        });
    }

    // Helper method to find main category from subcategory
    findMainCategoryFromSubcategory(subcategory) {
        for (const mainCategory of mainCategories) {
            if (mainCategory.subcategories.includes(subcategory)) {
                return mainCategory;
            }
        }
        return null;
    }

    openCreateCategoryModal(mainCategoryInputId, subcategorySelectId) {
        // Check if main category is selected
        const mainCategoryInput = document.getElementById(mainCategoryInputId);
        if (!mainCategoryInput.value) {
            toast.error('Please select a main category first');
            return;
        }

        // Get the selected main category
        const selectedMainCategory = mainCategories.find(cat => cat.id === mainCategoryInput.value);
        if (!selectedMainCategory) {
            toast.error('Invalid main category selected');
            return;
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">Create New Category</h3>
                            <button id="close-create-category-modal" class="text-gray-400 hover:text-gray-600">
                                <i data-lucide="x" class="w-6 h-6"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="mb-4">
                            <p class="text-sm text-gray-600 mb-2">Adding to: <span class="font-medium text-emerald-600">${selectedMainCategory.name}</span></p>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                            <input type="text" id="new-category-name" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter category name">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                            <textarea id="new-category-description" rows="2"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter category description"></textarea>
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button type="button" id="cancel-create-category" class="btn btn-outline">Cancel</button>
                            <button type="button" id="confirm-create-category" class="btn btn-primary">Create Category</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        initIcons();

        // Event listeners
        document.getElementById('close-create-category-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('cancel-create-category').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('confirm-create-category').addEventListener('click', () => {
            this.handleCreateCategory(selectedMainCategory, subcategorySelectId, modal);
        });

        // Close on overlay click
        modal.querySelector('.fixed.inset-0.bg-black').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    handleCreateCategory(mainCategory, subcategorySelectId, modal) {
        const categoryName = document.getElementById('new-category-name').value.trim();
        const categoryDescription = document.getElementById('new-category-description').value.trim();

        if (!categoryName) {
            toast.error('Please enter a category name');
            return;
        }

        // Check if category already exists
        if (mainCategory.subcategories.includes(categoryName.toLowerCase())) {
            toast.error('This category already exists');
            return;
        }

        // Add new category to main category
        const newCategory = categoryName.toLowerCase();
        mainCategory.subcategories.push(newCategory);
        
        // Update the mainCategories array to reflect the change
        const categoryIndex = mainCategories.findIndex(cat => cat.id === mainCategory.id);
        if (categoryIndex !== -1) {
            mainCategories[categoryIndex] = mainCategory;
        }

        // Update the subcategory select
        const subcategorySelect = document.getElementById(subcategorySelectId);
        const newOption = document.createElement('option');
        newOption.value = newCategory;
        newOption.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        newOption.selected = true;
        subcategorySelect.appendChild(newOption);

        // Show success message
        toast.success(`Category "${categoryName}" created successfully!`);

        // Close modal
        document.body.removeChild(modal);
        
        // Notify data change for main categories
        window.dispatchEvent(new CustomEvent('mainCategoriesChanged'));
        
        // Notify subcategory changes
        window.dispatchEvent(new CustomEvent('subcategoriesChanged'));
        
        // Refresh subcategory dropdowns
        this.refreshSubcategoryDropdowns();
    }

    async makeAllInStock() {
        if (this.products.length === 0) {
            toast.error('No products to update');
            return;
        }

        // Show confirmation dialog
        const outOfStockProducts = this.products.filter(p => p.status === 'out_of_stock' || p.stock_quantity === 0 || p.stock === 0);
        const message = outOfStockProducts.length > 0 
            ? `This will set ${outOfStockProducts.length} out-of-stock products to "In Stock" with stock quantity 1. Continue?`
            : `This will ensure all ${this.products.length} products are set to "In Stock" with stock quantity 1. Continue?`;

        if (!confirm(message)) {
            return;
        }

        const loadingToast = toast.loading('Updating all products to In Stock...');
        
        try {
            let updatedCount = 0;
            
            if (supabase && supabaseReady) {
                // Update each product directly in Supabase
                for (const product of this.products) {
                    const stockQuantity = (product.stock_quantity || product.stock) === 0 ? 1 : (product.stock_quantity || product.stock);
                    
                    const { error } = await supabase
                        .from('products')
                        .update({
                            status: 'in_stock',
                            stock_quantity: stockQuantity,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', product.id);
                    
                    if (error) {
                        console.error(`Error updating product ${product.id}:`, error);
                    } else {
                        updatedCount++;
                    }
                }
            } else {
                // Fallback to API
                const token = this.authManager.getToken();
                for (const product of this.products) {
                    const updatedProduct = {
                        ...product,
                        status: 'in_stock',
                        stock_quantity: product.stock_quantity === 0 ? 1 : product.stock_quantity,
                        stock: product.stock === 0 ? 1 : product.stock,
                        updated_at: new Date().toISOString()
                    };
                    await api.updateProduct(product.id, updatedProduct, token);
                    updatedCount++;
                }
            }
            
            toast.dismiss(loadingToast);
            toast.success(`Updated ${updatedCount} products to In Stock!`);
            
            // Reload data and refresh
            await this.loadData();
            this.render();
            
            // Notify other dashboards to refresh their data
            this.notifyDataChange();
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error('Error updating products:', error);
            toast.error('Failed to update products: ' + (error.message || 'Unknown error'));
        }
    }

    notifyDataChange() {
        // Dispatch a custom event to notify other dashboards
        window.dispatchEvent(new CustomEvent('productsChanged'));
    }
    openCreateMainCategoryModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            <div class="fixed inset-0 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">Create Main Category</h3>
                            <button id="close-create-main-category-modal" class="text-gray-400 hover:text-gray-600">
                                <i data-lucide="x" class="w-6 h-6"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                            <input type="text" id="new-main-category-name" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter category name">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <input type="text" id="new-main-category-description" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter category description">
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                            <select id="new-main-category-icon" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                <option value="shopping-cart">Shopping Cart</option>
                                <option value="heart">Heart</option>
                                <option value="star">Star</option>
                                <option value="gift">Gift</option>
                                <option value="home">Home</option>
                                <option value="book">Book</option>
                                <option value="music">Music</option>
                                <option value="camera">Camera</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                            <select id="new-main-category-color" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                <option value="from-pink-400 to-rose-600">Pink to Rose</option>
                                <option value="from-blue-400 to-cyan-600">Blue to Cyan</option>
                                <option value="from-yellow-400 to-orange-500">Yellow to Orange</option>
                                <option value="from-teal-400 to-emerald-600">Teal to Emerald</option>
                                <option value="from-indigo-400 to-purple-600">Indigo to Purple</option>
                                <option value="from-red-400 to-pink-600">Red to Pink</option>
                            </select>
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button type="button" id="cancel-create-main-category" class="btn btn-outline">Cancel</button>
                            <button type="button" id="confirm-create-main-category" class="btn btn-primary">Create Category</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        initIcons();

        // Event listeners
        document.getElementById('close-create-main-category-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('cancel-create-main-category').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('confirm-create-main-category').addEventListener('click', () => {
            this.handleCreateMainCategory(modal);
        });

        // Close on overlay click
        modal.querySelector('.fixed.inset-0.bg-black').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    handleCreateMainCategory(modal) {
        const name = document.getElementById('new-main-category-name').value.trim();
        const description = document.getElementById('new-main-category-description').value.trim();
        const icon = document.getElementById('new-main-category-icon').value;
        const color = document.getElementById('new-main-category-color').value;

        if (!name) {
            toast.error('Please enter a category name');
            return;
        }

        // Check if category already exists
        if (mainCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            toast.error('This category already exists');
            return;
        }

        // Create new main category
        const newMainCategory = {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            icon: icon,
            color: color,
            description: description || `${name} products`,
            subcategories: []
        };

        // Add to mainCategories array
        mainCategories.push(newMainCategory);

        // Show success message
        toast.success(`Main category "${name}" created successfully!`);

        // Close modal
        document.body.removeChild(modal);

        // Notify data change
        this.notifyDataChange();
        
        // Notify main category changes
        window.dispatchEvent(new CustomEvent('mainCategoriesChanged'));
        
        // Refresh subcategory dropdowns
        this.refreshSubcategoryDropdowns();

        // Reload admin dashboard
        this.render();
    }

    refreshSubcategoryDropdowns() {
        // Refresh add product form subcategory dropdown
        const addMainCategoryInput = document.getElementById('product-main-category');
        const addSubcategorySelect = document.getElementById('product-category');
        
        if (addMainCategoryInput && addSubcategorySelect && addMainCategoryInput.value) {
            const selectedCategory = mainCategories.find(cat => cat.id === addMainCategoryInput.value);
            if (selectedCategory) {
                addSubcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
                
                // Add subcategories with newest first
                const subcategories = [...selectedCategory.subcategories];
                subcategories.reverse().forEach(subcategory => {
                    const option = document.createElement('option');
                    option.value = subcategory;
                    option.textContent = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
                    addSubcategorySelect.appendChild(option);
                });
            }
        }

        // Refresh edit product form subcategory dropdown
        const editMainCategoryInput = document.getElementById('edit-product-main-category');
        const editSubcategorySelect = document.getElementById('edit-product-category');
        
        if (editMainCategoryInput && editSubcategorySelect && editMainCategoryInput.value) {
            const selectedCategory = mainCategories.find(cat => cat.id === editMainCategoryInput.value);
            if (selectedCategory) {
                editSubcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
                
                // Add subcategories with newest first
                const subcategories = [...selectedCategory.subcategories];
                subcategories.reverse().forEach(subcategory => {
                    const option = document.createElement('option');
                    option.value = subcategory;
                    option.textContent = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
                    editSubcategorySelect.appendChild(option);
                });
            }
        }
    }
}

// ===== MAIN APPLICATION =====



class MangoMartApp {
    constructor() {
        this.authManager = new AuthManager();
        this.currentDashboard = null;
    }

    async init() {
        // Initialize Supabase first
        console.log('🚀 Initializing Supabase...');
        await initSupabase();
        
        // Wait for Supabase to be ready
        let attempts = 0;
        while (!supabaseReady && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!supabaseReady) {
            console.warn('⚠️ Supabase not ready after timeout, continuing with fallback...');
        } else {
            console.log('✅ Supabase ready, proceeding with app initialization');
        }
        
        // Initialize authentication manager
        console.log('🔐 Initializing Authentication...');
        await this.authManager.init((isAuthenticated, role) => {
            this.handleAuthChange(isAuthenticated, role);
        });
        
        // Listen for product changes from admin dashboard
        window.addEventListener('productsChanged', () => {
            console.log('Products changed event received');
            if (this.currentDashboard && this.currentDashboard.loadData) {
                this.currentDashboard.loadData().then(() => {
                    if (this.currentDashboard.render) {
                        this.currentDashboard.render();
                    }
                });
            }
        });
        
        // Listen for main category changes from admin dashboard
        window.addEventListener('mainCategoriesChanged', () => {
            if (this.currentDashboard && this.currentDashboard.render) {
                this.currentDashboard.render();
            }
        });
        
        // Listen for subcategory changes from admin dashboard
        window.addEventListener('subcategoriesChanged', () => {
            // Force re-render of the current view
            if (this.currentDashboard) {
                if (this.currentDashboard.currentView === 'category' && this.currentDashboard.renderCategoryPage) {
                    this.currentDashboard.renderCategoryPage();
                } else if (this.currentDashboard.render) {
                    this.currentDashboard.render();
                }
            }
        });
    }

    handleAuthChange(isAuthenticated, role) {
        if (!isAuthenticated) {
            this.authManager.renderAuthPage();
            this.currentDashboard = null;
        } else {
            this.loadDashboard(role);
        }
    }

    async loadDashboard(role) {
        console.log('=== LOADING DASHBOARD ===');
        console.log('Role received:', role);
        console.log('Role type:', typeof role);
        console.log('Current dashboard:', this.currentDashboard?.constructor?.name);
        
        // Prevent loading the same dashboard twice
        const expectedDashboard = role === 'admin' ? 'AdminDashboard' : 
                                 role === 'delivery' ? 'DeliveryDashboard' : 'CustomerDashboard';
        
        if (this.currentDashboard?.constructor?.name === expectedDashboard) {
            console.log('Dashboard already loaded, skipping...');
            return;
        }
        
        // Clear current dashboard
        if (this.currentDashboard) {
            console.log('Clearing current dashboard...');
            this.currentDashboard = null;
        }

        switch (role) {
            case 'admin':
                console.log('Loading Admin Dashboard...');
                this.currentDashboard = new AdminDashboard(this.authManager);
                await this.currentDashboard.init();
                break;
            
            case 'delivery':
                console.log('Loading Delivery Dashboard...');
                this.currentDashboard = new DeliveryDashboard(this.authManager);
                await this.currentDashboard.init();
                break;
            
            case 'customer':
            default:
                console.log('Loading Customer Dashboard...');
                this.currentDashboard = new CustomerDashboard(this.authManager);
                await this.currentDashboard.init();
                break;
        }
        
        console.log('Dashboard loaded:', this.currentDashboard?.constructor?.name);
    }

    async createAdminUser() {
        console.log('Creating admin user...');
        try {
            const adminData = {
                name: 'Admin User',
                email: 'varunraj173205@gmail.com',
                mobile: '9876543210',
                password: 'varun@173205',
                role: 'admin'
            };
            
            const result = await db.createUser(adminData);
            console.log('Admin user created:', result);
            return result;
        } catch (error) {
            console.error('Error creating admin user:', error);
            return { error: error.message };
        }
    }

    async createTestOrder() {
        console.log('Creating test order...');
        try {
            const testOrder = {
                id: 'TEST-' + Date.now(),
                customer_id: 'test-customer-id',
                customer_name: 'Test Customer',
                customer_email: 'test@example.com',
                customer_mobile: '9876543210',
                customer_address: '123 Test Street',
                customer_landmark: 'Near Test Mall',
                customer_pincode: '123456',
                items: [
                    { id: '1', name: 'Test Product', price: 100, quantity: 1 }
                ],
                total_amount: 100,
                status: 'confirmed',
                payment_status: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
                payment_id: 'test_payment_' + Date.now(),
                payment_signature: 'test_signature',
                created_at: new Date().toISOString(),
                paid_at: orderData.paymentMethod === 'cod' ? null : new Date().toISOString(),
                product_id: '1',
                delivery_status: 'pending'
            };
            
            if (supabase && supabaseReady) {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([testOrder])
                    .select();
                
                if (error) {
                    console.error('Error creating test order:', error);
                    return { error: error.message };
                }
                
                console.log('Test order created:', data);
                return { success: true, order: data[0] };
            } else {
                console.error('Supabase not available');
                return { error: 'Supabase not available' };
            }
        } catch (error) {
            console.error('Error creating test order:', error);
            return { error: error.message };
        }
    }

    async checkOrdersTable() {
        console.log('Checking orders table...');
        try {
            if (supabase && supabaseReady) {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .limit(5);
                
                if (error) {
                    console.error('Error checking orders table:', error);
                    return { error: error.message };
                }
                
                console.log('Orders found:', data);
                return { success: true, orders: data };
            } else {
                console.error('Supabase not available');
                return { error: 'Supabase not available' };
            }
        } catch (error) {
            console.error('Error checking orders table:', error);
            return { error: error.message };
        }
    }

    async testOrderDisplay() {
        console.log('Testing order display...');
        try {
            const result = await this.checkOrdersTable();
            if (result.success) {
                console.log('Orders found:', result.orders.length);
                return result;
            } else {
                console.error('Failed to get orders:', result.error);
                return result;
            }
        } catch (error) {
            console.error('Error testing order display:', error);
            return { error: error.message };
        }
    }

    async testDirectOrderInsert() {
        console.log('Testing direct order insert...');
        try {
            const testOrder = {
                id: 'DIRECT-TEST-' + Date.now(),
                customer_id: 'test-customer-id',
                customer_name: 'Direct Test Customer',
                customer_email: 'direct@example.com',
                customer_mobile: '9876543210',
                customer_address: '456 Direct Test Street',
                customer_landmark: 'Near Direct Test Mall',
                customer_pincode: '654321',
                items: [
                    { id: '2', name: 'Direct Test Product', price: 200, quantity: 2 }
                ],
                total_amount: 400,
                status: 'confirmed',
                payment_status: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
                payment_id: 'direct_test_payment_' + Date.now(),
                payment_signature: 'direct_test_signature',
                created_at: new Date().toISOString(),
                paid_at: orderData.paymentMethod === 'cod' ? null : new Date().toISOString(),
                product_id: '2',
                delivery_status: 'pending'
            };
            
            if (supabase && supabaseReady) {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([testOrder])
                    .select();
                
                if (error) {
                    console.error('Error inserting direct test order:', error);
                    return { error: error.message };
                }
                
                console.log('Direct test order inserted:', data);
                return { success: true, order: data[0] };
            } else {
                console.error('Supabase not available');
                return { error: 'Supabase not available' };
            }
        } catch (error) {
            console.error('Error inserting direct test order:', error);
            return { error: error.message };
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new MangoMartApp();
        window.app.init();
    });
} else {
    window.app = new MangoMartApp();
    window.app.init();
}




























