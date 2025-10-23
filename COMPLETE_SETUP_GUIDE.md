# Complete Mango Mart Database Setup Guide

This guide will help you set up the complete Mango Mart application with Supabase database integration for user authentication, orders, products, and profiles.

## 🗄️ Database Schema Overview

The application uses the following tables:

### 1. **users** - User authentication and basic info
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `email` (Text, Unique)
- `mobile` (Text, Unique)
- `password` (Text, Hashed)
- `role` (Text, Default: 'customer')
- `created_at` (Timestamp)

### 2. **orders** - User orders and payment info
- `id` (Text, Primary Key)
- `customer_id` (UUID, Foreign Key to users)
- `customer_name`, `customer_email`, `customer_mobile` (Text)
- `customer_address`, `customer_landmark`, `customer_pincode` (Text)
- `items` (JSONB, Product details)
- `total_amount` (Decimal)
- `status` (Text, Default: 'pending')
- `payment_status` (Text, Default: 'pending')
- `payment_id`, `payment_signature`, `razorpay_order_id` (Text)
- `created_at`, `paid_at`, `updated_at` (Timestamp)

### 3. **products** - Product catalog
- `id` (Text, Primary Key)
- `name`, `description` (Text)
- `price` (Decimal)
- `status` (Text, Default: 'in_stock')
- `stock_quantity` (Integer)
- `image` (Text, Base64 or URL)
- `main_category`, `subcategory` (Text)
- `created_at`, `updated_at` (Timestamp)

### 4. **user_carts** - User shopping carts
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `product_id`, `product_name`, `product_price`, `product_image` (Text)
- `quantity` (Integer)
- `created_at`, `updated_at` (Timestamp)

### 5. **categories** - Product categories
- `id` (UUID, Primary Key)
- `name` (Text)
- `main_category`, `subcategory` (Text)
- `description` (Text)
- `created_at` (Timestamp)

### 6. **user_profiles** - Extended user information
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `full_name`, `email`, `mobile` (Text)
- `address`, `city`, `state`, `pincode` (Text)
- `date_of_birth` (Date)
- `gender` (Text)
- `preferences` (JSONB)
- `created_at`, `updated_at` (Timestamp)

## 🚀 Setup Instructions

### Step 1: Create Supabase Project
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Note down your Project URL and anon key

### Step 2: Run Database Setup
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **+ New query**
4. Copy the entire content from `supabase-setup.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the script

### Step 3: Verify Tables
1. Go to **Table Editor**
2. Verify that all tables are created:
   - `users`
   - `orders`
   - `products`
   - `user_carts`
   - `categories`
   - `user_profiles`

### Step 4: Test the Application
1. Open `index.html` in your browser
2. Register a new user
3. Add products to cart
4. Place an order
5. Check your orders in the "Your Orders" section
6. Update your profile in the Profile page

## 🔐 Security Features

### Row Level Security (RLS)
- **Users**: Can only view/update their own data
- **Orders**: Users can only see their own orders
- **User Carts**: Users can only manage their own cart
- **User Profiles**: Users can only access their own profile
- **Products**: All users can view, authenticated users can manage
- **Categories**: All users can view, authenticated users can manage

### Data Isolation
- Orders are filtered by `customer_id`, `customer_email`, or `customer_mobile`
- User carts are isolated by `user_id`
- User profiles are isolated by `user_id`
- All database operations include proper user authentication checks

## 📱 User Experience Features

### Authentication
- **Email or Mobile Login**: Users can login with either email or mobile number
- **Auto-redirect**: After registration, users are automatically logged in
- **Session Management**: Secure session handling with localStorage backup

### Order Management
- **User-specific Orders**: Each user only sees their own orders
- **Order History**: Complete order tracking with status updates
- **Payment Integration**: Razorpay integration for secure payments

### Profile Management
- **Extended Profiles**: Additional user information beyond basic auth
- **Preference Settings**: Notification and marketing preferences
- **Password Management**: Secure password change functionality

### Cart Management
- **Persistent Cart**: Cart items saved to database
- **User-specific Cart**: Each user has their own cart
- **Real-time Updates**: Cart updates immediately reflect in database

## 🔄 Data Flow

### User Registration/Login
1. User enters email/mobile and password
2. System checks if user exists
3. If new user: creates account in `users` table
4. If existing user: verifies password
5. Creates session and redirects to customer interface

### Order Placement
1. User adds products to cart (saved to `user_carts` table)
2. User fills checkout form
3. Payment processed via Razorpay
4. Order saved to `orders` table with user association
5. Cart cleared after successful payment
6. Order appears in user's "Your Orders" section

### Profile Management
1. User updates profile information
2. Data saved to `user_profiles` table
3. Changes reflected across all user sessions
4. Password changes update `users` table

## 🛠️ Technical Implementation

### Database Functions
- **User Management**: `createUser`, `getUserByEmail`, `getUserByMobile`
- **Order Management**: `createOrder`, `getUserOrders`, `updateOrderStatus`
- **Cart Management**: `getUserCart`, `addToUserCart`, `updateUserCartItem`, `clearUserCart`
- **Profile Management**: `getUserProfile`, `updateUserProfile`
- **Product Management**: `getProducts`, `createProduct`, `updateProduct`
- **Category Management**: `getCategories`, `createCategory`

### Fallback System
- If Supabase is unavailable, the system falls back to localStorage
- All critical data is backed up locally
- Seamless user experience even without internet connection

### Error Handling
- Comprehensive error handling for all database operations
- User-friendly error messages
- Automatic fallback to localStorage when needed

## 📊 Sample Data

The setup script includes sample products and categories to get you started:
- **Fruits & Vegetables**: Fresh produce with realistic Indian pricing
- **Grocery**: Essential household items
- **Stationary**: Office and school supplies

## 🎯 Key Benefits

1. **Complete User Isolation**: Each user only sees their own data
2. **Secure Authentication**: Proper password hashing and session management
3. **Persistent Data**: All user data saved to database
4. **Real-time Updates**: Changes reflect immediately across sessions
5. **Scalable Architecture**: Built for growth with proper database design
6. **Fallback Support**: Works even without internet connection

## 🔧 Troubleshooting

### Common Issues
1. **Orders not showing**: Check if user is properly logged in
2. **Profile not saving**: Verify Supabase connection and API keys
3. **Cart not persisting**: Check user session and database connection
4. **Payment issues**: Verify Razorpay integration and test keys

### Debug Steps
1. Check browser console for errors
2. Verify Supabase project is active
3. Check API keys are correct
4. Ensure all tables are created properly
5. Test with sample data first

This complete setup ensures that your Mango Mart application has full database integration with proper user isolation, security, and a seamless user experience.



