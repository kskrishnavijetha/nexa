
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SlackScanHistoryButtonProps {
  hasScanned: boolean;
}

const SlackScanHistoryButton: React.FC<SlackScanHistoryButtonProps> = ({ hasScanned }) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate('/history');
    toast.info('Viewing scan history', {
      description: 'Switch to the Audit Trail tab to see detailed logs'
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleViewHistory}
      disabled={!hasScanned}
      className="gap-1"
    >
      <History className="h-4 w-4" />
      <span>View History & Audit Logs</span>
    </Button>
  );
};

export default SlackScanHistoryButton;
