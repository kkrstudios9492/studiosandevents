-- Complete Supabase Setup for Mango Mart with RLS Enabled
-- Run this entire script in your Supabase SQL Editor

-- ===========================================
-- 0. FIX EXISTING TABLES (IF ANY)
-- ===========================================

-- Add product_id column to existing orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);

-- ===========================================
-- 1. CREATE ALL TABLES
-- ===========================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    main_category VARCHAR(100),
    subcategory VARCHAR(100),
    status VARCHAR(50) DEFAULT 'in_stock',
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255), -- Made nullable for mobile-only users
    customer_mobile VARCHAR(20), -- Made nullable for email-only users
    customer_address TEXT NOT NULL,
    customer_landmark VARCHAR(255),
    customer_pincode VARCHAR(10) NOT NULL,
    items JSONB NOT NULL,
    product_id VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    payment_signature VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure at least one contact method is provided
    CONSTRAINT check_contact_method CHECK (customer_email IS NOT NULL OR customer_mobile IS NOT NULL)
);

-- Create user_carts table
CREATE TABLE IF NOT EXISTS user_carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    main_category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    mobile VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    date_of_birth DATE,
    gender VARCHAR(20),
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(main_category, subcategory);
CREATE INDEX IF NOT EXISTS idx_categories_main ON categories(main_category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_main_category ON products(main_category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- ===========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ===========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 4. CREATE RLS POLICIES (DEVELOPMENT FRIENDLY)
-- ===========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all user operations" ON users;
DROP POLICY IF EXISTS "Allow all product operations" ON products;
DROP POLICY IF EXISTS "Allow all order operations" ON orders;
DROP POLICY IF EXISTS "Allow all cart operations" ON user_carts;
DROP POLICY IF EXISTS "Allow all category operations" ON categories;
DROP POLICY IF EXISTS "Allow all profile operations" ON user_profiles;

-- Create simple policies that allow all operations (good for development)
CREATE POLICY "Allow all user operations" ON users
    FOR ALL USING (true);

CREATE POLICY "Allow all product operations" ON products
    FOR ALL USING (true);

CREATE POLICY "Allow all order operations" ON orders
    FOR ALL USING (true);

CREATE POLICY "Allow all cart operations" ON user_carts
    FOR ALL USING (true);

CREATE POLICY "Allow all category operations" ON categories
    FOR ALL USING (true);

CREATE POLICY "Allow all profile operations" ON user_profiles
    FOR ALL USING (true);

-- ===========================================
-- 5. UPDATE EXISTING DATA (IF ANY)
-- ===========================================

-- Create index for product_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);

-- Update existing orders to have product_id (if any exist)
-- This will set product_id to the first item's product id from the items JSON
UPDATE orders 
SET product_id = (items->0->>'id')::VARCHAR(255)
WHERE product_id IS NULL 
AND items IS NOT NULL 
AND jsonb_array_length(items) > 0;

-- ===========================================
-- 6. INSERT SAMPLE DATA
-- ===========================================

-- Insert sample products
INSERT INTO products (id, name, description, price, image, main_category, subcategory, stock_quantity, status) VALUES
('prod-1', 'Fresh Mangoes', 'Sweet and juicy mangoes from local farms', 120.00, 'https://images.unsplash.com/photo-1605027990121-75fd594d6565?w=400', 'Fruits & Vegetables', 'Fruits', 50, 'in_stock'),
('prod-2', 'Bananas', 'Fresh yellow bananas', 60.00, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b9e5?w=400', 'Fruits & Vegetables', 'Fruits', 100, 'in_stock'),
('prod-3', 'Apples', 'Red delicious apples', 80.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 'Fruits & Vegetables', 'Fruits', 75, 'in_stock'),
('prod-4', 'Rice', 'Premium basmati rice', 150.00, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'Grocery', 'Grains', 200, 'in_stock'),
('prod-5', 'Wheat Flour', 'Whole wheat flour', 45.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'Grocery', 'Grains', 150, 'in_stock'),
('prod-6', 'Notebook', 'A4 size ruled notebook', 25.00, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'Stationary', 'Books', 100, 'in_stock'),
('prod-7', 'Pen', 'Blue ink ballpoint pen', 10.00, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', 'Stationary', 'Writing', 500, 'in_stock')
ON CONFLICT (id) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, main_category, subcategory, description) VALUES
('Fruits', 'Fruits & Vegetables', 'Fruits', 'Fresh seasonal fruits'),
('Vegetables', 'Fruits & Vegetables', 'Vegetables', 'Fresh organic vegetables'),
('Grains', 'Grocery', 'Grains', 'Rice, wheat, and other grains'),
('Dairy', 'Grocery', 'Dairy', 'Milk, cheese, and dairy products'),
('Books', 'Stationary', 'Books', 'Notebooks and books'),
('Writing', 'Stationary', 'Writing', 'Pens, pencils, and writing materials')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 7. VERIFICATION QUERIES
-- ===========================================

-- Check if tables were created successfully
SELECT 'Tables created successfully' as status;

-- Show table counts
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
    'products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 
    'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 
    'orders' as table_name, COUNT(*) as count FROM orders
UNION ALL
SELECT 
    'user_carts' as table_name, COUNT(*) as count FROM user_carts
UNION ALL
SELECT 
    'user_profiles' as table_name, COUNT(*) as count FROM user_profiles;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check policies were created
SELECT 
    tablename,
    policyname,
    cmd as operation
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check orders table structure (including product_id column)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample orders with product_id
SELECT 
    id, 
    customer_name, 
    product_id, 
    total_amount,
    status,
    created_at
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;

-- Final verification - check if product_id column exists and is working
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'orders' 
            AND column_name = 'product_id'
            AND table_schema = 'public'
        ) THEN '✅ product_id column exists'
        ELSE '❌ product_id column missing'
    END as product_id_status;