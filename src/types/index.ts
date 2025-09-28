// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dob?: string;
  isActive: boolean;
  roleId: number;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}



export interface LoginCredentials {
  email: string;
  password: string;
}

// Product Types
export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  comparePrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: string;
  thumbnailImage?: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  taxClass?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  barcode?: string;
  costPrice?: number;
  salePrice?: number;
  isOnSale: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
  minQuantity: number;
  maxQuantity?: number;
  allowBackorder: boolean;
  trackQuantity: boolean;
  soldQuantity: number;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  customFields: Record<string, any>;
  category?: Category;
  images?: ProductImage[];
  variants?: Variant[];
  purposes?: Purpose[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: number;
  productId: number;
  name: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  stock: number;
  weight?: number;
  attributes: Record<string, any>;
  isActive: boolean;
  images?: VariantImage[];
  createdAt: string;
  updatedAt: string;
}

export interface VariantImage {
  id: number;
  variantId: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  sortOrder: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  parent?: Category;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Purpose {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  user?: User;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
  variant?: Variant;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Cart Types
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  variant?: Variant;
}

// Review Types
export interface Review {
  id: number;
  userId: number;
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  comment?: string;
  isApproved: boolean;
  user?: User;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesData: SalesData[];
  userGrowth: UserGrowthData[];
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface UserGrowthData {
  date: string;
  users: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface ProductFormData {
  categoryId: number;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  comparePrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: string;
  thumbnailImage?: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  taxClass?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  barcode?: string;
  costPrice?: number;
  salePrice?: number;
  isOnSale: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
  minQuantity: number;
  maxQuantity?: number;
  allowBackorder: boolean;
  trackQuantity: boolean;
  customFields: Record<string, any>;
}

// Filter and Search Types
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isOnSale?: boolean;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  tags?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Upload Types
export interface UploadResponse {
  success: boolean;
  url: string;
  key: string;
}
