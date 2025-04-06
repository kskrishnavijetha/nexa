
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ActionItems = () => {
  // Mock data for action items
  const actionItems = [
    {
      id: 1,
      title: 'Update Privacy Policy',
      description: 'Add GDPR compliance statements to your privacy policy',
      severity: 'high',
      dueDate: '2025-04-15'
    },
    {
      id: 2,
      title: 'Data Retention Review',
      description: 'Review data retention policies for customer data',
      severity: 'medium',
      dueDate: '2025-04-20'
    },
    {
      id: 3,
      title: 'Update Consent Forms',
      description: 'Add explicit consent checkboxes to all forms',
      severity: 'medium',
      dueDate: '2025-04-28'
    },
    {
      id: 4,
      title: 'Security Assessment',
      description: 'Complete quarterly security assessment for cloud storage',
      severity: 'low',
      dueDate: '2025-05-10'
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleResolve = (id: number, title: string) => {
    toast.success(`${title} marked as resolved`);
    // In a real app, we would update the action item status in the database
  };

  return (
    <div className="space-y-4">
      {actionItems.map((item) => (
        <div key={item.id} className="border rounded-md p-3 hover:bg-slate-50">
          <div className="flex items-start">
            <div className="mr-3 mt-1">{getSeverityIcon(item.severity)}</div>
            <div className="flex-1">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleResolve(item.id, item.title)}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionItems;
