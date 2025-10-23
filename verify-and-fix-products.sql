-- Verify and fix product data in the database
-- This script ensures products have correct IDs and names

-- First, let's see what products we have
SELECT 
    id,
    name,
    price,
    main_category,
    subcategory,
    status,
    created_at
FROM products 
ORDER BY created_at DESC;

-- Check if there are any products with missing or incorrect data
SELECT 
    id,
    name,
    price,
    main_category,
    subcategory,
    status,
    CASE 
        WHEN name IS NULL OR name = '' THEN 'MISSING NAME'
        WHEN price IS NULL OR price <= 0 THEN 'INVALID PRICE'
        WHEN main_category IS NULL OR main_category = '' THEN 'MISSING CATEGORY'
        ELSE 'OK'
    END as status_check
FROM products 
ORDER BY created_at DESC;

-- Update any products with missing names (if any)
UPDATE products 
SET name = 'Unnamed Product'
WHERE name IS NULL OR name = '';

-- Update any products with missing categories (if any)
UPDATE products 
SET main_category = 'General'
WHERE main_category IS NULL OR main_category = '';

-- Update any products with invalid prices (if any)
UPDATE products 
SET price = 0
WHERE price IS NULL OR price < 0;

-- Verify the fixes
SELECT 
    id,
    name,
    price,
    main_category,
    subcategory,
    status,
    'FIXED' as status_check
FROM products 
ORDER BY created_at DESC;
