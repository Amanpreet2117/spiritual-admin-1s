'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProductFormData } from '@/types';
import { ProductService } from '@/services/productService';
import { UploadService } from '@/services/uploadService';
import {
  Plus,
  Upload,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface QuickProductCreateProps {
  onProductCreated?: (product: any) => void;
  onCancel?: () => void;
}

export const QuickProductCreate: React.FC<QuickProductCreateProps> = ({
  onProductCreated,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: '',
    description: '',
    basePrice: 0,
    stock: 0,
    status: 'active',
    categoryId: 1, // Default category
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const imageUrl = await UploadService.uploadFile(file);
      setImages(prev => [...prev, imageUrl]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.basePrice) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      
      const productData: ProductFormData = {
        ...formData,
        name: formData.name!,
        description: formData.description || '',
        basePrice: Number(formData.basePrice),
        stock: Number(formData.stock || 0),
        status: formData.status as 'active' | 'inactive' | 'draft',
        categoryId: Number(formData.categoryId),
        images: images.map(url => ({ imageUrl: url, altText: formData.name })),
        shortDescription: formData.description?.substring(0, 100) || '',
        sku: `SKU-${Date.now()}`,
        weight: 0.1,
        dimensions: '10 x 10 x 5 cm',
        thumbnailImage: images[0] || '',
        isFeatured: false,
        isDigital: false,
        requiresShipping: true,
        taxClass: 'Standard',
        tags: [],
        lowStockThreshold: 5,
        minQuantity: 1,
        maxQuantity: 10,
        allowBackorder: false,
        trackQuantity: true,
        isOnSale: false,
        salePrice: 0,
        costPrice: 0,
        metaTitle: formData.name,
        metaDescription: formData.description?.substring(0, 160) || '',
        customFields: {},
      };

      const newProduct = await ProductService.createProduct(productData);
      toast.success('Product created successfully!');
      
      if (onProductCreated) {
        onProductCreated(newProduct);
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        basePrice: 0,
        stock: 0,
        status: 'active',
        categoryId: 1,
      });
      setImages([]);
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-gray-900">Quick Product Creation</h3>
        <p className="text-sm text-gray-500">Create a new product quickly</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
            
            <Input
              label="Base Price *"
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => handleInputChange('basePrice', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="input"
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              placeholder="0"
            />
            
            <div>
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <Input
              label="Category ID"
              type="number"
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              placeholder="1"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="form-label">Product Images</label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" loading={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
