
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Info, Loader } from 'lucide-react';
import { useJiraDemoMode } from '@/hooks/useJiraDemoMode';

interface JiraDemoModeProps {
  onDemoEnabled: () => void;
}

const JiraDemoMode = ({ onDemoEnabled }: JiraDemoModeProps) => {
  const { isLoading, enableDemoMode } = useJiraDemoMode();

  const handleEnableDemo = async () => {
    const success = await enableDemoMode();
    if (success) {
      onDemoEnabled();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <Play className="h-5 w-5 text-blue-600" />
          Try Jira Demo
        </CardTitle>
        <CardDescription>
          Explore Jira integration features with sample data
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <div className="space-y-2">
              <div>
                <strong>Demo Mode includes:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                  <li>Sample projects and issues</li>
                  <li>Mock compliance reports</li>
                  <li>Simulated dashboard metrics</li>
                  <li>Interactive Jira features</li>
                </ul>
              </div>
              <div className="text-xs text-muted-foreground">
                No real Jira connection required - perfect for testing!
              </div>
            </div>
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={handleEnableDemo}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Setting up demo...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Demo
            </>
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Demo mode uses simulated data and doesn't connect to real Jira workspaces
        </p>
      </CardContent>
    </Card>
  );
};

export default JiraDemoMode;
