'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, isAdmin, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Authentication Status</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Loading:</span>
                  <span className={`font-semibold ${isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Authenticated:</span>
                  <span className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {isAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span className={`font-semibold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {isAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Super Admin:</span>
                  <span className={`font-semibold ${isSuperAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuperAdmin ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">User Information</h2>
            </CardHeader>
            <CardBody>
              {user ? (
                <div className="space-y-2">
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Username:</strong> {user.username}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Role:</strong> {user.role?.name || 'No role'}</div>
                  <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              ) : (
                <div className="text-gray-500">No user data available</div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Debug Information</h2>
          </CardHeader>
          <CardBody>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                isAuthenticated,
                isLoading,
                user: user ? {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  role: user.role?.name
                } : null
              }, null, 2)}
            </pre>
          </CardBody>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page to Test
          </button>
        </div>
      </div>
    </div>
  );
}
