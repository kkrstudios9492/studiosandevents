-- Updated Delivery Orders View with Product Information
-- This view provides complete order and product details for delivery agents

-- Drop existing view if it exists
DROP VIEW IF EXISTS delivery_orders_view;

-- Create enhanced delivery orders view with product details
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
    o.delivery_agent_id,
    o.items,
    o.product_id,
    -- Product information from products table
    p.name as product_name,
    p.image as product_image,
    p.price as product_price,
    p.description as product_description,
    p.main_category,
    p.subcategory,
    -- Agent information
    da.name as agent_name,
    da.agent_id
FROM orders o
LEFT JOIN products p ON o.product_id = p.id
LEFT JOIN delivery_agents da ON o.delivery_agent_id = da.id
WHERE o.delivery_status IN ('pending', 'picked_up', 'out_for_delivery', 'delivered')
ORDER BY o.created_at DESC;

-- Grant permissions
GRANT SELECT ON delivery_orders_view TO anon, authenticated;

-- Create a function to get order items with product details
CREATE OR REPLACE FUNCTION get_order_items_with_products(order_id_param VARCHAR(255))
RETURNS TABLE (
    item_id VARCHAR(255),
    product_name VARCHAR(255),
    product_image TEXT,
    product_price DECIMAL(10,2),
    quantity INTEGER,
    total_price DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (item->>'id')::VARCHAR(255) as item_id,
        COALESCE(
            p.name,
            (item->>'name')::VARCHAR(255),
            (item->>'product_name')::VARCHAR(255)
        ) as product_name,
        COALESCE(
            p.image,
            (item->>'image')::TEXT,
            (item->>'product_image')::TEXT
        ) as product_image,
        COALESCE(
            p.price,
            (item->>'price')::DECIMAL(10,2),
            (item->>'product_price')::DECIMAL(10,2)
        ) as product_price,
        (item->>'quantity')::INTEGER as quantity,
        (COALESCE(
            p.price,
            (item->>'price')::DECIMAL(10,2),
            (item->>'product_price')::DECIMAL(10,2)
        ) * (item->>'quantity')::INTEGER) as total_price
    FROM orders o,
         jsonb_array_elements(o.items) as item
    LEFT JOIN products p ON (item->>'id')::VARCHAR(255) = p.id
    WHERE o.id = order_id_param;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_order_items_with_products TO anon, authenticated;

-- Create an enhanced view that includes all order items with product details
CREATE OR REPLACE VIEW delivery_orders_with_items AS
SELECT 
    o.id as order_id,
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
    o.delivery_agent_id,
    -- Product details from items JSONB
    (item->>'id')::VARCHAR(255) as item_id,
    COALESCE(
        p.name,
        (item->>'name')::VARCHAR(255),
        (item->>'product_name')::VARCHAR(255)
    ) as product_name,
    COALESCE(
        p.image,
        (item->>'image')::TEXT,
        (item->>'product_image')::TEXT
    ) as product_image,
    COALESCE(
        p.price,
        (item->>'price')::DECIMAL(10,2),
        (item->>'product_price')::DECIMAL(10,2)
    ) as product_price,
    (item->>'quantity')::INTEGER as quantity,
    -- Agent information
    da.name as agent_name,
    da.agent_id
FROM orders o
CROSS JOIN jsonb_array_elements(o.items) as item
LEFT JOIN products p ON (item->>'id')::VARCHAR(255) = p.id
LEFT JOIN delivery_agents da ON o.delivery_agent_id = da.id
WHERE o.delivery_status IN ('pending', 'picked_up', 'out_for_delivery', 'delivered')
ORDER BY o.created_at DESC, o.id;

-- Grant permissions
GRANT SELECT ON delivery_orders_with_items TO anon, authenticated;

-- Verification queries
SELECT 'Enhanced delivery orders view created successfully' as status;
SELECT COUNT(*) as total_orders FROM delivery_orders_view;
SELECT COUNT(*) as total_order_items FROM delivery_orders_with_items;
