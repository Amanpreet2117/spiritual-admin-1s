import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { AuthService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  initialize: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.login({ email, password });
          if (response.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false
            });
            return { success: true, message: response.message };
          } else {
            set({ isLoading: false });
            return { success: false, message: response.message };
          }
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      initialize: () => {
        // Check if we have persisted data first
        const persistedState = get();
        
        // If we have persisted user data, use it
        if (persistedState.user && persistedState.isAuthenticated) {
          // Verify the token is still valid
          const token = AuthService.getToken();
          if (token) {
            set({
              user: persistedState.user,
              isAuthenticated: true,
              isLoading: false
            });
            return;
          }
        }
        
        // Fallback to checking cookies
        const token = AuthService.getToken();
        const user = AuthService.getCurrentUser();
        const isAuthenticated = !!token && !!user;
        
        set({
          user,
          isAuthenticated,
          isLoading: false
        });
      },

      updateUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // When rehydrating, ensure we have valid authentication
          const token = AuthService.getToken();
          if (!token && state.isAuthenticated) {
            // Token is missing but state says authenticated, clear it
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
