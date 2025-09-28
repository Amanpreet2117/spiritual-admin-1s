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
import { Order, OrderFilters } from '@/types';
import { OrderService } from '@/services/orderService';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Calendar,
  User,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Image from 'next/image';

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockOrders: Order[] = [
        {
          id: 1,
          userId: 1,
          orderNumber: 'ORD-001',
          status: 'pending',
          totalAmount: 299.99,
          shippingAmount: 10.00,
          taxAmount: 30.00,
          discountAmount: 0,
          paymentStatus: 'pending',
          paymentMethod: 'Credit Card',
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main St',
            address2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US',
            phone: '+1-555-0123',
          },
          billingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address1: '123 Main St',
            address2: 'Apt 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US',
            phone: '+1-555-0123',
          },
          notes: 'Please deliver during business hours',
          user: {
            id: 1,
            username: 'johndoe',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-0123',
            isActive: true,
            roleId: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
          },
          items: [
            {
              id: 1,
              orderId: 1,
              productId: 1,
              quantity: 1,
              unitPrice: 299.99,
              totalPrice: 299.99,
              product: {
                id: 1,
                categoryId: 1,
                name: 'Sacred Rudraksha Mala',
                slug: 'sacred-rudraksha-mala',
                basePrice: 299.99,
                thumbnailImage: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Rudraksha',
                status: 'active',
                isFeatured: true,
                isDigital: false,
                requiresShipping: true,
                stock: 50,
                lowStockThreshold: 5,
                weight: 0.2,
                dimensions: '45 x 2 x 2 cm',
                taxClass: 'Standard',
                metaTitle: '',
                metaDescription: '',
                tags: [],
                barcode: '',
                costPrice: 150,
                salePrice: 0,
                isOnSale: false,
                saleStartDate: '',
                saleEndDate: '',
                minQuantity: 1,
                maxQuantity: 0,
                allowBackorder: false,
                trackQuantity: true,
                soldQuantity: 25,
                viewCount: 150,
                averageRating: 4.8,
                reviewCount: 12,
                isNew: false,
                isBestSeller: true,
                isTrending: true,
                customFields: {},
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-15T10:30:00Z',
              },
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-15T10:30:00Z',
            },
          ],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          userId: 2,
          orderNumber: 'ORD-002',
          status: 'processing',
          totalAmount: 149.99,
          shippingAmount: 10.00,
          taxAmount: 15.00,
          discountAmount: 0,
          paymentStatus: 'paid',
          paymentMethod: 'PayPal',
          shippingAddress: {
            firstName: 'Jane',
            lastName: 'Smith',
            address1: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90210',
            country: 'US',
            phone: '+1-555-0456',
          },
          billingAddress: {
            firstName: 'Jane',
            lastName: 'Smith',
            address1: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90210',
            country: 'US',
            phone: '+1-555-0456',
          },
          user: {
            id: 2,
            username: 'janesmith',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+1-555-0456',
            isActive: true,
            roleId: 1,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-14T14:20:00Z',
          },
          items: [],
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusChange = async (orderId: number, status: Order['status']) => {
    try {
      // In real implementation, call OrderService.updateOrderStatus(orderId, status)
      console.log('Updating order status:', orderId, status);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (orderId: number, paymentStatus: Order['paymentStatus']) => {
    try {
      // In real implementation, call OrderService.updatePaymentStatus(orderId, paymentStatus)
      console.log('Updating payment status:', orderId, paymentStatus);
      toast.success('Payment status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'refunded':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const columns = [
    {
      key: 'orderNumber',
      title: 'Order #',
      render: (_: any, record: Order) => (
        <div>
          <div className="font-medium text-gray-900">{record.orderNumber}</div>
          <div className="text-sm text-gray-500">
            {new Date(record.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (_: any, record: Order) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.user?.firstName} {record.user?.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'items',
      title: 'Items',
      render: (_: any, record: Order) => (
        <div>
          <div className="font-medium">{record.items?.length || 0} items</div>
          <div className="text-sm text-gray-500">
            {record.items?.reduce((total, item) => total + item.quantity, 0) || 0} units
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: Order) => (
        <div className="space-y-1">
          <Badge variant={getStatusColor(record.status) as any}>
            {getStatusIcon(record.status)}
            <span className="ml-1">{record.status}</span>
          </Badge>
          <Badge variant={getPaymentStatusColor(record.paymentStatus) as any}>
            {record.paymentStatus}
          </Badge>
        </div>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      render: (_: any, record: Order) => (
        <div>
          <div className="font-medium">${Number(record.totalAmount || 0).toFixed(2)}</div>
          <div className="text-sm text-gray-500">
            {record.paymentMethod}
          </div>
        </div>
      ),
    },
    {
      key: 'shipping',
      title: 'Shipping',
      render: (_: any, record: Order) => (
        <div>
          <div className="text-sm text-gray-900">
            {record.shippingAddress.city}, {record.shippingAddress.state}
          </div>
          <div className="text-sm text-gray-500">
            {record.shippingAddress.postalCode}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Order) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedOrder(record);
              setShowOrderModal(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const newStatus = record.status === 'pending' ? 'processing' : 
                              record.status === 'processing' ? 'shipped' :
                              record.status === 'shipped' ? 'delivered' : 'pending';
              handleStatusChange(record.id, newStatus);
            }}
          >
            <Edit className="h-4 w-4" />
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
    <Layout title="Orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer orders and fulfillment
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-warning-100 rounded-lg">
                  <Clock className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
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
                    {orders.filter(o => o.status === 'processing').length}
                  </div>
                  <div className="text-sm text-gray-500">Processing</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Truck className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'shipped').length}
                  </div>
                  <div className="text-sm text-gray-500">Shipped</div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <div className="flex items-center">
                <div className="p-2 bg-success-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-gray-500">Delivered</div>
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
                    placeholder="Search orders..."
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
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">All Orders</h3>
              <div className="text-sm text-gray-500">
                {orders.length} orders
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              data={orders}
              columns={columns}
              loading={loading}
              rowKey="id"
              emptyText="No orders found"
            />
          </CardBody>
        </Card>

        {/* Order Detail Modal */}
        <Modal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          title={`Order ${selectedOrder?.orderNumber}`}
          size="lg"
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-500">Order #:</span> {selectedOrder.orderNumber}</div>
                    <div><span className="text-gray-500">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                    <div><span className="text-gray-500">Status:</span> 
                      <Badge variant={getStatusColor(selectedOrder.status) as any} className="ml-2">
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div><span className="text-gray-500">Payment:</span> 
                      <Badge variant={getPaymentStatusColor(selectedOrder.paymentStatus) as any} className="ml-2">
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-500">Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</div>
                    <div><span className="text-gray-500">Email:</span> {selectedOrder.user?.email}</div>
                    <div><span className="text-gray-500">Phone:</span> {selectedOrder.shippingAddress.phone}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Image
                        src={item.product?.thumbnailImage || 'https://via.placeholder.com/60x60'}
                        alt={item.product?.name || 'Product image'}
                        width={60}
                        height={60}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-gray-500">SKU: {item.product?.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${Number(item.unitPrice || 0).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">${Number(item.totalPrice || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${Number((selectedOrder.totalAmount || 0) - (selectedOrder.shippingAmount || 0) - (selectedOrder.taxAmount || 0) + (selectedOrder.discountAmount || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${Number(selectedOrder.shippingAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${Number(selectedOrder.taxAmount || 0).toFixed(2)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${Number(selectedOrder.discountAmount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total:</span>
                    <span>${Number(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <ModalFooter>
                <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                  Close
                </Button>
                <Button>
                  Update Order
                </Button>
              </ModalFooter>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
