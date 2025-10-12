-- Mango Mart Ecommerce Database Schema
-- Run these commands in your Supabase SQL Editor

-- 1. Users Table (Customer Authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'delivery')),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    stock_status VARCHAR(20) DEFAULT 'in' CHECK (stock_status IN ('in', 'out')),
    category VARCHAR(100),
    image TEXT, -- Base64 encoded image or URL
    homepage_card_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Homepage Cards Table
CREATE TABLE IF NOT EXISTS homepage_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image TEXT, -- Base64 encoded image or URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders Table (Complete Order Management)
-- Drop and recreate to ensure all columns exist
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled')),
    delivery_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    delivery_address TEXT NOT NULL,
    delivery_landmark VARCHAR(255),
    delivery_pincode VARCHAR(10) NOT NULL,
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    delivery_notes TEXT,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    rating_stars INTEGER CHECK (rating_stars >= 1 AND rating_stars <= 5),
    rating_feedback TEXT,
    order_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Delivery Agents Table
CREATE TABLE IF NOT EXISTS delivery_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Agent Locations Table
CREATE TABLE IF NOT EXISTS agent_locations (
    agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (agent_id, timestamp)
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Search Logs Table
CREATE TABLE IF NOT EXISTS search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 1,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Order Items Table (Individual items in each order)
-- Drop and recreate to ensure all columns exist
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Cart Table (User Shopping Cart)
CREATE TABLE IF NOT EXISTS cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 12. Order Status History Table
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    status_display VARCHAR(100) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- All indexes will be created after sample data insertion

-- Insert default categories
INSERT INTO categories (name) VALUES 
    ('Fruits and Vegetables'),
    ('Grocery'),
    ('Stationery')
ON CONFLICT (name) DO NOTHING;

-- Ensure all columns exist in users table (in case of partial creation)
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Insert default users
INSERT INTO users (name, email, password, role, phone, address, is_active) VALUES 
    ('Admin User', 'admin@mangomart.com', 'admin123', 'admin', '+91-9876543210', 'Admin Office, Mango Mart HQ', true),
    ('Test Customer', 'customer@example.com', 'customer123', 'customer', '+91-9876543211', '123 Test Street, Test City', true),
    ('Delivery Agent', 'delivery@mangomart.com', 'delivery123', 'delivery', '+91-9876543212', 'Delivery Hub, Mango Mart', true),
    ('Mango Mart Admin', 'mangomartonline123@gmail.com', 'varun@173205', 'admin', '+91-9876543213', 'Main Office, Mango Mart', true),
    ('John Doe', 'john@example.com', 'password123', 'customer', '+91-9876543214', '456 Customer Lane, City', true),
    ('Jane Smith', 'jane@example.com', 'password123', 'customer', '+91-9876543215', '789 User Street, Town', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample homepage cards
INSERT INTO homepage_cards (title, description, category, image) VALUES 
    ('Fruits and Vegetables', 'Fresh fruits and leafy greens.', 'Fruits and Vegetables', ''),
    ('Grocery', 'Food items and groceries.', 'Grocery', ''),
    ('Stationery', 'Office and school supplies.', 'Stationery', '')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock, stock_status, category, image) VALUES 
    ('Fresh Apples', 'Crisp and sweet red apples', 120.00, 50, 'in', 'Fruits and Vegetables', ''),
    ('Organic Bananas', 'Fresh organic bananas', 60.00, 30, 'in', 'Fruits and Vegetables', ''),
    ('Fresh Oranges', 'Juicy and sweet oranges', 80.00, 40, 'in', 'Fruits and Vegetables', ''),
    ('Milk 1L', 'Fresh cow milk', 50.00, 25, 'in', 'Grocery', ''),
    ('Bread Loaf', 'Fresh white bread', 35.00, 20, 'in', 'Grocery', ''),
    ('Rice 1kg', 'Premium basmati rice', 120.00, 15, 'in', 'Grocery', ''),
    ('Notebook', 'Spiral bound notebook', 25.00, 100, 'in', 'Stationery', ''),
    ('Pen Set', 'Set of 5 ballpoint pens', 15.00, 50, 'in', 'Stationery', ''),
    ('Pencil Box', 'Colorful pencil box', 45.00, 30, 'in', 'Stationery', '')
ON CONFLICT DO NOTHING;

-- Orders table is now properly created with all columns

-- Insert sample orders (after products are created)
INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, total_amount, status, payment_status, delivery_address, delivery_pincode, delivery_latitude, delivery_longitude) 
SELECT 
    'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-' || LPAD((ROW_NUMBER() OVER())::TEXT, 3, '0'),
    u.id,
    u.name,
    u.email,
    u.phone,
    180.00,
    'delivered',
    'paid',
    COALESCE(u.address, '123 Test Street, Test City'), -- Use COALESCE to provide default address
    '560001',
    12.9716,
    77.5946
FROM users u 
WHERE u.email = 'customer@example.com'
LIMIT 1;

-- Order items table is now properly created with all columns

-- Insert order items for the sample order
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, total_price)
SELECT 
    o.id,
    p.id,
    p.name,
    p.price,
    2,
    p.price * 2
FROM orders o
CROSS JOIN products p
WHERE o.order_number LIKE 'ORD-%'
AND p.name IN ('Fresh Apples', 'Milk 1L')
LIMIT 2;

