import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FileText,
  Tag,
  Heart,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    children: [
      { name: 'All Products', href: '/products', icon: Package },
      { name: 'Categories', href: '/products/categories', icon: Tag },
      { name: 'Purposes', href: '/products/purposes', icon: Heart },
      { name: 'Menus', href: '/menus', icon: Menu },
      { name: 'Low Stock', href: '/products/low-stock', icon: FileText },
    ],
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
    children: [
      { name: 'All Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Pending', href: '/orders?status=pending', icon: FileText },
      { name: 'Processing', href: '/orders?status=processing', icon: FileText },
      { name: 'Shipped', href: '/orders?status=shipped', icon: FileText },
      { name: 'Delivered', href: '/orders?status=delivered', icon: FileText },
    ],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [openSubNav, setOpenSubNav] = React.useState<string | null>(null); // State to manage open sub-navigation

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const hasActiveChild = (children: NavigationItem[]) => {
    return children.some(child => isActive(child.href));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-accent-50 shadow-xl border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          {
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800 hover:text-accent-700 transition-colors duration-200">
                Spiritual
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-accent-700 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-accent-50 hover:text-accent-700 transition-colors duration-200 group',
                    {
                      'bg-accent-100 text-accent-700 font-semibold border-l-4 border-accent-500': isActive(item.href) || (item.children && hasActiveChild(item.children)),
                      'text-gray-700': !isActive(item.href) && (!item.children || !hasActiveChild(item.children)),
                    }
                  )}
                  onClick={(e) => {
                    if (item.children) {
                      e.preventDefault();
                      setOpenSubNav(openSubNav === item.name ? null : item.name);
                    }
                  }}
                >
                  <item.icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.name}</span>
                  {item.children && (
                    <svg
                      className={clsx(
                        'ml-auto h-5 w-5 transform transition-transform duration-200',
                        { 'rotate-90': openSubNav === item.name }
                      )}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </Link>

                {/* Sub-navigation */}
                {item.children && (
                  <div
                    className={clsx(
                      'ml-7 mt-1.5 space-y-1.5 overflow-hidden transition-all duration-300 ease-in-out',
                      {
                        'max-h-96 opacity-100': openSubNav === item.name || (isActive(item.href) || (item.children && hasActiveChild(item.children))),
                        'max-h-0 opacity-0': !(openSubNav === item.name || (isActive(item.href) || (item.children && hasActiveChild(item.children))))
                      }
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={clsx(
                          'flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-accent-50 hover:text-accent-700 transition-colors duration-200 group',
                          {
                            'bg-accent-50 text-accent-700 font-medium': isActive(child.href),
                            'text-gray-600': !isActive(child.href),
                          }
                        )}
                      >
                        <child.icon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-accent-50 hover:text-accent-700 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="ml-2">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
