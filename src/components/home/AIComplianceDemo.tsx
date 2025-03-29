
import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const AIComplianceDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  const startDemo = () => {
    setDemoState('scanning');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDemoState('complete');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const resetDemo = () => {
    setDemoState('idle');
    setProgress(0);
  };
  
  const goToDocumentAnalysis = () => {
    navigate('/document-analysis');
  };
  
  return (
    <div className="my-16 bg-white p-8 rounded-xl border shadow-sm">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Shield className="h-6 w-6 text-primary mr-2" />
        AI-Powered Compliance Audit Demo
      </h2>
      
      <p className="text-muted-foreground mb-6">
        See how our AI identifies compliance gaps, missing policies, and potential risks in real-time.
      </p>
      
      <div className="bg-slate-50 p-6 rounded-lg mb-6">
        {demoState === 'idle' && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium mb-4">Ready to scan your documents for compliance issues</p>
            <Button onClick={startDemo} className="bg-primary hover:bg-primary/90">
              Start Demo Scan
            </Button>
          </div>
        )}
        
        {demoState === 'scanning' && (
          <div className="py-8">
            <p className="text-lg font-medium mb-4 text-center">Scanning Document...</p>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              AI is analyzing document structure, content, and policies against regulatory requirements
            </p>
          </div>
        )}
        
        {demoState === 'complete' && (
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <p className="text-lg font-medium">Scan Complete</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">GDPR Article 13 Requirements: Compliant</p>
                  <p className="text-sm text-muted-foreground">Privacy policy contains all required disclosures</p>
                </div>
              </div>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Data Retention Policy: Needs Attention</p>
                  <p className="text-sm text-muted-foreground">Policy lacks specific timeframes for data storage</p>
                </div>
              </div>
              
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">Cookie Consent: Missing</p>
                  <p className="text-sm text-muted-foreground">No mechanism found for obtaining cookie consent</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={resetDemo}>
                Reset Demo
              </Button>
              <Button onClick={goToDocumentAnalysis}>
                Try With Your Documents
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIComplianceDemo;
