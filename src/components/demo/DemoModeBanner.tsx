
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isDemoMode, disableDemoMode, getDemoConfig, resetDemoMode } from '@/utils/demoMode';

interface DemoModeBannerProps {
  onDemoEnd?: () => void;
}

const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onDemoEnd }) => {
  const [showBanner, setShowBanner] = React.useState(isDemoMode());
  const [config, setConfig] = React.useState(getDemoConfig());

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isDemoMode()) {
        setConfig(getDemoConfig());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseBanner = () => {
    disableDemoMode();
    setShowBanner(false);
    onDemoEnd?.();
  };

  const handleResetDemo = () => {
    resetDemoMode();
    setConfig(getDemoConfig());
  };

  if (!showBanner) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-orange-800 font-medium">
            Demo Mode Active
          </span>
          <span className="text-orange-700">
            {config.scansRemaining} of {config.maxScans} scans remaining
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetDemo}
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            Reset Demo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseBanner}
            className="text-orange-600 hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DemoModeBanner;
