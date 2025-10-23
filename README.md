# Mango Mart - Indian E-commerce Platform

A modern, responsive e-commerce platform built with vanilla JavaScript, featuring role-based dashboards for customers, admins, and delivery agents. All prices are in Indian Rupees (₹).

## Features

### 🛒 Customer Dashboard
- Browse products by category
- Add items to cart
- Place orders
- Track order status
- View order history

### 👨‍💼 Admin Dashboard
- Manage products (add, edit, delete)
- View all orders
- Manage delivery agents
- Analytics and insights
- Seed sample data

### 🚚 Delivery Dashboard
- View assigned orders
- Update order status
- Track delivery progress

## Getting Started

1. **Open the website**: Navigate to `http://localhost:8000` in your browser
2. **Create an account**: Choose your role (Customer, Admin, or Delivery Agent)
3. **Sign in**: Use any email/password combination

### Demo Accounts

For quick testing, use these email patterns:
- **Admin**: `admin@example.com` (any password)
- **Delivery**: `delivery@example.com` (any password)  
- **Customer**: `customer@example.com` (any password)

## Project Structure

```
mango/
├── index.html              # Main HTML file
├── js/                     # JavaScript modules
│   ├── main.js            # App entry point
│   ├── auth.js            # Authentication logic
│   ├── api.js             # API client (mock implementation)
│   ├── utils.js           # Utility functions
│   ├── seedData.js        # Sample data
│   ├── supabase-client.js # Database client (mock)
│   ├── customer-dashboard.js
│   ├── admin-dashboard.js
│   └── delivery-dashboard.js
└── styles/
    └── main.css           # Custom styles
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Storage**: LocalStorage (for demo purposes)

## Key Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-based Access**: Different dashboards for different user types
- **Real-time Updates**: Live order status updates
- **Shopping Cart**: Persistent cart with local storage
- **Product Management**: Full CRUD operations for products
- **Order Tracking**: Complete order lifecycle management

## Development Notes

This is a demo application using mock data and localStorage for persistence. In a production environment, you would:

1. Replace the mock Supabase client with a real Supabase project
2. Implement proper authentication with email verification
3. Add payment processing
4. Implement real-time notifications
5. Add proper error handling and validation

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Enjoy shopping at Mango Mart! 🥭

**Note**: All prices are displayed in Indian Rupees (₹) with realistic Indian market pricing.
