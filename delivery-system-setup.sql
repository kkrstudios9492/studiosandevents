-- Delivery System Database Setup
-- This script adds delivery agent functionality and order status tracking

-- 1. Create delivery_agents table
CREATE TABLE IF NOT EXISTS delivery_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add delivery tracking columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_agent_id UUID REFERENCES delivery_agents(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'picked_up', 'out_for_delivery', 'delivered'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS out_for_delivery_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_notes TEXT;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_delivery_agents_agent_id ON delivery_agents(agent_id);
CREATE INDEX IF NOT EXISTS idx_delivery_agents_email ON delivery_agents(email);
CREATE INDEX IF NOT EXISTS idx_delivery_agents_mobile ON delivery_agents(mobile);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_agent_id ON orders(delivery_agent_id);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(delivery_status);

-- 4. Insert sample delivery agents
INSERT INTO delivery_agents (agent_id, name, email, mobile, password, status) VALUES
('DEL001', 'Rajesh Kumar', 'rajesh@mangomart.com', '9876543210', 'cGFzc3dvcmQxMjNtYW5nb19tYXJ0X3NhbHQ=', 'active'),
('DEL002', 'Suresh Singh', 'suresh@mangomart.com', '9876543211', 'cGFzc3dvcmQxMjNtYW5nb19tYXJ0X3NhbHQ=', 'active'),
('DEL003', 'Amit Patel', 'amit@mangomart.com', '9876543212', 'cGFzc3dvcmQxMjNtYW5nb19tYXJ0X3NhbHQ=', 'active')
ON CONFLICT (agent_id) DO NOTHING;

-- 5. Update existing orders to have proper delivery status
UPDATE orders SET delivery_status = 'pending' WHERE delivery_status IS NULL;

-- 6. Create RLS policies for delivery agents
ALTER TABLE delivery_agents ENABLE ROW LEVEL SECURITY;

-- Allow delivery agents to view their own data
CREATE POLICY "Delivery agents can view their own data" ON delivery_agents
    FOR SELECT USING (agent_id = current_setting('app.current_agent_id', true));

-- Allow delivery agents to update their own status
CREATE POLICY "Delivery agents can update their own status" ON delivery_agents
    FOR UPDATE USING (agent_id = current_setting('app.current_agent_id', true));

-- Allow delivery agents to view orders assigned to them
CREATE POLICY "Delivery agents can view assigned orders" ON orders
    FOR SELECT USING (delivery_agent_id = (SELECT id FROM delivery_agents WHERE agent_id = current_setting('app.current_agent_id', true)));

-- Allow delivery agents to update order delivery status
CREATE POLICY "Delivery agents can update delivery status" ON orders
    FOR UPDATE USING (delivery_agent_id = (SELECT id FROM delivery_agents WHERE agent_id = current_setting('app.current_agent_id', true)));

-- 7. Create function to update order delivery status
CREATE OR REPLACE FUNCTION update_order_delivery_status(
    order_id_param VARCHAR(255),
    new_status VARCHAR(50),
    agent_id_param VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
    agent_uuid UUID;
BEGIN
    -- Get agent UUID
    SELECT id INTO agent_uuid FROM delivery_agents WHERE agent_id = agent_id_param;
    
    IF agent_uuid IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Update order with new status and timestamps
    UPDATE orders SET 
        delivery_status = new_status,
        delivery_agent_id = agent_uuid,
        picked_up_at = CASE WHEN new_status = 'picked_up' THEN NOW() ELSE picked_up_at END,
        out_for_delivery_at = CASE WHEN new_status = 'out_for_delivery' THEN NOW() ELSE out_for_delivery_at END,
        delivered_at = CASE WHEN new_status = 'delivered' THEN NOW() ELSE delivered_at END,
        updated_at = NOW()
    WHERE id = order_id_param;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 8. Create view for delivery dashboard
CREATE OR REPLACE VIEW delivery_orders_view AS
SELECT 
    o.id,
    o.customer_name,
    o.customer_mobile,
    o.customer_address,
    o.customer_landmark,
    o.customer_pincode,
    o.total_amount,
    o.delivery_status,
    o.created_at,
    o.picked_up_at,
    o.out_for_delivery_at,
    o.delivered_at,
    o.delivery_notes,
    da.name as agent_name,
    da.agent_id
FROM orders o
LEFT JOIN delivery_agents da ON o.delivery_agent_id = da.id
WHERE o.delivery_status IN ('pending', 'picked_up', 'out_for_delivery')
ORDER BY o.created_at DESC;

-- 9. Grant permissions
GRANT SELECT ON delivery_orders_view TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_order_delivery_status TO anon, authenticated;

-- 10. Verification queries
SELECT 'Delivery agents table created' as status;
SELECT COUNT(*) as agent_count FROM delivery_agents;
SELECT 'Orders table updated with delivery columns' as status;
SELECT COUNT(*) as orders_with_delivery_status FROM orders WHERE delivery_status IS NOT NULL;


