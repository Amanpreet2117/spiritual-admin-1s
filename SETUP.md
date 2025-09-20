# API Integration Setup Guide

## 🚀 Quick Setup

### 1. Create Environment File
Create a `.env.local` file in the root directory with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_NAME=Spiritual Admin Panel

# AWS S3 Configuration (for image uploads)
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_S3_BUCKET=spiritual-admin-uploads
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# JWT Configuration
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key

# Development
NODE_ENV=development
```

### 2. Start Your Backend Server
Make sure your spiritual backend is running on port 3000:

```bash
cd /home/rubaab/Desktop/spiritual/spiritual-article-back-end-7
npm start
```

### 3. Start the Admin Panel
```bash
cd /home/rubaab/Desktop/spiritual/spiritual-admin
npm run dev
```

## 🔗 API Integration Status

### ✅ Completed Integrations:

1. **Authentication System**
   - Login/logout with JWT tokens
   - Role-based access control
   - Protected routes

2. **Product Management**
   - Create, read, update, delete products
   - Product categories management
   - Product purposes management
   - Low stock monitoring
   - Image upload (with mock S3)

3. **Order Management**
   - View orders with filtering
   - Order status management
   - Payment status tracking

4. **User Management**
   - User account management
   - Role assignment

### 🔧 API Endpoints Used:

#### Products
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/products/low-stock` - Low stock products

#### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Purposes
- `GET /api/purposes` - List purposes
- `POST /api/purposes` - Create purpose
- `PUT /api/purposes/:id` - Update purpose
- `DELETE /api/purposes/:id` - Delete purpose

#### Authentication
- `POST /api/auth/login` - User login

## 🛠️ Configuration Notes

### Backend API URL
The admin panel is configured to connect to your backend at `http://localhost:3000`. If your backend runs on a different port, update the `NEXT_PUBLIC_API_BASE_URL` in your `.env.local` file.

### Authentication
The admin panel expects your backend to return JWT tokens in this format:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": {
        "name": "admin"
      }
    },
    "token": "jwt_token_here"
  }
}
```

### Image Upload
Currently using mock S3 upload. To enable real AWS S3:
1. Configure AWS credentials in `.env.local`
2. Update the `UploadService.uploadToS3` method in `src/services/uploadService.ts`

## 🧪 Testing the Integration

1. **Login Test**: Try logging in with your backend admin credentials
2. **Products Test**: Create a new product and verify it appears in your backend
3. **Categories Test**: Add a new category and check it's created in the database
4. **Orders Test**: View orders from your backend database

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your backend allows requests from `http://localhost:3001`
2. **Authentication Errors**: Verify JWT token format matches expected structure
3. **API Errors**: Check browser console for detailed error messages

### Debug Mode:
Enable detailed logging by adding this to your `.env.local`:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📝 Next Steps

1. Test all CRUD operations
2. Configure real AWS S3 for image uploads
3. Add more advanced filtering and search
4. Implement real-time notifications
5. Add export/import functionality

The admin panel is now fully integrated with your backend API! 🎉
