
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Risk, ComplianceReport } from '@/utils/types';
import { Loader2 } from 'lucide-react';

interface RealtimeAnalysisSimulatorProps {
  report: ComplianceReport;
}

const RealtimeAnalysisSimulator: React.FC<RealtimeAnalysisSimulatorProps> = ({ report }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [detectedRisks, setDetectedRisks] = useState<Risk[]>([]);
  const [currentStage, setCurrentStage] = useState('Starting analysis...');

  // Simulate analysis progress
  useEffect(() => {
    const startAnalysis = () => {
      setIsAnalyzing(true);
      setProgress(0);
      setDetectedRisks([]);
      
      const totalDuration = 8000; // 8 seconds for the full analysis
      const intervalStep = 50; // Update every 50ms
      const progressPerStep = (intervalStep / totalDuration) * 100;
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += progressPerStep;
        
        // Update progress state
        setProgress(Math.min(Math.round(currentProgress), 100));
        
        // Update stage text based on progress
        if (currentProgress < 20) {
          setCurrentStage('Scanning document structure...');
        } else if (currentProgress < 40) {
          setCurrentStage('Analyzing regulatory references...');
        } else if (currentProgress < 60) {
          setCurrentStage('Detecting compliance gaps...');
          // Add first risk at ~50%
          if (currentProgress >= 50 && detectedRisks.length === 0) {
            const risk: Risk = {
              id: 'risk-1',
              title: 'Missing Data Retention Policy',
              description: 'Document does not specify data retention timeframes',
              severity: 'medium',
              regulation: 'GDPR',
              mitigation: 'Define clear data retention periods in your policy'
            };
            setDetectedRisks([risk]);
          }
        } else if (currentProgress < 80) {
          setCurrentStage('Evaluating security controls...');
          // Add second risk at ~70%
          if (currentProgress >= 70 && detectedRisks.length === 1) {
            const risk: Risk = {
              id: 'risk-2',
              title: 'Weak Access Control Description',
              description: 'Access control measures lack specificity',
              severity: 'high',
              regulation: report.regulations?.[0] || 'GDPR',
              mitigation: 'Define role-based access controls and implementation details'
            };
            setDetectedRisks(prev => [...prev, risk]);
          }
        } else {
          setCurrentStage('Finalizing analysis...');
          // Add third risk at ~90%
          if (currentProgress >= 90 && detectedRisks.length === 2) {
            const risk: Risk = {
              id: 'risk-3',
              title: 'Incomplete Breach Notification Process',
              description: 'Incident response plan lacks clear breach notification timelines',
              severity: 'high',
              regulation: 'GDPR',
              mitigation: 'Specify notification timelines and processes in your documentation'
            };
            setDetectedRisks(prev => [...prev, risk]);
          }
        }
        
        // Complete the analysis
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          setCurrentStage('Analysis complete');
          setProgress(100);
          setIsAnalyzing(false);
        }
      }, intervalStep);
      
      // Clean up
      return () => clearInterval(progressInterval);
    };
    
    startAnalysis();
  }, [report]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Realtime Document Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="text-sm font-medium">{currentStage}</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-right text-sm text-gray-500">{progress}%</div>
          </div>
          
          {/* Detected risks */}
          {detectedRisks.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Detected Issues:</h3>
              <div className="space-y-3">
                {detectedRisks.map((risk) => (
                  <div 
                    key={risk.id}
                    className={`p-3 rounded-md border-l-4 ${
                      risk.severity === 'high' ? 'border-red-500 bg-red-50' :
                      risk.severity === 'medium' ? 'border-amber-500 bg-amber-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="font-medium">{risk.title}</div>
                    <p className="text-sm mt-1">{risk.description}</p>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="font-medium">{risk.regulation}</span>
                      <span className={`${
                        risk.severity === 'high' ? 'text-red-700' :
                        risk.severity === 'medium' ? 'text-amber-700' :
                        'text-blue-700'
                      }`}>
                        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Severity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeAnalysisSimulator;
