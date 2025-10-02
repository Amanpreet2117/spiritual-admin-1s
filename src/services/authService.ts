import apiClient from '@/lib/api';
import { LoginCredentials, User, ApiResponse } from '@/types';
import Cookies from 'js-cookie';

export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/api/auth/login', credentials);
      
      if (response.token) {
        // Store token and user data in cookies
        Cookies.set('admin_token', response.token, { expires: 7 }); // 7 days
        Cookies.set('admin_user', JSON.stringify(response.user), { expires: 7 });
      }
      
      return {
        success: true,
        message: "Login successful",
        data: response,
      };
    } catch (error: any) {
      // Handle authentication errors
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout user
  static logout(): void {
    Cookies.remove('admin_token');
    Cookies.remove('admin_user');
  }

  // Get current user from cookies
  static getCurrentUser(): User | null {
    const userStr = Cookies.get('admin_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // Get token from cookies
  static getToken(): string | null {
    return Cookies.get('admin_token') || null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Check if user is admin
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role?.name === 'admin' || user?.role?.name === 'superadmin';
  }

  // Check if user is superadmin
  static isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role?.name === 'superadmin';
  }

  // Refresh token (if backend supports it)
  static async refreshToken(): Promise<boolean> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/api/auth/refresh');
      if (response.token) {
        Cookies.set('admin_token', response.token, { expires: 7 });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post('/api/auth/forgot-password', { email });
  }

  // Reset password
  static async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return apiClient.post('/api/auth/reset-password', { token, password });
  }
}
