'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { ProductService } from '@/services/productService';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductMonitorProps {
  refreshInterval?: number; // in milliseconds
}

export const ProductMonitor: React.FC<ProductMonitorProps> = ({ 
  refreshInterval = 30000 // 30 seconds default
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts({ limit: 100 });
      const productList = Array.isArray(response) ? response : response.items || [];
      
      setProducts(productList);
      setLastUpdated(new Date());
      
      // Calculate stats
      const stats = {
        total: productList.length,
        active: productList.filter(p => p.status === 'active').length,
        inactive: productList.filter(p => p.status === 'inactive').length,
        lowStock: productList.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length,
        outOfStock: productList.filter(p => p.stock === 0).length,
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching products for monitoring:', error);
      toast.error('Failed to refresh product data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Set up auto-refresh
    const interval = setInterval(fetchProducts, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { variant: 'error' as const, text: 'Out of Stock', icon: AlertTriangle };
    } else if (product.stock <= product.lowStockThreshold) {
      return { variant: 'warning' as const, text: 'Low Stock', icon: AlertTriangle };
    } else {
      return { variant: 'success' as const, text: 'In Stock', icon: Package };
    }
  };

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStockProducts = products
    .filter(p => p.stock <= p.lowStockThreshold)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Products</div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
                <div className="text-sm text-gray-500">Inactive</div>
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
                <div className="text-2xl font-bold text-gray-900">{stats.lowStock}</div>
                <div className="text-sm text-gray-500">Low Stock</div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-2 bg-error-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.outOfStock}</div>
                <div className="text-sm text-gray-500">Out of Stock</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Products</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchProducts}
                loading={loading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={product.thumbnailImage || 'https://via.placeholder.com/40x40'}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={product.status === 'active' ? 'success' : 'gray'}>
                    {product.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
              <Badge variant="warning">
                {lowStockProducts.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const IconComponent = stockStatus.icon;
                  
                  return (
                    <div key={product.id} className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg">
                      <img
                        src={product.thumbnailImage || 'https://via.placeholder.com/40x40'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Stock: {product.stock} / {product.lowStockThreshold}
                        </div>
                      </div>
                      <Badge variant={stockStatus.variant}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {stockStatus.text}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>All products are well stocked!</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdated.toLocaleTimeString()}
        {loading && <span className="ml-2">• Updating...</span>}
      </div>
    </div>
  );
};
