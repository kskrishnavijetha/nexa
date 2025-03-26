
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { ServiceCardProps } from './types';
import ServiceCardHeader from './ServiceCardHeader';
import RealTimeMonitor from './RealTimeMonitor';
import ServiceCardActions from './ServiceCardActions';
import AuthDialog from './AuthDialog';
import AnalysisDialog from './AnalysisDialog';

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

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <ServiceCardHeader
          icon={icon}
          title={title}
          isConnected={isConnected}
          isRealTimeActive={isRealTimeActive}
          toggleRealTime={toggleRealTime}
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        
        <RealTimeMonitor
          isRealTimeActive={isRealTimeActive && isConnected}
          lastUpdated={lastUpdated}
        />
        
        <ServiceCardActions
          isConnected={isConnected}
          isConnecting={isConnecting}
          isScanning={isScanning}
          onConnect={handleConnect}
          onShowAnalysisDialog={() => setShowAnalysisDialog(true)}
        />

        {/* Authentication Dialog */}
        <AuthDialog
          title={title}
          showDialog={showAuthDialog}
          setShowDialog={setShowAuthDialog}
          onAuth={handleAuth}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        {/* Analysis Dialog */}
        <AnalysisDialog
          serviceId={serviceId}
          showDialog={showAnalysisDialog}
          setShowDialog={setShowAnalysisDialog}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onAnalyze={handleAnalyze}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
