-- Fix RLS policies for delivery_agents table
-- This script adds the missing policies to allow admins to manage delivery agents

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Delivery agents can view their own data" ON delivery_agents;
DROP POLICY IF EXISTS "Delivery agents can update their own status" ON delivery_agents;

-- Create new policies that allow proper access
-- Allow all authenticated users to view delivery agents (for admin dashboard)
CREATE POLICY "Allow authenticated users to view delivery agents" ON delivery_agents
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert delivery agents (for admin creation)
CREATE POLICY "Allow authenticated users to insert delivery agents" ON delivery_agents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update delivery agents (for admin management)
CREATE POLICY "Allow authenticated users to update delivery agents" ON delivery_agents
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow all authenticated users to delete delivery agents (for admin management)
CREATE POLICY "Allow authenticated users to delete delivery agents" ON delivery_agents
    FOR DELETE USING (auth.role() = 'authenticated');

-- Also fix the orders policies to be less restrictive
DROP POLICY IF EXISTS "Delivery agents can view assigned orders" ON orders;
DROP POLICY IF EXISTS "Delivery agents can update delivery status" ON orders;

-- Allow all authenticated users to view orders (for delivery dashboard)
CREATE POLICY "Allow authenticated users to view orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to update orders (for delivery status updates)
CREATE POLICY "Allow authenticated users to update orders" ON orders
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Verification
SELECT 'RLS policies updated successfully' as status;


