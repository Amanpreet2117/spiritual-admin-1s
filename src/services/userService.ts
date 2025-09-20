import apiClient from '@/lib/api';
import { User, PaginatedResponse } from '@/types';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class UserService {
  // Get all users with filters
  static async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>('/api/admin/users', filters);
    return response.data;
  }

  // Get user by ID
  static async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/api/admin/users/${id}`);
    return response.data;
  }

  // Create new user
  static async createUser(userData: Partial<User>): Promise<User> {
    const response = await apiClient.post<User>('/api/admin/users', userData);
    return response.data;
  }

  // Update user
  static async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`/api/admin/users/${id}`, userData);
    return response.data;
  }

  // Delete user
  static async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/users/${id}`);
  }

  // Activate/Deactivate user
  static async toggleUserStatus(id: number, isActive: boolean): Promise<User> {
    const response = await apiClient.put<User>(`/api/admin/users/${id}/status`, { isActive });
    return response.data;
  }

  // Update user role
  static async updateUserRole(id: number, roleId: number): Promise<User> {
    const response = await apiClient.put<User>(`/api/admin/users/${id}/role`, { roleId });
    return response.data;
  }

  // Get user statistics
  static async getUserStats(): Promise<any> {
    const response = await apiClient.get('/api/admin/users/stats');
    return response.data;
  }

  // Get active users
  static async getActiveUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/api/admin/users/active');
    return response.data;
  }

  // Get recent users
  static async getRecentUsers(limit: number = 10): Promise<User[]> {
    const response = await apiClient.get<User[]>('/api/admin/users/recent', { limit });
    return response.data;
  }

  // Search users
  static async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>('/api/admin/users/search', { query });
    return response.data;
  }

  // Bulk update users
  static async bulkUpdateUsers(ids: number[], updates: Partial<User>): Promise<void> {
    await apiClient.put('/api/admin/users/bulk-update', { ids, updates });
  }

  // Bulk delete users
  static async bulkDeleteUsers(ids: number[]): Promise<void> {
    await apiClient.delete('/api/admin/users/bulk-delete', { data: { ids } });
  }

  // Export users to CSV
  static async exportUsers(filters?: UserFilters): Promise<Blob> {
    const response = await apiClient.get('/api/admin/users/export', {
      ...filters,
      format: 'csv'
    });
    return response.data;
  }

  // Get user activity
  static async getUserActivity(userId: number): Promise<any[]> {
    const response = await apiClient.get(`/api/admin/users/${userId}/activity`);
    return response.data;
  }

  // Get user orders
  static async getUserOrders(userId: number): Promise<any[]> {
    const response = await apiClient.get(`/api/admin/users/${userId}/orders`);
    return response.data;
  }

  // Get user cart
  static async getUserCart(userId: number): Promise<any[]> {
    const response = await apiClient.get(`/api/admin/users/${userId}/cart`);
    return response.data;
  }
}
