# Spiritual Admin Panel

A modern, scalable admin panel for the Spiritual e-commerce platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User/SuperAdmin)
- Protected routes and middleware
- Secure login/logout functionality

### 🛍️ Product Management
- Complete CRUD operations for products
- Advanced product form with image upload
- Product variants and categories management
- Inventory tracking and low stock alerts
- SEO optimization fields
- Bulk operations support

### 📦 Order Management
- View all orders with filtering
- Order status management
- Payment status tracking
- Detailed order information
- Customer order history

### 👥 User Management
- User account management
- Role assignment and permissions
- User activation/deactivation
- Bulk user operations

### 📊 Dashboard & Analytics
- Comprehensive dashboard with key metrics
- Interactive charts using Recharts
- Sales trends and user growth analytics
- Real-time statistics cards
- Product performance insights

### 🎨 Modern UI/UX
- Responsive design for desktop and mobile
- Clean and modern interface with Tailwind CSS
- Dark/light theme support
- Intuitive sidebar navigation
- Toast notifications
- Modal dialogs and forms

### 🔧 Developer Experience
- TypeScript for type safety
- Reusable component library
- Custom hooks for state management
- API service layer
- Error handling and loading states
- ESLint and Prettier configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spiritual-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://spiritual-article-back-end.onrender.com
   
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

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `https://spiritual-article-back-end.onrender.com`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── products/          # Product management pages
│   ├── orders/            # Order management pages
│   ├── users/             # User management pages
│   ├── login/             # Authentication pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects)
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard-specific components
│   ├── products/         # Product-specific components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── services/             # API service layer
├── store/                # Zustand stores
└── types/                # TypeScript type definitions
```

## 🔧 Configuration

### Backend API Integration

The admin panel is designed to work with the existing Spiritual backend API. Update the API endpoints in the service files:

- `src/services/authService.ts` - Authentication endpoints
- `src/services/productService.ts` - Product management endpoints
- `src/services/orderService.ts` - Order management endpoints
- `src/services/userService.ts` - User management endpoints
- `src/services/dashboardService.ts` - Dashboard analytics endpoints

### AWS S3 Configuration

For production image uploads, configure AWS S3:

1. Update environment variables with your AWS credentials
2. Replace the mock upload function in `src/services/uploadService.ts`
3. Implement proper S3 upload logic with error handling

### Authentication

The admin panel uses JWT tokens for authentication. Ensure your backend API:

1. Returns JWT tokens on successful login
2. Validates tokens on protected routes
3. Supports role-based access control

## 🎨 Customization

### Theme Colors

Update the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color palette
      },
      secondary: {
        // Your secondary color palette
      },
    },
  },
}
```

### Component Styling

All components use Tailwind CSS classes and can be easily customized. The component library is built with:

- Consistent design tokens
- Responsive breakpoints
- Accessibility features
- Dark mode support (ready to implement)

## 📱 Responsive Design

The admin panel is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT token validation
- Role-based access control
- Protected routes
- Input validation and sanitization
- XSS protection
- CSRF protection (when integrated with backend)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Heroku
- Docker containers

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality

The project includes:

- ESLint configuration for code quality
- TypeScript for type safety
- Prettier for code formatting
- Custom component library
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the documentation
- Review the code comments
- Open an issue in the repository
- Contact the development team

---

**Built with ❤️ for the Spiritual e-commerce platform**
