'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/products/ProductForm';
import { QuickProductCreate } from '@/components/products/QuickProductCreate';
import { useRequireAuth } from '@/hooks/useAuth';
import { Product, ProductFilters, ProductFormData } from '@/types';
import { ProductService } from '@/services/productService';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    status: '',
    category: undefined,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        search: searchTerm || undefined,
      };
      
      const response = await ProductService.getProducts(params);
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          // If response is directly an array
          setProducts(response);
          setPagination({
            total: response.length,
            totalPages: 1,
            currentPage: 1,
            hasNext: false,
            hasPrev: false,
          });
        } else if (response.items) {
          // If response has pagination structure
          setProducts(response.items);
          setPagination({
            total: response.pagination?.total || response.items.length,
            totalPages: response.pagination?.totalPages || Math.ceil((response.pagination?.total || response.items.length) / (filters.limit || 10)),
            currentPage: response.pagination?.page || filters.page || 1,
            hasNext: (response.pagination?.page || 1) < (response.pagination?.totalPages || 1),
            hasPrev: (response.pagination?.page || 1) > 1,
          });
        } else {
          // Fallback
          setProducts([]);
          setPagination({
            total: 0,
            totalPages: 0,
            currentPage: 1,
            hasNext: false,
            hasPrev: false,
          });
        }
      } else {
        setProducts([]);
        setPagination({
          total: 0,
          totalPages: 0,
          currentPage: 1,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      // Show specific error messages
      let errorMessage = 'Failed to load products';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request parameters. Please check your filters.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view products.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      toast.error(errorMessage);
      setProducts([]);
      setPagination({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    // Validate sort order
    if (key === 'sortOrder' && !['ASC', 'DESC'].includes(value)) {
      toast.error('Sort order must be ASC or DESC');
      return;
    }
    
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const handleQuickProductCreated = (product: any) => {
    setShowQuickCreate(false);
    fetchProducts(); // Refresh the product list
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await ProductService.createProduct(data);
      toast.success('Product created successfully');
      setShowCreateModal(false);
      fetchProducts();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    try {
      if (!editingProduct) return;
      
      await ProductService.updateProduct(editingProduct.id, data);
      toast.success('Product updated successfully');
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await ProductService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      await ProductService.bulkDeleteProducts(selectedProducts);
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error: any) {
      console.error('Error bulk deleting products:', error);
      toast.error(error.response?.data?.message || 'Failed to delete products');
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleEditProduct = (productId: number) => {
    router.push(`/products/edit/${productId}`);
  };

  const columns = [
    {
      key: 'select',
      title: '',
      width: 50,
      render: (_: any, record: Product) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts(prev => [...prev, record.id]);
            } else {
              setSelectedProducts(prev => prev.filter(id => id !== record.id));
            }
          }}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      key: 'product',
      title: 'Product',
      render: (_: any, record: Product) => (
        <div className="flex items-center space-x-3">
          <img
            src={record.thumbnailImage || 'https://via.placeholder.com/50x50'}
            alt={record.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">SKU: {record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: Product) => (
        <Badge
          variant={
            record.status === 'active'
              ? 'success'
              : record.status === 'draft'
              ? 'warning'
              : 'gray'
          }
        >
          {record.status}
        </Badge>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      render: (_: any, record: Product) => (
        <div>
          <div className="font-medium">${Number(record.basePrice || 0).toFixed(2)}</div>
          {record.isOnSale && (
            <div className="text-sm text-success-600">
              Sale: ${Number(record.salePrice || 0).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (_: any, record: Product) => (
        <div className={record.stock <= record.lowStockThreshold ? 'text-warning-600' : ''}>
          {record.stock} units
        </div>
      ),
    },
    {
      key: 'sales',
      title: 'Sales',
      render: (_: any, record: Product) => (
        <div>
          <div className="font-medium">{record.soldQuantity}</div>
          <div className="text-sm text-gray-500">{record.viewCount} views</div>
        </div>
      ),
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (_: any, record: Product) => (
        <div>
          <div className="flex items-center">
            <span className="font-medium">{record.averageRating}</span>
            <span className="text-yellow-400 ml-1">★</span>
          </div>
          <div className="text-sm text-gray-500">{record.reviewCount} reviews</div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Product) => (
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleViewProduct(record.id)}
            title="View Product"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditProduct(record.id)}
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteProduct(record.id)}
            className="text-error-600 hover:text-error-700"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Let the useRequireAuth hook handle the redirect
  }

  return (
    <Layout title="Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your spiritual products inventory
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button variant="secondary" onClick={() => setShowQuickCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Full Add
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                {selectedProducts.length > 0 && (
                  <Button
                    variant="error"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedProducts.length})
                  </Button>
                )}
              </div>
            </div>
            
            {/* Advanced Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="name">Name</option>
                    <option value="basePrice">Price</option>
                    <option value="stock">Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="input"
                  >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Products</h3>
              <div className="text-sm text-gray-500">
                {pagination.total} products total
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              data={products}
              columns={columns}
              loading={loading}
              rowKey="id"
              emptyText="No products found"
            />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * (filters.limit || 10)) + 1} to{' '}
                  {Math.min(pagination.currentPage * (filters.limit || 10), pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={page === pagination.currentPage ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create Product Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Product"
          size="full"
        >
          <ProductForm
            onSave={handleCreateProduct}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
          size="full"
        >
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSave={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </Modal>

        {/* Quick Product Create Modal */}
        <Modal
          isOpen={showQuickCreate}
          onClose={() => setShowQuickCreate(false)}
          title="Quick Product Creation"
          size="lg"
        >
          <QuickProductCreate
            onProductCreated={handleQuickProductCreated}
            onCancel={() => setShowQuickCreate(false)}
          />
        </Modal>
      </div>
    </Layout>
  );
}
