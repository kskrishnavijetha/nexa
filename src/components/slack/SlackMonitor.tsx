
import React, { useState } from 'react';
import SlackConnect from './SlackConnect';
import SlackScanOptions from './SlackScanOptions';
import SlackViolationsList from './SlackViolationsList';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { SlackScanOptions as SlackScanOptionsType, SlackScanResults } from '@/utils/slack/types';
import { isSlackConnected, scanSlackMessages } from '@/utils/slack/slackService';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const SlackMonitor: React.FC = () => {
  const [scanOptions, setScanOptions] = useState<SlackScanOptionsType>({
    channels: [],
    timeRange: 'day',
    language: 'en',
    sensitivityLevel: 'standard'
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<SlackScanResults | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  
  const handleScan = async () => {
    if (!isSlackConnected()) {
      toast.error('Please connect to Slack first');
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    
    try {
      const results = await scanSlackMessages(scanOptions);
      setScanResults(results);
      setHasScanned(true);
      
      if (results.violations.length > 0) {
        toast.warning(`Found ${results.violations.length} compliance violations`);
      } else {
        toast.success('No compliance violations detected');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to scan Slack messages');
    } finally {
      setIsScanning(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Slack Compliance Monitor</h2>
        <p className="text-muted-foreground mb-4">
          Monitor your Slack workspace for potential compliance violations in messages and file uploads.
        </p>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Real-time Monitoring (Demo Mode)</AlertTitle>
          <AlertDescription>
            This demonstration uses simulated data. In a production environment, this would connect to a real Slack workspace through the Slack API.
          </AlertDescription>
        </Alert>
      </div>
      
      <SlackConnect />
      
      <Separator className="my-6" />
      
      <SlackScanOptions 
        options={scanOptions} 
        onOptionsChange={setScanOptions} 
        disabled={isScanning}
      />
      
      <div className="flex justify-center mt-4 mb-8">
        <Button 
          onClick={handleScan} 
          disabled={isScanning || !isSlackConnected()}
          className="w-full max-w-xs"
          size="lg"
        >
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning Slack Messages...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Slack for Violations
            </>
          )}
        </Button>
      </div>
      
      {isScanning || hasScanned ? (
        <SlackViolationsList 
          violations={scanResults?.violations || []} 
          isLoading={isScanning}
        />
      ) : null}
    </div>
  );
};

export default SlackMonitor;
