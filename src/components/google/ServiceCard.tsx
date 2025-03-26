
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Search, Shield } from 'lucide-react';
import { GoogleService } from './types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ServiceCardProps {
  serviceId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceId,
  icon,
  title,
  description,
  isConnected,
  isConnecting,
  isScanning,
  onConnect,
  onDisconnect,
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState<boolean>(false);
  const [realtimeTimer, setRealtimeTimer] = useState<number | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  // Real-time updates simulation
  useEffect(() => {
    if (isConnected && isRealTimeActive) {
      // Set up interval for real-time updates
      const interval = window.setInterval(() => {
        setLastUpdated(new Date());
      }, 10000); // Update every 10 seconds
      
      setRealtimeTimer(interval);
      
      return () => {
        if (realtimeTimer !== null) {
          window.clearInterval(realtimeTimer);
        }
      };
    } else if (!isRealTimeActive && realtimeTimer !== null) {
      window.clearInterval(realtimeTimer);
      setRealtimeTimer(null);
    }
  }, [isConnected, isRealTimeActive, realtimeTimer]);

  // Auto-activate real-time mode when connected
  useEffect(() => {
    if (isConnected) {
      setIsRealTimeActive(true);
    } else {
      setIsRealTimeActive(false);
    }
  }, [isConnected]);

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const handleConnect = () => {
    if (!isConnected) {
      setShowAuthDialog(true);
    } else {
      onDisconnect();
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuthDialog(false);
    // Simulate authentication
    onConnect();
    // Clear credentials after use
    setEmail('');
    setPassword('');
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      
      if (serviceId.includes('gmail')) {
        // Show email analysis results
        setAnalysisResult(`
          Compliance Analysis Results:
          - PII Detection: Found 2 potential instances of PII data
          - GDPR Compliance: 87% (Caution: Email mentions user location data)
          - HIPAA Compliance: 75% (Warning: Contains potential health information)
          - Sensitive Data: Medium Risk (Email contains financial transaction details)
          
          Recommendation: Review email content before sending. Consider removing personal health information.
        `);
      } else if (serviceId.includes('docs')) {
        // Show document analysis results
        setAnalysisResult(`
          Document Compliance Scan:
          - PII Detection: Found 3 instances of personal identifiable information
          - Data Retention Policies: Document exceeds recommended storage duration
          - CCPA Compliance: 81% (Needs explicit consent statement)
          - SOC2 Compliance: 90% (Good)
          
          Recommendation: Add explicit data usage consent statement. Review and redact unnecessary PII.
        `);
      } else if (serviceId.includes('drive')) {
        // Show storage analysis results
        setAnalysisResult(`
          Storage Compliance Analysis:
          - Sensitive Files: Found 5 documents with potential confidential information
          - Access Controls: 3 documents have overly permissive sharing settings
          - Data Retention: 2 files exceed retention policy timeframes
          - Cross-border Data Transfer: 4 files may be subject to international data regulations
          
          Recommendation: Review sharing settings on flagged files. Update retention policies.
        `);
      }
      
      toast.success('Analysis completed successfully');
    }, 2500);
  };

  const getAnalysisDialogTitle = () => {
    if (serviceId.includes('gmail')) {
      return 'Analyze Gmail Content';
    } else if (serviceId.includes('docs')) {
      return 'Analyze Google Docs';
    } else if (serviceId.includes('drive')) {
      return 'Analyze Drive Files';
    }
    return 'Analyze Content';
  };

  const getAnalysisDialogDescription = () => {
    if (serviceId.includes('gmail')) {
      return 'Search and analyze emails for compliance violations and sensitive information.';
    } else if (serviceId.includes('docs')) {
      return 'Check your documents for regulatory compliance issues and PII.';
    } else if (serviceId.includes('drive')) {
      return 'Scan your Drive files for compliance issues and security vulnerabilities.';
    }
    return 'Analyze your content for compliance.';
  };

  const getPlaceholderText = () => {
    if (serviceId.includes('gmail')) {
      return 'Search by sender, subject, or content...';
    } else if (serviceId.includes('docs')) {
      return 'Search documents by title or content...';
    } else if (serviceId.includes('drive')) {
      return 'Search files by name or content...';
    }
    return 'Search...';
  };

  const getContentSamplePlaceholder = () => {
    if (serviceId.includes('gmail')) {
      return 'Or paste email content to analyze...';
    } else if (serviceId.includes('docs')) {
      return 'Or paste document content to analyze...';
    } else if (serviceId.includes('drive')) {
      return 'Describe file contents to analyze...';
    }
    return 'Enter content to analyze...';
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center">
            {icon}
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <div 
                className="cursor-pointer" 
                onClick={toggleRealTime}
                title={isRealTimeActive ? "Real-time monitoring active" : "Activate real-time monitoring"}
              >
                <RefreshCw className={`h-4 w-4 ${isRealTimeActive ? "text-green-500 animate-spin-slow" : "text-gray-400"}`} />
              </div>
            )}
            <Badge variant={isConnected ? "default" : "outline"} className={isConnected ? "bg-green-500" : ""}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        {isConnected && isRealTimeActive && (
          <div className="mb-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Real-time monitoring active
            </div>
            <div className="mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Button 
            variant={isConnected ? "outline" : "default"} 
            className="w-full"
            onClick={handleConnect}
            disabled={isConnecting || isScanning}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              'Disconnect'
            ) : (
              'Connect'
            )}
          </Button>
          
          {isConnected && (
            <Button 
              variant="outline" 
              className="w-full flex items-center" 
              onClick={() => setShowAnalysisDialog(true)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Analyze Compliance
            </Button>
          )}
        </div>

        {/* Authentication Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect to {title}</DialogTitle>
              <DialogDescription>
                Enter your Google account credentials to connect to {title}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@gmail.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAuthDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Connect
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Analysis Dialog */}
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{getAnalysisDialogTitle()}</DialogTitle>
              <DialogDescription>
                {getAnalysisDialogDescription()}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchQuery">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="searchQuery" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder={getPlaceholderText()}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contentSample">Content Sample</Label>
                <Textarea 
                  id="contentSample" 
                  value={selectedContent} 
                  onChange={(e) => setSelectedContent(e.target.value)} 
                  placeholder={getContentSamplePlaceholder()}
                  rows={6} 
                />
              </div>
              
              {analysisResult && (
                <div className="p-4 bg-slate-50 border rounded-md text-sm whitespace-pre-line">
                  <div className="font-semibold mb-2">Analysis Results:</div>
                  {analysisResult}
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAnalysisDialog(false)}>
                  Close
                </Button>
                <Button type="submit" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Run Analysis'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
