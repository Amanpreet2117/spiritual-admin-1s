'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useRequireAuth } from '@/hooks/useAuth';
import { Category } from '@/types';
import { ProductService } from '@/services/productService';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Folder,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function CategoriesPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Category>>();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data: Partial<Category>) => {
    try {
      setModalLoading(true);
      await ProductService.createCategory(data);
      toast.success('Category created successfully');
      setShowCreateModal(false);
      reset();
      fetchCategories();
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateCategory = async (data: Partial<Category>) => {
    try {
      if (!editingCategory) return;
      
      setModalLoading(true);
      await ProductService.updateCategory(editingCategory.id, data);
      toast.success('Category updated successfully');
      setEditingCategory(null);
      reset();
      fetchCategories();
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await ProductService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCategory(null);
    reset();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      title: 'Category',
      render: (_, record: Category) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Folder className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">/{record.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      render: (_, record: Category) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {record.description || 'No description'}
        </div>
      ),
    },
    {
      key: 'sortOrder',
      title: 'Sort Order',
      render: (_, record: Category) => (
        <div className="text-sm font-medium">{record.sortOrder}</div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, record: Category) => (
        <Badge variant={record.isActive ? 'success' : 'gray'}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (_, record: Category) => (
        <div className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record: Category) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditCategory(record)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteCategory(record.id)}
            className="text-error-600 hover:text-error-700"
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
    <Layout title="Product Categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage product categories and organization
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Categories</h3>
              <div className="text-sm text-gray-500">
                {filteredCategories.length} categories
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              data={filteredCategories}
              columns={columns}
              loading={loading}
              rowKey="id"
              emptyText="No categories found"
            />
          </CardBody>
        </Card>

        {/* Create/Edit Category Modal */}
        <Modal
          isOpen={showCreateModal || !!editingCategory}
          onClose={handleCloseModal}
          title={editingCategory ? 'Edit Category' : 'Create New Category'}
          size="md"
        >
          <form onSubmit={handleSubmit(editingCategory ? handleUpdateCategory : handleCreateCategory)}>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  {...register('name', { required: 'Category name is required' })}
                  label="Category Name"
                  placeholder="Enter category name"
                  error={errors.name?.message}
                />

                <Input
                  {...register('slug')}
                  label="Slug"
                  placeholder="category-slug"
                  helperText="Leave empty to auto-generate from name"
                />

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Category description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register('sortOrder', { valueAsNumber: true })}
                    type="number"
                    label="Sort Order"
                    placeholder="0"
                  />

                  <div>
                    <label className="form-label">Status</label>
                    <select
                      {...register('isActive', { valueAsBoolean: true })}
                      className="input"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <Input
                  {...register('metaTitle')}
                  label="Meta Title"
                  placeholder="SEO title"
                />

                <div>
                  <label className="form-label">Meta Description</label>
                  <textarea
                    {...register('metaDescription')}
                    rows={2}
                    className="input"
                    placeholder="SEO description"
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" loading={modalLoading}>
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
