import apiClient from '@/lib/api';
import { DashboardStats, SalesData, UserGrowthData } from '@/types';

export class DashboardService {
  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/api/admin/dashboard/stats');
    return response;
  }

  // Get sales data for charts
  static async getSalesData(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<SalesData[]> {
    const response = await apiClient.get<SalesData[]>('/api/admin/dashboard/sales-data', { period });
    return response;
  }

  // Get user growth data
  static async getUserGrowthData(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<UserGrowthData[]> {
    const response = await apiClient.get<UserGrowthData[]>('/api/admin/dashboard/user-growth', { period });
    return response;
  }

  // Get revenue analytics
  static async getRevenueAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> {
    const response = await apiClient.get('/api/admin/dashboard/revenue-analytics', { period });
    return response;
  }

  // Get product performance
  static async getProductPerformance(limit: number = 10): Promise<any[]> {
    const response = await apiClient.get('/api/admin/dashboard/product-performance', { limit });
    return response;
  }

  // Get category performance
  static async getCategoryPerformance(): Promise<any[]> {
    const response = await apiClient.get('/api/admin/dashboard/category-performance');
    return response;
  }

  // Get user activity
  static async getUserActivity(period: 'day' | 'week' | 'month' = 'week'): Promise<any[]> {
    const response = await apiClient.get('/api/admin/dashboard/user-activity', { period });
    return response;
  }

  // Get conversion rates
  static async getConversionRates(): Promise<any> {
    const response = await apiClient.get('/api/admin/dashboard/conversion-rates');
    return response;
  }

  // Get inventory alerts
  static async getInventoryAlerts(): Promise<any[]> {
    const response = await apiClient.get('/api/admin/dashboard/inventory-alerts');
    return response;
  }

  // Get recent activities
  static async getRecentActivities(limit: number = 20): Promise<any[]> {
    const response = await apiClient.get('/api/admin/dashboard/recent-activities', { limit });
    return response;
  }

  // Get top customers
  static async getTopCustomers(limit: number = 10): Promise<any[]> {
    const response = await apiClient.get('/api/admin/dashboard/top-customers', { limit });
    return response;
  }

  // Get order status distribution
  static async getOrderStatusDistribution(): Promise<any> {
    const response = await apiClient.get('/api/admin/dashboard/order-status-distribution');
    return response;
  }

  // Get payment method distribution
  static async getPaymentMethodDistribution(): Promise<any> {
    const response = await apiClient.get('/api/admin/dashboard/payment-method-distribution');
    return response;
  }
}
