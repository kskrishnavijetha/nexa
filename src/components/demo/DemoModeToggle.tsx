
import React from 'react';
import { TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isDemoMode, enableDemoMode, disableDemoMode } from '@/utils/demoMode';
import { toast } from 'sonner';

const DemoModeToggle: React.FC = () => {
  const [demoActive, setDemoActive] = React.useState(isDemoMode());

  const toggleDemoMode = () => {
    if (demoActive) {
      disableDemoMode();
      setDemoActive(false);
      toast.success('Demo mode disabled');
    } else {
      enableDemoMode();
      setDemoActive(true);
      toast.success('Demo mode enabled - 3 free scans available!');
    }
  };

  return (
    <Button
      variant={demoActive ? "default" : "outline"}
      size="sm"
      onClick={toggleDemoMode}
      className="flex items-center space-x-2"
    >
      <TestTube className="h-4 w-4" />
      <span>{demoActive ? 'Exit Demo' : 'Try Demo'}</span>
    </Button>
  );
};

export default DemoModeToggle;
