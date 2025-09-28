import apiClient from '@/lib/api';
import { 
  Product, 
  ProductFormData, 
  ProductFilters, 
  PaginatedResponse,
  Category,
  Purpose,
  Variant,
  ProductImage
} from '@/types';

export class ProductService {
  // Get all products with filters
  static async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Validate sort order
            if (key === 'sortOrder' && !['ASC', 'DESC'].includes(value.toString().toUpperCase())) {
              throw new Error('Sort order must be ASC or DESC');
            }
            
            // Convert sort order to uppercase if needed
            if (key === 'sortOrder') {
              params.append(key, value.toString().toUpperCase());
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const response = await apiClient.get<PaginatedResponse<Product>>(`/api/admin/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/admin/products/${id}`);
    return response.data;
  }

  // Create new product
  static async createProduct(productData: ProductFormData): Promise<Product> {
    const response = await apiClient.post<Product>('/api/admin/products', productData);
    return response.data;
  }

  // Update product
  static async updateProduct(id: number, productData: Partial<ProductFormData>): Promise<Product> {
    const response = await apiClient.put<Product>(`/api/admin/products/${id}`, productData);
    return response.data;
  }

  // Delete product
  static async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${id}`);
  }

  // Bulk update products
  static async bulkUpdateProducts(ids: number[], updates: Partial<ProductFormData>): Promise<void> {
    await apiClient.put('/api/admin/products/bulk-update', { ids, updates });
  }

  // Bulk delete products
  static async bulkDeleteProducts(ids: number[]): Promise<void> {
    await apiClient.delete('/api/admin/products/bulk-delete', { data: { ids } });
  }

  // Get low stock products
  static async getLowStockProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/admin/products/low-stock');
    return response.data;
  }

  // Category CRUD operations
  static async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const response = await apiClient.post<Category>('/api/categories', categoryData);
    return response.data;
  }

  static async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    const response = await apiClient.put<Category>(`/api/categories/${id}`, categoryData);
    return response.data;
  }

  static async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/categories/${id}`);
  }

  // Purpose CRUD operations
  static async createPurpose(purposeData: Partial<Purpose>): Promise<Purpose> {
    const response = await apiClient.post<Purpose>('/api/purposes', purposeData);
    return response.data;
  }

  static async updatePurpose(id: number, purposeData: Partial<Purpose>): Promise<Purpose> {
    const response = await apiClient.put<Purpose>(`/api/purposes/${id}`, purposeData);
    return response.data;
  }

  static async deletePurpose(id: number): Promise<void> {
    await apiClient.delete(`/api/purposes/${id}`);
  }

  // Update product stock
  static async updateProductStock(id: number, stock: number): Promise<Product> {
    const response = await apiClient.put<Product>(`/api/admin/products/${id}/stock`, { stock });
    return response.data;
  }

  // Get product statistics
  static async getProductStats(): Promise<any> {
    const response = await apiClient.get('/api/admin/products/stats');
    return response.data;
  }

  // Product Images
  static async addProductImage(productId: number, imageData: { imageUrl: string; altText?: string; isPrimary?: boolean }): Promise<ProductImage> {
    const response = await apiClient.post<ProductImage>(`/api/admin/products/${productId}/images`, imageData);
    return response.data;
  }

  static async removeProductImage(productId: number, imageId: number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${productId}/images/${imageId}`);
  }

  // Product Variants
  static async createProductVariant(productId: number, variantData: Partial<Variant>): Promise<Variant> {
    const response = await apiClient.post<Variant>(`/api/admin/products/${productId}/variants`, variantData);
    return response.data;
  }

  static async updateProductVariant(productId: number, variantId: number, variantData: Partial<Variant>): Promise<Variant> {
    const response = await apiClient.put<Variant>(`/api/admin/products/${productId}/variants/${variantId}`, variantData);
    return response.data;
  }

  static async deleteProductVariant(productId: number, variantId: number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${productId}/variants/${variantId}`);
  }

  // Product Purposes
  static async getProductPurposes(productId: number): Promise<Purpose[]> {
    const response = await apiClient.get<Purpose[]>(`/api/admin/products/${productId}/purposes`);
    return response.data;
  }

  static async attachPurpose(productId: number, purposeId: number): Promise<void> {
    await apiClient.post(`/api/admin/products/${productId}/purposes/${purposeId}`);
  }

  static async detachPurpose(productId: number, purposeId: number): Promise<void> {
    await apiClient.delete(`/api/admin/products/${productId}/purposes/${purposeId}`);
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/api/categories');
    return response.data;
  }

  // Purposes
  static async getPurposes(): Promise<Purpose[]> {
    const response = await apiClient.get<Purpose[]>('/api/purposes');
    return response.data;
  }
}

