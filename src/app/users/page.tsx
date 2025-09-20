'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useRequireAuth } from '@/hooks/useAuth';
import { User, UserFilters } from '@/types';
import { UserService } from '@/services/userService';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'johndoe',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1-555-0123',
          address: '123 Main St, New York, NY 10001',
          dob: '1990-01-15',
          isActive: true,
          roleId: 1,
          role: {
            id: 1,
            name: 'admin',
            description: 'Administrator',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          username: 'janesmith',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '+1-555-0456',
          address: '456 Oak Ave, Los Angeles, CA 90210',
          dob: '1985-05-20',
          isActive: true,
          roleId: 2,
          role: {
            id: 2,
            name: 'user',
            description: 'Regular User',
          },
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
        },
        {
          id: 3,
          username: 'bobjohnson',
          email: 'bob@example.com',
          firstName: 'Bob',
          lastName: 'Johnson',
          phone: '+1-555-0789',
          isActive: false,
          roleId: 2,
          role: {
            id: 2,
            name: 'user',
            description: 'Regular User',
          },
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-10T09:15:00Z',
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      // In real implementation, call UserService.toggleUserStatus(userId, isActive)
      console.log('Toggling user status:', userId, isActive);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // In real implementation, call UserService.deleteUser(id)
      console.log('Deleting user:', id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;

    try {
      // In real implementation, call UserService.bulkDeleteUsers(selectedUsers)
      console.log('Bulk deleting users:', selectedUsers);
      toast.success(`${selectedUsers.length} users deleted successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      toast.error('Failed to delete users');
    }
  };

  const columns = [
    {
      key: 'select',
      title: '',
      width: 50,
      render: (_, record: User) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers(prev => [...prev, record.id]);
            } else {
              setSelectedUsers(prev => prev.filter(id => id !== record.id));
            }
          }}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      key: 'user',
      title: 'User',
      render: (_, record: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium text-sm">
              {record.firstName?.charAt(0) || record.username.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName && record.lastName
                ? `${record.firstName} ${record.lastName}`
                : record.username}
            </div>
            <div className="text-sm text-gray-500">@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (_, record: User) => (
        <div>
          <div className="text-sm text-gray-900">{record.email}</div>
          {record.phone && (
            <div className="text-sm text-gray-500">{record.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (_, record: User) => (
        <Badge
          variant={
            record.role?.name === 'admin' || record.role?.name === 'superadmin'
              ? 'primary'
              : 'secondary'
          }
        >
          <Shield className="h-3 w-3 mr-1" />
          {record.role?.name || 'User'}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, record: User) => (
        <Badge variant={record.isActive ? 'success' : 'gray'}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'joined',
      title: 'Joined',
      render: (_, record: User) => (
        <div className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record: User) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleToggleUserStatus(record.id, !record.isActive)}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteUser(record.id)}
            className="text-error-600 hover:text-error-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Layout title="Users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Button variant="secondary">
              <UserIcon className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-500">Total Users</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.isActive).length}
                  </div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Shield className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role?.name === 'admin' || u.role?.name === 'superadmin').length}
                  </div>
                  <div className="text-sm text-gray-500">Admins</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => !u.isActive).length}
                  </div>
                  <div className="text-sm text-gray-500">Inactive Users</div>
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {selectedUsers.length > 0 && (
                  <Button
                    variant="error"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedUsers.length})
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Users</h3>
              <div className="text-sm text-gray-500">
                {users.length} users
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              data={users}
              columns={columns}
              loading={loading}
              rowKey="id"
              emptyText="No users found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
