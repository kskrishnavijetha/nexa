
import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  severity: string;
  dueDate: string;
  completed?: boolean;
}

const ActionItems = () => {
  const { user } = useAuth();
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  
  useEffect(() => {
    const generateActionItems = () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        
        if (userReports.length > 0) {
          // Generate action items from report risks
          const items: ActionItem[] = [];
          
          userReports.forEach(report => {
            // Take higher severity risks and convert them to action items
            report.risks.forEach((risk, index) => {
              if (risk.severity === 'high' || (risk.severity === 'medium' && index % 3 === 0)) {
                // Generate due dates between now and 30 days from now
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);
                
                items.push({
                  id: `${report.documentId}-${risk.id || index}`,
                  title: risk.title,
                  description: risk.mitigation || risk.description,
                  severity: risk.severity,
                  dueDate: dueDate.toISOString().split('T')[0],
                  completed: false
                });
              }
            });
          });
          
          // Take most recent items (max 4)
          if (items.length > 0) {
            setActionItems(items.slice(0, 4));
          }
        }
      }
    };
    
    generateActionItems();
  }, [user]);

  const handleResolve = (id: string) => {
    setActionItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, completed: true } : item
      )
    );
    toast.success("Action item marked as resolved");
  };

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

  return (
    <div className="space-y-4">
      {actionItems.length > 0 ? (
        actionItems.map((item) => (
          <div 
            key={item.id} 
            className={`border rounded-md p-3 hover:bg-slate-50 ${item.completed ? 'opacity-60' : ''}`}
          >
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
                    variant={item.completed ? "secondary" : "outline"}
                    onClick={() => handleResolve(item.id)}
                    disabled={item.completed}
                  >
                    {item.completed ? "Resolved" : "Resolve"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No action items available.</p>
          <p className="text-xs mt-1">Perform document scans to generate action items.</p>
        </div>
      )}
    </div>
  );
};

export default ActionItems;
