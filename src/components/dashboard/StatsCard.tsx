import React from 'react';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'primary',
  loading = false,
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    error: 'bg-error-50 text-error-600',
    accent: 'bg-accent-50 text-accent-600',
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {changeType === 'positive' && (
                <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              )}
              {changeType === 'negative' && (
                <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span
                className={clsx('text-sm font-medium', {
                  'text-success-600': changeType === 'positive',
                  'text-error-600': changeType === 'negative',
                  'text-gray-600': changeType === 'neutral',
                })}
              >
                {change > 0 && '+'}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
