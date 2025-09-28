'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ProductFormData, Category, Purpose } from '@/types';
import { ProductService } from '@/services/productService';
import { UploadService } from '@/services/uploadService';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import Image from 'next/image';

interface ProductFormProps {
  product?: any;
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      categoryId: product?.categoryId || 1,
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      basePrice: product?.basePrice || 0,
      comparePrice: product?.comparePrice || 0,
      sku: product?.sku || '',
      stock: product?.stock || 0,
      lowStockThreshold: product?.lowStockThreshold || 5,
      weight: product?.weight || 0,
      dimensions: product?.dimensions || '',
      thumbnailImage: product?.thumbnailImage || '',
      status: product?.status || 'active',
      isFeatured: product?.isFeatured || false,
      isDigital: product?.isDigital || false,
      requiresShipping: product?.requiresShipping || true,
      taxClass: product?.taxClass || '',
      metaTitle: product?.metaTitle || '',
      metaDescription: product?.metaDescription || '',
      tags: product?.tags || [],
      barcode: product?.barcode || '',
      costPrice: product?.costPrice || 0,
      salePrice: product?.salePrice || 0,
      isOnSale: product?.isOnSale || false,
      saleStartDate: product?.saleStartDate || '',
      saleEndDate: product?.saleEndDate || '',
      minQuantity: product?.minQuantity || 1,
      maxQuantity: product?.maxQuantity || 0,
      allowBackorder: product?.allowBackorder || false,
      trackQuantity: product?.trackQuantity || true,
      customFields: product?.customFields || {},
    },
  });

  useEffect(() => {
    fetchCategories();
    fetchPurposes();
    if (product?.purposes) {
      setSelectedPurposes(product.purposes.map((p: Purpose) => p.id));
    }
    if (product?.images) {
      setImages(product.images.map((img: any) => img.imageUrl));
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const data = await ProductService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchPurposes = async () => {
    try {
      const data = await ProductService.getPurposes();
      setPurposes(data);
    } catch (error) {
      console.error('Error fetching purposes:', error);
      toast.error('Failed to load purposes');
    }
  };

  const handleImageUpload = async (file: File) => {
    const validation = UploadService.validateFile(file, {
      maxSize: 5,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    try {
      setUploading(true);
      const compressedFile = await UploadService.compressImage(file, 1200, 0.8);
      const result = await UploadService.uploadToS3(compressedFile, 'products');
      
      if (result.success) {
        setImages(prev => [...prev, result.url]);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const togglePurpose = (purposeId: number) => {
    setSelectedPurposes(prev =>
      prev.includes(purposeId)
        ? prev.filter(id => id !== purposeId)
        : [...prev, purposeId]
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      // Generate slug from name if not provided
      if (!data.slug && data.name) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      await onSave({
        ...data,
        thumbnailImage: images[0] || '',
        tags: data.tags.filter(tag => tag.trim() !== ''),
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const watchedTags = watch('tags') || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register('name', { required: 'Product name is required' })}
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name?.message}
                />
                <Input
                  {...register('slug')}
                  label="Slug"
                  placeholder="product-slug"
                  helperText="Leave empty to auto-generate from name"
                />
              </div>

              <Input
                {...register('shortDescription')}
                label="Short Description"
                placeholder="Brief product description"
              />

              <div>
                <label className="form-label">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input"
                  placeholder="Detailed product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="form-error">{errors.categoryId.message}</p>
                  )}
                </div>

                <Input
                  {...register('sku')}
                  label="SKU"
                  placeholder="Product SKU"
                />
                <Input
                  {...register('barcode')}
                  label="Barcode"
                  placeholder="Product barcode"
                />
              </div>
            </CardBody>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  {...register('basePrice', { required: 'Base price is required', min: 0 })}
                  type="number"
                  step="0.01"
                  label="Base Price"
                  placeholder="0.00"
                  error={errors.basePrice?.message}
                />
                <Input
                  {...register('comparePrice', { min: 0 })}
                  type="number"
                  step="0.01"
                  label="Compare Price"
                  placeholder="0.00"
                />
                <Input
                  {...register('costPrice', { min: 0 })}
                  type="number"
                  step="0.01"
                  label="Cost Price"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    {...register('isOnSale')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">On Sale</span>
                </label>
              </div>

              {watch('isOnSale') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    {...register('salePrice', { min: 0 })}
                    type="number"
                    step="0.01"
                    label="Sale Price"
                    placeholder="0.00"
                  />
                  <Input
                    {...register('saleStartDate')}
                    type="datetime-local"
                    label="Sale Start Date"
                  />
                  <Input
                    {...register('saleEndDate')}
                    type="datetime-local"
                    label="Sale End Date"
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  {...register('stock', { required: 'Stock is required', min: 0 })}
                  type="number"
                  label="Stock Quantity"
                  placeholder="0"
                  error={errors.stock?.message}
                />
                <Input
                  {...register('lowStockThreshold', { min: 0 })}
                  type="number"
                  label="Low Stock Threshold"
                  placeholder="5"
                />
                <Input
                  {...register('weight')}
                  type="number"
                  step="0.01"
                  label="Weight (kg)"
                  placeholder="0.00"
                />
              </div>

              <Input
                {...register('dimensions')}
                label="Dimensions"
                placeholder="L x W x H (cm)"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  {...register('minQuantity', { min: 1 })}
                  type="number"
                  label="Minimum Quantity"
                  placeholder="1"
                />
                <Input
                  {...register('maxQuantity', { min: 1 })}
                  type="number"
                  label="Maximum Quantity"
                  placeholder="0"
                />
                <Input
                  {...register('taxClass')}
                  label="Tax Class"
                  placeholder="Standard"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    {...register('trackQuantity')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Track Quantity</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('allowBackorder')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Backorder</span>
                </label>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Status</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="form-label">Product Status</label>
                <select
                  {...register('status')}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    {...register('isFeatured')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('isDigital')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Digital Product</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('requiresShipping')}
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires Shipping</span>
                </label>
              </div>
            </CardBody>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Images</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-error-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="primary">Primary</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer">
                      <span className="text-sm text-primary-600 hover:text-primary-500">
                        Upload Images
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(handleImageUpload);
                        }}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Purposes */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">Purposes</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {purposes.map(purpose => (
                  <label key={purpose.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPurposes.includes(purpose.id)}
                      onChange={() => togglePurpose(purpose.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{purpose.name}</span>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900">SEO</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                {...register('metaTitle')}
                label="Meta Title"
                placeholder="SEO title"
              />
              <div>
                <label className="form-label">Meta Description</label>
                <textarea
                  {...register('metaDescription')}
                  rows={3}
                  className="input"
                  placeholder="SEO description"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
