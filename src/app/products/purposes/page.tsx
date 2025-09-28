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
import { Purpose } from '@/types';
import { ProductService } from '@/services/productService';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Heart,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function PurposesPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPurpose, setEditingPurpose] = useState<Purpose | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Purpose>>();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPurposes();
    }
  }, [isAuthenticated]);

  const fetchPurposes = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getPurposes();
      setPurposes(data);
    } catch (error) {
      console.error('Error fetching purposes:', error);
      toast.error('Failed to load purposes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePurpose = async (data: Partial<Purpose>) => {
    try {
      setModalLoading(true);
      await ProductService.createPurpose(data);
      toast.success('Purpose created successfully');
      setShowCreateModal(false);
      reset();
      fetchPurposes();
    } catch (error: any) {
      console.error('Error creating purpose:', error);
      toast.error(error.response?.data?.message || 'Failed to create purpose');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdatePurpose = async (data: Partial<Purpose>) => {
    try {
      if (!editingPurpose) return;
      
      setModalLoading(true);
      await ProductService.updatePurpose(editingPurpose.id, data);
      toast.success('Purpose updated successfully');
      setEditingPurpose(null);
      reset();
      fetchPurposes();
    } catch (error: any) {
      console.error('Error updating purpose:', error);
      toast.error(error.response?.data?.message || 'Failed to update purpose');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeletePurpose = async (id: number) => {
    if (!confirm('Are you sure you want to delete this purpose?')) return;

    try {
      await ProductService.deletePurpose(id);
      toast.success('Purpose deleted successfully');
      fetchPurposes();
    } catch (error: any) {
      console.error('Error deleting purpose:', error);
      toast.error(error.response?.data?.message || 'Failed to delete purpose');
    }
  };

  const handleEditPurpose = (purpose: Purpose) => {
    setEditingPurpose(purpose);
    reset({
      name: purpose.name,
      slug: purpose.slug,
      description: purpose.description,
      color: purpose.color,
      sortOrder: purpose.sortOrder,
      isActive: purpose.isActive,
    });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPurpose(null);
    reset();
  };

  const filteredPurposes = purposes.filter(purpose =>
    purpose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purpose.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      title: 'Purpose',
      render: ( _: any, record: Purpose) => (
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: record.color }}
          >
            <Heart className="h-5 w-5 text-white" />
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
      render: ( _: any, record: Purpose) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {record.description || 'No description'}
        </div>
      ),
    },
    {
      key: 'color',
      title: 'Color',
      render: ( _: any, record: Purpose) => (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full border-2 border-gray-200"
            style={{ backgroundColor: record.color }}
          ></div>
          <span className="text-sm font-mono">{record.color}</span>
        </div>
      ),
    },
    {
      key: 'sortOrder',
      title: 'Sort Order',
      render: ( _: any, record: Purpose) => (
        <div className="text-sm font-medium">{record.sortOrder}</div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: ( _: any, record: Purpose) => (
        <Badge variant={record.isActive ? 'success' : 'gray'}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: ( _: any, record: Purpose) => (
        <div className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: ( _: any, record: Purpose) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditPurpose(record)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeletePurpose(record.id)}
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
    <Layout title="Product Purposes">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Purposes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage spiritual purposes for products (Love, Health, Protection, etc.)
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Purpose
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
                    placeholder="Search purposes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Purposes Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Purposes</h3>
              <div className="text-sm text-gray-500">
                {filteredPurposes.length} purposes
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              data={filteredPurposes}
              columns={columns}
              loading={loading}
              rowKey="id"
              emptyText="No purposes found"
            />
          </CardBody>
        </Card>

        {/* Create/Edit Purpose Modal */}
        <Modal
          isOpen={showCreateModal || !!editingPurpose}
          onClose={handleCloseModal}
          title={editingPurpose ? 'Edit Purpose' : 'Create New Purpose'}
          size="md"
        >
          <form onSubmit={handleSubmit(editingPurpose ? handleUpdatePurpose : handleCreatePurpose)}>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  {...register('name', { required: 'Purpose name is required' })}
                  label="Purpose Name"
                  placeholder="Enter purpose name"
                  error={errors.name?.message}
                />

                <Input
                  {...register('slug')}
                  label="Slug"
                  placeholder="purpose-slug"
                  helperText="Leave empty to auto-generate from name"
                />

                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Purpose description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register('color', { required: 'Color is required' })}
                    label="Color"
                    placeholder="#FF6B6B"
                    error={errors.color?.message}
                    helperText="Hex color code"
                  />

                  <Input
                    {...register('sortOrder', { valueAsNumber: true })}
                    type="number"
                    label="Sort Order"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    {...register('isActive')}
                    className="input"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" loading={modalLoading}>
                {editingPurpose ? 'Update Purpose' : 'Create Purpose'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
