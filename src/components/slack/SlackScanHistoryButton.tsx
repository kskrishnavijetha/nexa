
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SlackScanHistoryButtonProps {
  hasScanned: boolean;
}

const SlackScanHistoryButton: React.FC<SlackScanHistoryButtonProps> = ({ hasScanned }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate('/history')}
      disabled={!hasScanned}
      className="flex items-center gap-2"
    >
      <History className="h-4 w-4" />
      View History
    </Button>
  );
};

export default SlackScanHistoryButton;
