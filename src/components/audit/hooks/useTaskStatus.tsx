
import { useState, useCallback } from 'react';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface UseTaskStatusProps {
  initialStatus: TaskStatus;
  onStatusUpdate: (status: TaskStatus) => void;
}

export function useTaskStatus({ initialStatus, onStatusUpdate }: UseTaskStatusProps) {
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = useCallback((newStatus: TaskStatus) => {
    if (newStatus === status) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setStatus(newStatus);
      setIsUpdating(false);
      onStatusUpdate(newStatus);
      
      // Add a completion icon if the task is completed
      const statusIcon: ReactNode = newStatus === 'completed' ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : undefined;
      
      // Return the updated status and icon
      return {
        status: newStatus,
        icon: statusIcon
      };
    }, 500);
  }, [status, onStatusUpdate]);

  return {
    status,
    isUpdating,
    updateStatus
  };
}
