
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ComplianceRecommendationsTabProps {
  report: ComplianceReport;
  onClose?: () => void;
  language?: string;
}

const ComplianceRecommendationsTab: React.FC<ComplianceRecommendationsTabProps> = ({ report }) => {
  // Mock recommendations data - in a real app, this would come from the API or report
  const mockRecommendations = [
    {
      id: '1',
      title: 'Implement Data Encryption',
      description: 'All sensitive data should be encrypted at rest and in transit using industry-standard encryption algorithms.',
      impact: 'High',
      effort: 'Medium',
      regulation: 'GDPR Article 32, HIPAA Security Rule',
    },
    {
      id: '2',
      title: 'Update Privacy Policy',
      description: 'Revise your privacy policy to clearly state how user data is collected, processed, and shared.',
      impact: 'Medium',
      effort: 'Low',
      regulation: 'GDPR Article 13, CCPA Section 1798.100',
    },
    {
      id: '3',
      title: 'Implement User Consent Management',
      description: 'Add mechanisms to obtain and manage user consent for data collection and processing.',
      impact: 'High',
      effort: 'Medium',
      regulation: 'GDPR Article 7',
    },
    {
      id: '4',
      title: 'Document Data Retention Policy',
      description: 'Establish clear timeframes for how long different types of data will be retained.',
      impact: 'Medium',
      effort: 'Low',
      regulation: 'GDPR Article 5, CCPA',
    }
  ];

  const getEffortBadgeClass = (effort: string) => {
    switch (effort) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-purple-100 text-purple-800';
      case 'High': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on our analysis, here are the recommended actions to improve compliance:
        </p>
      </div>

      <div className="space-y-4">
        {mockRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactBadgeClass(recommendation.impact)}`}>
                        Impact: {recommendation.impact}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getEffortBadgeClass(recommendation.effort)}`}>
                        Effort: {recommendation.effort}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {recommendation.regulation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4">
        Export Recommendations <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ComplianceRecommendationsTab;
