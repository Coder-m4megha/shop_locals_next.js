# Admin Dashboard Setup

## Overview
The admin dashboard has been set up with proper authentication and role-based access control.

## Features
- ✅ Protected admin routes with middleware
- ✅ Role-based authentication (ADMIN role required)
- ✅ Admin dashboard with real-time statistics
- ✅ Complete order management system
- ✅ Order status updates with tracking
- ✅ Order filtering and search
- ✅ Customer information management
- ✅ Automatic redirect to login for unauthorized access

## User Access

### Admin Credentials
- **Email**: `admin@mohitsareecenter.com`
- **Password**: `admin123`
- **Role**: `ADMIN`
- **Access**: Admin Dashboard (`/admin`)

### Customer Credentials
- **Email**: `customer@mohitsareecenter.com`
- **Password**: `customer123`
- **Role**: `CUSTOMER`
- **Access**: Customer Account (`/account`)

### Creating Test Users
To create both admin and customer users, run:
```bash
node scripts/create-admin.js
```

## How It Works

### 1. Middleware Protection
- All `/admin/*` routes are protected by middleware
- Requires authentication AND admin role
- Redirects to login if not authenticated
- Redirects to home if not admin

### 2. Admin Dashboard
- Located at `/admin`
- Shows order statistics
- Quick action buttons
- Recent orders overview

### 3. Authentication Flow
1. User tries to access `/admin` or `/account`
2. Middleware checks authentication and role
3. If not logged in → redirect to `/auth/login?callbackUrl=<original-url>`
4. If logged in:
   - Admin users → `/admin` dashboard
   - Customer users → `/account` dashboard
   - Cross-access prevented (admin can't access `/account`, customer can't access `/admin`)

## Testing

### Admin Access
1. Go to `http://localhost:3000/mohitsarees/admin`
2. You'll be redirected to login
3. Use admin credentials: `admin@mohitsareecenter.com` / `admin123`
4. You'll be redirected to admin dashboard

### Customer Access
1. Go to `http://localhost:3000/mohitsarees/account`
2. You'll be redirected to login
3. Use customer credentials: `customer@mohitsareecenter.com` / `customer123`
4. You'll be redirected to customer account dashboard

### Cross-Access Prevention
- If admin tries to access `/account` → redirected to `/admin`
- If customer tries to access `/admin` → redirected to `/account`

## Security Features
- JWT token validation
- Role-based access control
- Secure password hashing
- Session management
- CSRF protection via NextAuth

## Admin Routes
- `/admin` - Main dashboard with statistics
- `/admin/orders` - Order management with filtering
- `/admin/orders/[id]` - Order details with status updates

## Order Management Features
- **Order Listing**: View all orders with pagination
- **Advanced Filtering**: Filter by status, payment status, delivery method
- **Search**: Search by order number or customer name
- **Status Updates**: Update order and payment status
- **Tracking**: Add tracking numbers and notes
- **Order History**: View complete status change history
- **Customer Info**: View customer details and shipping addresses

All routes are protected and require ADMIN role.
