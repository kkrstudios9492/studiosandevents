# Supabase Database Setup for Mango Mart

## Database Configuration

Your Supabase project is configured with:
- **URL**: `https://nruafgayqspvluubsvwb.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydWFmZ2F5cXNwdmx1dWJzdndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4ODI1MTcsImV4cCI6MjA3NjQ1ODUxN30.hhnZq-mF24RYW9SfnorFNw-Wl51bK_mfDjQiN2WCNcA`

## Setup Steps

### 1. Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** to execute the SQL commands

### 2. Database Tables Created

The setup creates the following tables:

#### `users` table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `mobile` (VARCHAR, Unique)
- `password` (VARCHAR)
- `role` (VARCHAR, default: 'customer')
- `created_at`, `updated_at` (Timestamps)

#### `products` table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `image` (TEXT)
- `category`, `subcategory` (VARCHAR)
- `status` (VARCHAR, default: 'active')
- `stock` (INTEGER)
- `created_at`, `updated_at` (Timestamps)

#### `orders` table
- `id` (VARCHAR, Primary Key)
- `customer_id` (UUID, Foreign Key to users)
- `customer_name`, `customer_email`, `customer_mobile` (VARCHAR)
- `customer_address`, `customer_landmark`, `customer_pincode` (VARCHAR/TEXT)
- `items` (JSONB)
- `total_amount` (DECIMAL)
- `status`, `payment_status` (VARCHAR)
- `payment_id`, `payment_signature` (VARCHAR)
- `created_at`, `paid_at`, `updated_at` (Timestamps)

### 3. Row Level Security (RLS)

The setup includes RLS policies for data security:

- **Users**: Can only view/update their own data
- **Products**: Public read access for all users
- **Orders**: Users can only view/insert/update their own orders

### 4. Sample Data

The setup includes sample products:
- Fresh Mangoes (₹120)
- Bananas (₹60)
- Apples (₹80)
- Rice (₹150)
- Wheat Flour (₹45)
- Notebook (₹25)
- Pen (₹10)

## Features Enabled

### ✅ **Database Integration**
- User registration and authentication
- Order storage and retrieval
- Product management
- User-specific data isolation

### ✅ **Fallback System**
- If Supabase is unavailable, falls back to localStorage
- Seamless transition between database and local storage
- No data loss during network issues

### ✅ **Security**
- Row Level Security (RLS) enabled
- User data isolation
- Secure API endpoints

## Testing the Integration

1. **Register a new user** - Data will be saved to Supabase
2. **Place an order** - Order will be stored in Supabase
3. **View orders** - Orders will be loaded from Supabase
4. **Check Supabase Dashboard** - Verify data in your project

## Troubleshooting

### If Supabase is not working:
- Check your internet connection
- Verify the URL and API key are correct
- Check Supabase project status
- The app will automatically fall back to localStorage

### Database Connection Issues:
- Ensure RLS policies are properly set up
- Check if tables exist in your Supabase project
- Verify API key permissions

## Next Steps

1. Run the SQL setup script in Supabase
2. Test user registration and login
3. Test order placement and viewing
4. Monitor your Supabase dashboard for data

Your Mango Mart application is now powered by Supabase! 🚀



