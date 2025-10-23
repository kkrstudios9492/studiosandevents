-- Fix product mismatch in existing orders
-- This script updates the product_id field to match the first item in the items array

-- First, let's see what orders have mismatched product_id
SELECT 
    id,
    product_id,
    items,
    (items->0->>'id') as first_item_id,
    (items->0->>'name') as first_item_name
FROM orders 
WHERE product_id IS NOT NULL 
AND items IS NOT NULL 
AND jsonb_array_length(items) > 0
AND product_id != (items->0->>'id');

-- Update orders where product_id doesn't match the first item's ID
UPDATE orders 
SET product_id = (items->0->>'id')
WHERE product_id IS NOT NULL 
AND items IS NOT NULL 
AND jsonb_array_length(items) > 0
AND product_id != (items->0->>'id');

-- Verify the fix
SELECT 
    id,
    product_id,
    (items->0->>'id') as first_item_id,
    (items->0->>'name') as first_item_name,
    CASE 
        WHEN product_id = (items->0->>'id') THEN 'FIXED'
        ELSE 'STILL MISMATCHED'
    END as status
FROM orders 
WHERE product_id IS NOT NULL 
AND items IS NOT NULL 
AND jsonb_array_length(items) > 0;
