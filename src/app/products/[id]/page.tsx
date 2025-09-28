'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRequireAuth } from '@/hooks/useAuth';
import { Product } from '@/types';
import { ProductService } from '@/services/productService';
import {
  ArrowLeft,
  Edit,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  ShoppingCart,
  Tag,
  Calendar,
  Weight,
  Ruler,
  BarChart3,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Image from 'next/image';
import { clsx } from 'clsx';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
  
      try {
        setLoading(true);
        console.log('Fetching product with ID:', productId);
        const productData = await ProductService.getProductById(productId);
        console.log('Product data received:', productData);
        setProduct(productData);
      } catch (error: any) {
        console.error('Error fetching product:', error);
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

  const handleEdit = () => {
    if (product) {
      router.push(`/products/edit/${product.id}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'inactive':
        return 'gray';
      case 'archived':
        return 'error';
      default:
        return 'gray';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <Layout title="Product Details">
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
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];
  const primaryImage = product.thumbnailImage || (images.length > 0 ? images[0].imageUrl : null);

  return (
    <Layout title={`${product.name} - Product Details`}>
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => router.push('/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(product.status)}>
              {product.status}
            </Badge>
            <Button variant="accent" onClick={handleEdit} className="hover:scale-105 transition-transform duration-200">
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
              </CardHeader>
              <CardBody>
                {primaryImage ? (
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={clsx(
                              'aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-accent-500',
                              {
                                'border-accent-500': selectedImageIndex === index,
                                'border-gray-200': selectedImageIndex !== index,
                              }
                            )}
                          >
                            <Image
                              src={image.imageUrl}
                              alt={`${product.name} ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No images available</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Description */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
              </CardHeader>
              <CardBody>
                {product.description ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-800 whitespace-pre-wrap">{product.description}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No description available</p>
                )}
              </CardBody>
            </Card>

            {/* Product Details */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <p className="text-gray-900">{product.category?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Barcode</label>
                      <p className="text-gray-900">{product.barcode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Weight</label>
                      <p className="text-gray-900 flex items-center">
                        <Weight className="h-4 w-4 mr-1 text-accent-500" />
                        {product.weight ? `${product.weight} kg` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Dimensions</label>
                      <p className="text-gray-900 flex items-center">
                        <Ruler className="h-4 w-4 mr-1 text-accent-500" />
                        {product.dimensions || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Created</label>
                      <p className="text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-accent-500" />
                        {formatDate(product.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Last Updated</label>
                      <p className="text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-accent-500" />
                        {formatDate(product.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tax Class</label>
                      <p className="text-gray-900">{product.taxClass || 'Standard'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Product Type</label>
                      <p className="text-gray-900">
                        {product.isDigital ? 'Digital' : 'Physical'}
                        {product.requiresShipping && !product.isDigital && ' (Requires Shipping)'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Purposes */}
            {product.purposes && product.purposes.length > 0 && (
              <Card className="bg-accent-50">
                <CardHeader>
                  <h3 className="text-lg font-medium text-gray-900">Spiritual Purposes</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {product.purposes.map((purpose) => (
                      <Badge key={purpose.id} variant="accent">
                        {purpose.name}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <Card className="bg-accent-50">
                <CardHeader>
                  <h3 className="text-lg font-medium text-gray-900">Tags</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline-secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Base Price</label>
                  <p className="text-2xl font-bold text-accent-700 flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-accent-500" />
                    {formatPrice(product.basePrice)}
                  </p>
                </div>
                {product.comparePrice && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Compare Price</label>
                    <p className="text-lg text-gray-600 line-through">
                      {formatPrice(product.comparePrice)}
                    </p>
                  </div>
                )}
                {product.costPrice && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cost Price</label>
                    <p className="text-lg text-gray-600">
                      {formatPrice(product.costPrice)}
                    </p>
                  </div>
                )}
                {product.isOnSale && product.salePrice && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sale Price</label>
                    <p className="text-xl font-bold text-success-600">
                      {formatPrice(product.salePrice)}
                    </p>
                    {product.saleStartDate && product.saleEndDate && (
                      <p className="text-sm text-gray-500">
                        Sale: {formatDate(product.saleStartDate)} - {formatDate(product.saleEndDate)}
                      </p>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Inventory */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Stock Quantity</label>
                  <p className={clsx('text-2xl font-bold', {
                    'text-warning-700': product.stock <= product.lowStockThreshold,
                    'text-gray-900': product.stock > product.lowStockThreshold,
                  })}>
                    {product.stock} units
                  </p>
                  {product.stock <= product.lowStockThreshold && (
                    <p className="text-sm text-warning-700 flex items-center mt-1">
                      <AlertTriangle className="h-4 w-4 mr-1 text-warning-500" />
                      Low stock alert
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Low Stock Threshold</label>
                  <p className="text-lg text-gray-600">{product.lowStockThreshold} units</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sold Quantity</label>
                  <p className="text-lg text-gray-600">{product.soldQuantity} units</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Track Quantity</span>
                    <Badge variant={product.trackQuantity ? 'accent' : 'gray'}>
                      {product.trackQuantity ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Allow Backorder</span>
                    <Badge variant={product.allowBackorder ? 'accent' : 'gray'}>
                      {product.allowBackorder ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Performance */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Performance</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Views</label>
                  <p className="text-lg text-accent-700 flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-accent-500" />
                    {product.viewCount}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Average Rating</label>
                  <p className="text-lg text-accent-700 flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sales</label>
                  <p className="text-lg text-accent-700 flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-1 text-accent-500" />
                    {product.soldQuantity} units
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Product Flags */}
            <Card className="bg-accent-50">
              <CardHeader>
                <h3 className="text-lg font-medium text-gray-900">Product Flags</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Featured</span>
                    <Badge variant={product.isFeatured ? 'accent' : 'gray'}>
                      {product.isFeatured ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">New Product</span>
                    <Badge variant={product.isNew ? 'accent' : 'gray'}>
                      {product.isNew ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Best Seller</span>
                    <Badge variant={product.isBestSeller ? 'accent' : 'gray'}>
                      {product.isBestSeller ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Trending</span>
                    <Badge variant={product.isTrending ? 'accent' : 'gray'}>
                      {product.isTrending ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">On Sale</span>
                    <Badge variant={product.isOnSale ? 'accent' : 'gray'}>
                      {product.isOnSale ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* SEO */}
            {(product.metaTitle || product.metaDescription) && (
              <Card className="bg-accent-50">
                <CardHeader>
                  <h3 className="text-lg font-medium text-gray-900">SEO</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {product.metaTitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Meta Title</label>
                      <p className="text-sm text-gray-700">{product.metaTitle}</p>
                    </div>
                  )}
                  {product.metaDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Meta Description</label>
                      <p className="text-sm text-gray-700">{product.metaDescription}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
