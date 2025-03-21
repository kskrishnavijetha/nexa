
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effortToImplement: 'high' | 'medium' | 'low';
}

interface RecommendedActionsProps {
  recommendations: Recommendation[];
}

const RecommendedActions: React.FC<RecommendedActionsProps> = ({ recommendations }) => {
  const [implementedActions, setImplementedActions] = React.useState<Set<number>>(new Set());

  const handleImplementAction = (index: number) => {
    const newImplemented = new Set(implementedActions);
    
    if (newImplemented.has(index)) {
      newImplemented.delete(index);
      toast.info('Action marked as not implemented');
    } else {
      newImplemented.add(index);
      toast.success('Action marked as implemented');
    }
    
    setImplementedActions(newImplemented);
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">High Impact</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Medium Impact</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-800 rounded">Low Impact</span>;
    }
  };
  
  const getEffortBadge = (effort: 'high' | 'medium' | 'low') => {
    switch (effort) {
      case 'high':
        return <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">High Effort</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded">Medium Effort</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Low Effort</span>;
    }
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        AI-recommended actions to improve compliance based on predicted risks and historical trends.
      </p>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recommended actions available at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className={`border rounded-md p-4 ${
                implementedActions.has(index) ? 'bg-green-50 border-green-100' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">{recommendation.title}</h4>
                  <p className="text-sm mt-1 text-slate-600">{recommendation.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getImpactBadge(recommendation.impact)}
                    {getEffortBadge(recommendation.effortToImplement)}
                  </div>
                </div>
                
                <Button 
                  variant={implementedActions.has(index) ? "default" : "outline"}
                  size="sm" 
                  className="ml-4 flex-shrink-0"
                  onClick={() => handleImplementAction(index)}
                >
                  {implementedActions.has(index) ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Implemented
                    </>
                  ) : 'Implement'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedActions;
