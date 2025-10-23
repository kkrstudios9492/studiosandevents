-- Disable RLS for delivery_agents table to allow admin management
-- This is a temporary solution for development

-- Disable RLS on delivery_agents table
ALTER TABLE delivery_agents DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on orders table for delivery status updates
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Verification
SELECT 'RLS disabled for delivery_agents and orders tables' as status;


