import React from 'react';
import { clsx } from 'clsx';

const getButtonClasses = (variant: string, size: string) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
    success: 'bg-success-600 text-white border border-success-600 hover:bg-success-700 focus:ring-success-500',
    warning: 'bg-warning-600 text-white border border-warning-600 hover:bg-warning-700 focus:ring-warning-500',
    error: 'bg-error-600 text-white border border-error-600 hover:bg-error-700 focus:ring-error-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
    link: 'text-primary-600 underline-offset-4 hover:underline focus:ring-primary-500',
    accent: 'bg-accent text-white border border-accent hover:bg-accent-600 focus:ring-accent-500',
    'outline-secondary': 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-primary-500',
    'ghost-accent': 'text-accent hover:bg-accent-50 focus:ring-accent-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2',
  };

  return clsx(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses],
    sizeClasses[size as keyof typeof sizeClasses]
  );
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'link' | 'accent' | 'outline-secondary' | 'ghost-accent';
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={clsx(getButtonClasses(variant, size), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
