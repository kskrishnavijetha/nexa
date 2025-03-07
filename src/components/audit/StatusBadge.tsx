
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  trend?: 'increase' | 'decrease' | 'stable';
  showTrend?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, trend, showTrend = false }) => {
  const statusStyles = {
    'pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'completed': 'bg-green-100 text-green-800 border-green-200',
    'high': 'bg-red-100 text-red-800 border-red-200',
    'medium': 'bg-amber-100 text-amber-800 border-amber-200',
    'low': 'bg-blue-100 text-blue-800 border-blue-200',
    'increase': 'bg-red-100 text-red-800 border-red-200',
    'decrease': 'bg-green-100 text-green-800 border-green-200',
    'stable': 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  const getStatusIcon = () => {
    if (!showTrend || !trend) return null;
    
    switch(trend) {
      case 'increase':
        return <TrendingUp className="h-3 w-3 ml-1" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3 ml-1" />;
      case 'stable':
        return <Minus className="h-3 w-3 ml-1" />;
      default:
        return null;
    }
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full flex items-center ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
      {getStatusIcon()}
    </span>
  );
};

export default StatusBadge;
