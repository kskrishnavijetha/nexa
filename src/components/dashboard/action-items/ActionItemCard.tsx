
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionItem } from './types';

interface ActionItemCardProps {
  item: ActionItem;
  onResolve: (id: string) => void;
}

const ActionItemCard: React.FC<ActionItemCardProps> = ({ item, onResolve }) => {
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
    <div 
      className={`border rounded-md p-4 hover:bg-slate-50 ${item.completed ? 'bg-gray-50' : ''}`}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">{getSeverityIcon(item.severity)}</div>
        <div className="flex-1">
          <h4 className="font-medium">{item.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
          
          {/* Resolution Progress Section */}
          {item.resolutionSteps && (
            <div className={`bg-slate-50 p-2 rounded-md mb-2 ${item.currentStep === undefined ? 'hidden' : ''}`}>
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
                onClick={() => onResolve(item.id)}
              >
                {item.currentStep === undefined ? 'Start Resolution' : 
                 item.currentStep === (item.resolutionSteps?.length || 0) - 1 ? 'Complete' : 
                 `Complete Step ${(item.currentStep || 0) + 1}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItemCard;
