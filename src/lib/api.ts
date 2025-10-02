import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse, PaginatedResponse, MenuItem, Category } from '@/types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://spiritual-article-back-end.onrender.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          Cookies.remove('admin_token');
          Cookies.remove('admin_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request methods
  async get<T = any>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    console.log(`ApiClient.get: Raw Axios response for ${url}:`, response);
    console.log(`ApiClient.get: Extracted ApiResponse object (response.data):`, response.data);
    return response.data.data; 
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data; 
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data; 
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data.data; 
  }

  async delete<T = any>(url: string, data?: any): Promise<void> {
    await this.client.delete<ApiResponse<T>>(url, { data });
  }

  // Upload file method
  async uploadFile(file: File, path?: string): Promise<{ url: string; key: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const response = await this.client.post<ApiResponse<{ url: string; key: string }>>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Menu API calls
export const fetchMenus = async (): Promise<MenuItem[]> => {
  return apiClient.get<MenuItem[]>('/api/menus');
};

export const createMenu = async (menuData: Omit<MenuItem, 'id' | 'children'>): Promise<MenuItem> => {
  return apiClient.post<MenuItem>('/api/menus', menuData);
};

export const updateMenu = async (id: number, menuData: Omit<MenuItem, 'id' | 'children'>): Promise<MenuItem> => {
  return apiClient.put<MenuItem>(`/api/menus/${id}`, menuData);
};

export const deleteMenu = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/menus/${id}`);
};

// Category API calls
export const fetchCategories = async (): Promise<Category[]> => {
  return apiClient.get<Category[]>('/api/categories');
};
