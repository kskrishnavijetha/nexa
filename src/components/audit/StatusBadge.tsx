
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    'pending': 'bg-amber-100 text-amber-800 border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'completed': 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