-- Insert sample cart items for customers
INSERT INTO cart (user_id, product_id, quantity)
SELECT u.id, p.id, 1
FROM users u
CROSS JOIN products p
WHERE u.role = 'customer'
AND p.name IN ('Fresh Apples', 'Organic Bananas', 'Milk 1L')
LIMIT 3;

-- Create ALL indexes after all tables and data are created
-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_agent_id ON orders(delivery_agent_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_product ON cart(user_id, product_id);

-- Order status history indexes
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- Delivery agent indexes
CREATE INDEX IF NOT EXISTS idx_delivery_agents_user_id ON delivery_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_agents_status ON delivery_agents(status);

-- Agent location indexes
CREATE INDEX IF NOT EXISTS idx_agent_locations_agent_id ON agent_locations(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_locations_timestamp ON agent_locations(timestamp);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Search logs indexes
CREATE INDEX IF NOT EXISTS idx_search_logs_term ON search_logs(term);
CREATE INDEX IF NOT EXISTS idx_search_logs_count ON search_logs(count);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-specific data access
-- Users can only see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users 
    FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users 
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Orders: Customers can only see their own orders
DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders" ON orders 
    FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Delivery agents can see orders assigned to them
DROP POLICY IF EXISTS "Delivery agents can view assigned orders" ON orders;
CREATE POLICY "Delivery agents can view assigned orders" ON orders 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'delivery'
        ) AND (
            delivery_agent_id::text = auth.uid()::text 
            OR status = 'pending'
        )
    );

-- Admins can see all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Cart: Users can only see their own cart
DROP POLICY IF EXISTS "Users can view own cart" ON cart;
CREATE POLICY "Users can view own cart" ON cart 
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Notifications: Users can only see their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications 
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Order status history: Users can see history for their own orders
DROP POLICY IF EXISTS "Users can view own order history" ON order_status_history;
CREATE POLICY "Users can view own order history" ON order_status_history 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_status_history.order_id 
            AND (
                orders.customer_id::text = auth.uid()::text
                OR orders.delivery_agent_id::text = auth.uid()::text
                OR EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id::text = auth.uid()::text 
                    AND users.role = 'admin'
                )
            )
        )
    );

-- Products and homepage cards are public (no RLS needed)
-- Search logs are public (no RLS needed)
-- Categories are public (no RLS needed)
-- Delivery agents: Only admins can manage
DROP POLICY IF EXISTS "Admins can manage delivery agents" ON delivery_agents;
CREATE POLICY "Admins can manage delivery agents" ON delivery_agents 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Agent locations: Delivery agents can see their own location, admins can see all
DROP POLICY IF EXISTS "Agent location access" ON agent_locations;
CREATE POLICY "Agent location access" ON agent_locations 
    FOR ALL USING (
        agent_id::text = auth.uid()::text
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Create functions for order management
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-' || LPAD((EXTRACT(MICROSECONDS FROM NOW())::INTEGER % 1000)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(total_price), 0)
        FROM order_items 
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    ),
    updated_at = NOW()
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
    status_display TEXT;
    agent_name TEXT;
BEGIN
    -- Only log if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Set status display text
        CASE NEW.status
            WHEN 'pending' THEN status_display := 'Order Placed';
            WHEN 'confirmed' THEN status_display := 'Order Confirmed';
            WHEN 'picked_up' THEN status_display := 'Order Picked Up';
            WHEN 'out_for_delivery' THEN status_display := 'Out for Delivery';
            WHEN 'delivered' THEN status_display := 'Order Delivered';
            WHEN 'cancelled' THEN status_display := 'Order Cancelled';
            ELSE status_display := INITCAP(REPLACE(NEW.status, '_', ' '));
        END CASE;
        
        -- Get delivery agent name if available
        IF NEW.delivery_agent_id IS NOT NULL THEN
            SELECT name INTO agent_name FROM users WHERE id = NEW.delivery_agent_id;
        END IF;
        
        -- Insert status history record
        INSERT INTO order_status_history (order_id, status, status_display, notes, created_by)
        VALUES (
            NEW.id, 
            NEW.status, 
            status_display,
            CASE 
                WHEN agent_name IS NOT NULL THEN 'Updated by delivery agent: ' || agent_name
                ELSE 'Status updated'
            END,
            NEW.delivery_agent_id
        );
        
        -- Update order timestamp
        NEW.updated_at = NOW();
        
        -- If status is delivered, set delivered_at timestamp
        IF NEW.status = 'delivered' THEN
            NEW.delivered_at = NOW();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_order_total_on_insert
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_update_order_total_on_update
    AFTER UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_update_order_total_on_delete
    AFTER DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trigger_log_order_status_change
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_status_change();

-- Create view for order details with items
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id,
    o.order_number,
    o.customer_id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.total_amount,
    o.status,
    o.payment_status,
    o.delivery_address,
    o.delivery_pincode,
    o.delivery_latitude,
    o.delivery_longitude,
    o.delivery_agent_id,
    o.created_at,
    o.updated_at,
    COALESCE(
        json_agg(
            json_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'product_price', oi.product_price,
                'quantity', oi.quantity,
                'total_price', oi.total_price
            )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'::json
    ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.customer_id, o.customer_name, o.customer_email, 
         o.customer_phone, o.total_amount, o.status, o.payment_status, 
         o.delivery_address, o.delivery_pincode, o.delivery_latitude, 
         o.delivery_longitude, o.delivery_agent_id, o.created_at, o.updated_at;