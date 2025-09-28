'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useRequireAuth } from '@/hooks/useAuth';
import { Product } from '@/types';
import { ProductService } from '@/services/productService';
import {
  Search,
  Package,
  AlertTriangle,
  Edit,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Image from 'next/image';

export default function LowStockPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockThreshold, setStockThreshold] = useState(10);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLowStockProducts();
    }
  }, [isAuthenticated]);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getLowStockProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      toast.error('Failed to load low stock products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      await ProductService.updateProductStock(productId, newStock);
      toast.success('Stock updated successfully');
      fetchLowStockProducts();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error(error.response?.data?.message || 'Failed to update stock');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const isLowStock = product.stock <= stockThreshold;
    return matchesSearch && isLowStock;
  });

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { variant: 'error' as const, text: 'Out of Stock', icon: AlertTriangle };
    } else if (product.stock <= product.lowStockThreshold) {
      return { variant: 'warning' as const, text: 'Low Stock', icon: AlertTriangle };
    } else {
      return { variant: 'success' as const, text: 'In Stock', icon: Package };
    }
  };

  const columns = [
    {
      key: 'product',
      title: 'Product',
      render: (_: any, record: Product) => (
        <div className="flex items-center space-x-3">
          <Image
            src={record.thumbnailImage || 'https://via.placeholder.com/50x50'}
            alt={record.name}
            width={50}
            height={50}
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
      key: 'category',
      title: 'Category',
      render: (_: any, record: Product) => (
        <div className="text-sm text-gray-600">
          {record.category?.name || 'Uncategorized'}
        </div>
      ),
    },
    {
      key: 'currentStock',
      title: 'Current Stock',
      render: (_: any, record: Product) => (
        <div className="text-center">
          <div className={`text-lg font-bold ${
            record.stock === 0 ? 'text-error-600' : 
            record.stock <= record.lowStockThreshold ? 'text-warning-600' : 
            'text-success-600'
          }`}>
            {record.stock}
          </div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      ),
    },
    {
      key: 'lowStockThreshold',
      title: 'Low Stock Threshold',
      render: (_: any, record: Product) => (
        <div className="text-center">
          <div className="text-sm font-medium">{record.lowStockThreshold}</div>
          <div className="text-xs text-gray-500">units</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: Product) => {
        const stockStatus = getStockStatus(record);
        const IconComponent = stockStatus.icon;
        return (
          <Badge variant={stockStatus.variant}>
            <IconComponent className="h-3 w-3 mr-1" />
            {stockStatus.text}
          </Badge>
        );
      },
    },
    {
      key: 'price',
      title: 'Price',
      render: (_: any, record: Product) => (
        <div>
          <div className="font-medium">${Number(record.basePrice || 0).toFixed(2)}</div>
          {record.costPrice && (
            <div className="text-sm text-gray-500">Cost: ${Number(record.costPrice || 0).toFixed(2)}</div>
          )}
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
            onClick={() => {
              const newStock = prompt(`Enter new stock for ${record.name}:`, record.stock.toString());
              if (newStock && !isNaN(Number(newStock))) {
                handleUpdateStock(record.id, Number(newStock));
              }
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
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
    <Layout title="Low Stock Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Low Stock Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor products with low inventory levels
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-error-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-error-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.stock === 0).length}
                  </div>
                  <div className="text-sm text-gray-500">Out of Stock</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length}
                  </div>
                  <div className="text-sm text-gray-500">Low Stock</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {products.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Alerts</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-lg">
                  <Package className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ${products.reduce((total, p) => total + (p.costPrice || 0) * p.stock, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">Inventory Value</div>
                </div>
              </div>
            </CardBody>
          </Card>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Stock Threshold:</label>
                <Input
                  type="number"
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(Number(e.target.value))}
                  className="w-20"
                  min="1"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Low Stock Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Low Stock Products</h3>
              <div className="text-sm text-gray-500">
                {filteredProducts.length} products need attention
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              data={filteredProducts}
              columns={columns}
              loading={loading}
              rowKey="id"
              emptyText="No low stock products found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
