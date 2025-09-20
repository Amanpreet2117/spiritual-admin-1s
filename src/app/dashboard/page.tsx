'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Chart } from '@/components/dashboard/Chart';
import { ProductMonitor } from '@/components/products/ProductMonitor';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useRequireAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/types';
import { DashboardService } from '@/services/dashboardService';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration - replace with actual API calls
      const mockStats: DashboardStats = {
        totalProducts: 1247,
        totalOrders: 342,
        totalUsers: 1289,
        totalRevenue: 45678.90,
        pendingOrders: 23,
        lowStockProducts: 12,
        recentOrders: [
          {
            id: 1,
            orderNumber: 'ORD-001',
            userId: 1,
            status: 'pending',
            totalAmount: 299.99,
            shippingAmount: 10.00,
            taxAmount: 30.00,
            discountAmount: 0,
            paymentStatus: 'pending',
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Main St',
              city: 'New York',
              state: 'NY',
              postalCode: '10001',
              country: 'US',
            },
            billingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              address1: '123 Main St',
              city: 'New York',
              state: 'NY',
              postalCode: '10001',
              country: 'US',
            },
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
          },
          {
            id: 2,
            orderNumber: 'ORD-002',
            userId: 2,
            status: 'processing',
            totalAmount: 149.99,
            shippingAmount: 10.00,
            taxAmount: 15.00,
            discountAmount: 0,
            paymentStatus: 'paid',
            shippingAddress: {
              firstName: 'Jane',
              lastName: 'Smith',
              address1: '456 Oak Ave',
              city: 'Los Angeles',
              state: 'CA',
              postalCode: '90210',
              country: 'US',
            },
            billingAddress: {
              firstName: 'Jane',
              lastName: 'Smith',
              address1: '456 Oak Ave',
              city: 'Los Angeles',
              state: 'CA',
              postalCode: '90210',
              country: 'US',
            },
            createdAt: '2024-01-14T14:20:00Z',
            updatedAt: '2024-01-14T14:20:00Z',
          },
        ],
        topProducts: [],
        salesData: [
          { date: '2024-01-01', sales: 1200, orders: 15 },
          { date: '2024-01-02', sales: 1900, orders: 22 },
          { date: '2024-01-03', sales: 3000, orders: 35 },
          { date: '2024-01-04', sales: 2800, orders: 28 },
          { date: '2024-01-05', sales: 1890, orders: 20 },
          { date: '2024-01-06', sales: 2390, orders: 26 },
          { date: '2024-01-07', sales: 3490, orders: 42 },
        ],
        userGrowth: [
          { date: '2024-01-01', users: 100 },
          { date: '2024-01-02', users: 120 },
          { date: '2024-01-03', users: 150 },
          { date: '2024-01-04', users: 180 },
          { date: '2024-01-05', users: 200 },
          { date: '2024-01-06', users: 230 },
          { date: '2024-01-07', users: 260 },
        ],
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
    return null; // Let the useRequireAuth hook handle the redirect
  }

  const recentOrdersColumns = [
    {
      key: 'orderNumber',
      title: 'Order #',
      dataIndex: 'orderNumber' as const,
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (_, record: any) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.shippingAddress.firstName} {record.shippingAddress.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.shippingAddress.city}</div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, record: any) => (
        <Badge
          variant={
            record.status === 'pending'
              ? 'warning'
              : record.status === 'processing'
              ? 'primary'
              : 'success'
          }
        >
          {record.status}
        </Badge>
      ),
    },
    {
      key: 'totalAmount',
      title: 'Total',
      render: (_, record: any) => (
        <div className="font-medium">${Number(record.totalAmount || 0).toFixed(2)}</div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (_, record: any) => (
        <div className="text-sm text-gray-500">
          {new Date(record.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record: any) => (
        <Button size="sm" variant="secondary">
          View
        </Button>
      ),
    },
  ];

  const categoryData = [
    { name: 'Rudraksha', value: 35, color: '#0ea5e9' },
    { name: 'Mala', value: 25, color: '#22c55e' },
    { name: 'Gemstones', value: 20, color: '#f59e0b' },
    { name: 'Yantras', value: 12, color: '#ef4444' },
    { name: 'Idols', value: 8, color: '#8b5cf6' },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            change={12.5}
            changeType="positive"
            icon={<Package className="h-6 w-6" />}
            color="primary"
            loading={loading}
          />
          <StatsCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            change={8.2}
            changeType="positive"
            icon={<ShoppingCart className="h-6 w-6" />}
            color="success"
            loading={loading}
          />
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change={15.3}
            changeType="positive"
            icon={<Users className="h-6 w-6" />}
            color="warning"
            loading={loading}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            change={-2.1}
            changeType="negative"
            icon={<DollarSign className="h-6 w-6" />}
            color="error"
            loading={loading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            title="Sales Trend"
            data={stats?.salesData || []}
            type="area"
            dataKey="sales"
            color="#0ea5e9"
          />
          <Chart
            title="User Growth"
            data={stats?.userGrowth || []}
            type="line"
            dataKey="users"
            color="#22c55e"
          />
        </div>

        {/* Product Monitor */}
        <ProductMonitor refreshInterval={30000} />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                  <Button size="sm" variant="secondary">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table
                  data={stats?.recentOrders || []}
                  columns={recentOrdersColumns}
                  loading={loading}
                  rowKey="id"
                />
              </CardBody>
            </Card>
          </div>

          {/* Category Distribution */}
          <div>
            <Chart
              title="Product Categories"
              data={categoryData}
              type="pie"
              dataKey="value"
              height={300}
            />
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning-500" />
                <h3 className="text-lg font-medium text-gray-900">Pending Orders</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-warning-600">
                {stats?.pendingOrders || 0}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Orders waiting for processing
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-error-500" />
                <h3 className="text-lg font-medium text-gray-900">Low Stock Alert</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-error-600">
                {stats?.lowStockProducts || 0}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Products running low on stock
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
