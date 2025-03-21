
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PredictiveInsightsWidget: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock insights for the dashboard widget
  const insights = [
    {
      title: "GDPR compliance trending downward",
      description: "Your organization's GDPR compliance score has decreased by 8% over the last three scans.",
      priority: "high"
    },
    {
      title: "Data retention policies need review",
      description: "AI analysis indicates 60% likelihood of data retention issues in future audits.",
      priority: "medium"
    },
    {
      title: "Improved SOC 2 compliance detected",
      description: "Your SOC 2 compliance measures have improved by 12% since last quarter.",
      priority: "low"
    }
  ];
  
  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>;
      case 'medium':
        return <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>;
      case 'low':
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>;
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          AI Predictive Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-start">
                {getPriorityIndicator(insight.priority)}
                <div>
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => navigate('/history')}
            >
              <span>View Complete Risk Trends</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsightsWidget;
