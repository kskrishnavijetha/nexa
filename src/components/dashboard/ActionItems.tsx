
import React, { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  severity: string;
  dueDate: string;
  completed?: boolean;
  resolutionSteps?: string[];
  currentStep?: number;
}

const ActionItems = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
                
                // Add resolution steps
                const resolutionSteps = [
                  `Review ${risk.title} documentation`,
                  `Update compliance policy`,
                  `Implement technical controls`,
                  `Document changes and verify compliance`
                ];
                
                items.push({
                  id: `${report.documentId}-${risk.id || index}`,
                  title: risk.title,
                  description: risk.mitigation || risk.description,
                  severity: risk.severity,
                  dueDate: dueDate.toISOString().split('T')[0],
                  completed: false,
                  resolutionSteps: resolutionSteps,
                  currentStep: 0
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
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      generateActionItems();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const handleResolve = (id: string) => {
    setActionItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const nextStep = (item.currentStep || 0) + 1;
          const totalSteps = item.resolutionSteps?.length || 0;
          
          // If all steps complete, mark as completed
          if (nextStep >= totalSteps) {
            toast.success("All steps completed! Action item resolved.");
            return { ...item, completed: true };
          }
          
          // Otherwise advance to next step
          toast.success(`Step ${nextStep} of ${totalSteps} completed!`);
          return { ...item, currentStep: nextStep };
        }
        return item;
      })
    );
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
  
  const handleViewAll = () => {
    navigate('/history?tab=audit'); // Navigate to audit tab in history page
    toast.info("Viewing all action items");
  };

  return (
    <div className="space-y-4">
      {actionItems.length > 0 ? (
        actionItems.map((item) => (
          <div 
            key={item.id} 
            className={`border rounded-md p-4 hover:bg-slate-50 ${item.completed ? 'bg-gray-50' : ''}`}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">{getSeverityIcon(item.severity)}</div>
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                
                {/* Resolution Progress Section */}
                {!item.completed && item.resolutionSteps && (
                  <div className="bg-slate-50 p-2 rounded-md mb-2">
                    <p className="text-xs font-medium mb-1">Resolution progress:</p>
                    <div className="space-y-1">
                      {item.resolutionSteps.map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`h-4 w-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                            index < (item.currentStep || 0) 
                              ? 'bg-green-500 text-white' 
                              : index === (item.currentStep || 0) 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200'
                          }`}>
                            {index < (item.currentStep || 0) && <Check className="h-3 w-3" />}
                          </div>
                          <span className={`text-xs ${
                            index < (item.currentStep || 0) 
                              ? 'text-green-700 line-through' 
                              : index === (item.currentStep || 0) 
                                ? 'text-blue-700 font-medium' 
                                : 'text-gray-600'
                          }`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Item Footer */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    Due: {new Date(item.dueDate).toLocaleDateString()}
                  </span>
                  
                  {item.completed ? (
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <Check className="h-3 w-3 mr-1" /> Resolved
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs h-7 px-2"
                      onClick={() => handleResolve(item.id)}
                    >
                      {item.currentStep === 0 ? 'Start Resolution' : 
                       item.currentStep === (item.resolutionSteps?.length || 0) - 1 ? 'Complete' : 
                       `Complete Step ${(item.currentStep || 0) + 1}`}
                    </Button>
                  )}
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
      
      {actionItems.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center"
          onClick={handleViewAll}
        >
          <span>View All Action Items</span>
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default ActionItems;
