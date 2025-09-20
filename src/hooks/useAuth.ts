import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthService } from '@/services/authService';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, initialize, updateUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const loginUser = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    }
    return result;
  };

  const logoutUser = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = () => {
    return AuthService.isAdmin();
  };

  const isSuperAdmin = () => {
    return AuthService.isSuperAdmin();
  };

  const hasPermission = (permission: string) => {
    // Add permission checking logic here based on your role system
    if (!user?.role) return false;
    
    // Super admin has all permissions
    if (user.role.name === 'superadmin') return true;
    
    // Admin has most permissions
    if (user.role.name === 'admin') {
      const restrictedPermissions = ['manage_superadmin', 'system_settings'];
      return !restrictedPermissions.includes(permission);
    }
    
    // Regular users have limited permissions
    const userPermissions = ['view_own_data', 'edit_own_data'];
    return userPermissions.includes(permission);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginUser,
    logout: logoutUser,
    updateUser,
    initialize,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    hasPermission
  };
};

export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading, initialize } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state on mount
    const initAuth = async () => {
      await initialize();
      setIsInitialized(true);
    };
    initAuth();
  }, [initialize]);

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated and initialization is complete
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, isInitialized, router, redirectTo]);

  return { isAuthenticated, isLoading: isLoading || !isInitialized };
};

export const useRequireAdmin = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, isSuperAdmin, router]);

  return { isAdmin, isSuperAdmin };
};
