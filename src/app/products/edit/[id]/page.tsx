'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/products/ProductForm';
import { useRequireAuth } from '@/hooks/useAuth';
import { Product, ProductFormData } from '@/types';
import { ProductService } from '@/services/productService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const productId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
  
      try {
        setLoading(true);
        console.log('Fetching product for edit with ID:', productId);
        const productData = await ProductService.getProductById(productId);
        console.log('Product data for edit received:', productData);
        setProduct(productData);
      } catch (error: any) {
        console.error('Error fetching product for edit:', error);
        console.error('Error response:', error.response);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to load product');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && productId) {
      fetchProduct();
    }
  }, [isAuthenticated, productId, router]);

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!product) return;

    try {
      await ProductService.updateProduct(product.id, data);
      toast.success('Product updated successfully');
      router.push(`/products/${product.id}`);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleCancel = () => {
    if (product) {
      router.push(`/products/${product.id}`);
    } else {
      router.push('/products');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Layout title="Edit Product">
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The product you&apos;re trying to edit doesn&apos;t exist or has been removed.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit ${product.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/products/${product.id}`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500">{product.name}</p>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white shadow rounded-lg">
          <ProductForm
            product={product}
            onSave={handleUpdateProduct}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </Layout>
  );
}
