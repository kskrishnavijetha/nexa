
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface FreePlanCompletionNoticeProps {
  scansUsed: number;
  scansLimit: number;
  isExpired: boolean;
}

const FreePlanCompletionNotice: React.FC<FreePlanCompletionNoticeProps> = ({
  scansUsed,
  scansLimit,
  isExpired
}) => {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <CheckCircle className="h-5 w-5" />
          Free Plan Completed
        </CardTitle>
        <CardDescription className="text-amber-700">
          {isExpired 
            ? 'Your free plan has expired.'
            : `You've used all ${scansLimit} scans in your free plan.`
          } 
          Upgrade to continue enjoying our compliance analysis features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleUpgradeClick}
            className="flex items-center gap-2"
          >
            View Paid Plans
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreePlanCompletionNotice;
