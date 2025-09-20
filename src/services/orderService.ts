import apiClient from '@/lib/api';
import { Order, OrderFilters, PaginatedResponse, User, CartItem } from '@/types';

export class OrderService {
  // Get all orders with filters
  static async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>('/api/admin/orders', filters);
    return response.data;
  }

  // Get order by ID
  static async getOrderById(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`/api/admin/orders/${id}`);
    return response.data;
  }

  // Update order status
  static async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/admin/orders/${id}/status`, { status });
    return response.data;
  }

  // Update payment status
  static async updatePaymentStatus(id: number, paymentStatus: Order['paymentStatus']): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/admin/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  }

  // Update order notes
  static async updateOrderNotes(id: number, notes: string): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/admin/orders/${id}/notes`, { notes });
    return response.data;
  }

  // Cancel order
  static async cancelOrder(id: number, reason?: string): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/admin/orders/${id}/cancel`, { reason });
    return response.data;
  }

  // Refund order
  static async refundOrder(id: number, amount?: number, reason?: string): Promise<Order> {
    const response = await apiClient.put<Order>(`/api/admin/orders/${id}/refund`, { amount, reason });
    return response.data;
  }

  // Get order statistics
  static async getOrderStats(): Promise<any> {
    const response = await apiClient.get('/api/admin/orders/stats');
    return response.data;
  }

  // Get orders by user
  static async getOrdersByUser(userId: number): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(`/api/admin/orders/user/${userId}`);
    return response.data;
  }

  // Export orders to CSV
  static async exportOrders(filters?: OrderFilters): Promise<Blob> {
    const response = await apiClient.get('/api/admin/orders/export', {
      ...filters,
      format: 'csv'
    });
    return response.data;
  }

  // Get recent orders
  static async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/api/admin/orders/recent', { limit });
    return response.data;
  }

  // Get pending orders
  static async getPendingOrders(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/api/admin/orders/pending');
    return response.data;
  }

  // Get orders by date range
  static async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    const response = await apiClient.get<Order[]>('/api/admin/orders/date-range', {
      startDate,
      endDate
    });
    return response.data;
  }

  // Get order analytics
  static async getOrderAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const response = await apiClient.get('/api/admin/orders/analytics', { period });
    return response.data;
  }
}

export class CartService {
  // Get all cart items
  static async getCartItems(): Promise<CartItem[]> {
    const response = await apiClient.get<CartItem[]>('/api/admin/cart-items');
    return response.data;
  }

  // Get cart items by user
  static async getCartItemsByUser(userId: number): Promise<CartItem[]> {
    const response = await apiClient.get<CartItem[]>(`/api/admin/cart-items/user/${userId}`);
    return response.data;
  }

  // Get cart statistics
  static async getCartStats(): Promise<any> {
    const response = await apiClient.get('/api/admin/cart-items/stats');
    return response.data;
  }

  // Clear user cart
  static async clearUserCart(userId: number): Promise<void> {
    await apiClient.delete(`/api/admin/cart-items/user/${userId}`);
  }

  // Get abandoned carts
  static async getAbandonedCarts(daysSinceLastUpdate: number = 7): Promise<any[]> {
    const response = await apiClient.get('/api/admin/cart-items/abandoned', { daysSinceLastUpdate });
    return response.data;
  }

  // Get cart analytics
  static async getCartAnalytics(): Promise<any> {
    const response = await apiClient.get('/api/admin/cart-items/analytics');
    return response.data;
  }
}
