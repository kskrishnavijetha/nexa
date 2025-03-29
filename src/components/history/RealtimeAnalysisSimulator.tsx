import { useState, useEffect } from 'react';
import { ComplianceReport, Risk } from '@/utils/types';
import { toast } from 'sonner';

interface RealtimeSimulatorProps {
  enabled: boolean;
  reports: ComplianceReport[];
  onReportsUpdate: (reports: ComplianceReport[]) => void;
  onAnalyzingUpdate: (documentName: string | null) => void;
  onLastUpdatedChange: (date: Date) => void;
}

const RealtimeAnalysisSimulator = ({
  enabled,
  reports,
  onReportsUpdate,
  onAnalyzingUpdate,
  onLastUpdatedChange
}: RealtimeSimulatorProps) => {
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);

  // Real-time updates simulation
  useEffect(() => {
    if (!enabled) return;
    
    const interval = setInterval(() => {
      // Update last updated timestamp
      onLastUpdatedChange(new Date());
      
      // 20% chance to update an existing report or start analyzing a new document
      if (Math.random() < 0.2) {
        // 70% chance to update an existing report, 30% chance to start analyzing a new document
        if (Math.random() < 0.7 && reports.length > 0) {
          // Update an existing report score
          const reportIndex = Math.floor(Math.random() * reports.length);
          const updatedReports = [...reports];
          const scoreChange = Math.floor(Math.random() * 10) - 3; // Between -3 and +6
          const report = {...updatedReports[reportIndex]};
          
          report.overallScore = Math.min(100, Math.max(0, report.overallScore + scoreChange));
          report.gdprScore = Math.min(100, Math.max(0, (report.gdprScore || 70) + Math.floor(Math.random() * 8) - 3));
          report.hipaaScore = Math.min(100, Math.max(0, (report.hipaaScore || 70) + Math.floor(Math.random() * 8) - 3));
          report.soc2Score = Math.min(100, Math.max(0, (report.soc2Score || 70) + Math.floor(Math.random() * 8) - 3));
          
          updatedReports[reportIndex] = report;
          onReportsUpdate(updatedReports);
          toast.info(`Compliance scores updated for "${report.documentName}"`);
        } else {
          // Simulate analyzing a new document
          const documentNames = [
            "Terms of Service",
            "Cookie Policy",
            "Employee Handbook",
            "GDPR Compliance Statement",
            "Data Processing Agreement",
            "Information Security Policy"
          ];
          
          // Get a random document that's not already in reports
          const existingNames = reports.map(r => r.documentName);
          const availableNames = documentNames.filter(name => !existingNames.includes(name));
          
          if (availableNames.length > 0) {
            const newDocName = availableNames[Math.floor(Math.random() * availableNames.length)];
            setAnalyzingDocument(newDocName);
            onAnalyzingUpdate(newDocName);
            
            // After 5-10 seconds, add the document to reports
            const analysisTime = 5000 + Math.random() * 5000;
            setTimeout(() => {
              const newRisk: Risk = { 
                id: `risk-${Date.now()}-1`, 
                title: 'Compliance Issue',
                description: 'Automatically detected compliance issue', 
                severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low', 
                regulation: Math.random() > 0.6 ? 'GDPR' : Math.random() > 0.3 ? 'HIPAA' : 'SOC 2',
                mitigation: 'Update compliance policy and documentation'
              };
              
              const newReport: ComplianceReport = {
                documentId: `doc-${Date.now()}`,
                documentName: newDocName,
                timestamp: new Date().toISOString(),
                overallScore: 60 + Math.floor(Math.random() * 40),
                gdprScore: 60 + Math.floor(Math.random() * 40),
                hipaaScore: 60 + Math.floor(Math.random() * 40),
                soc2Score: 60 + Math.floor(Math.random() * 40),
                industryScore: 60 + Math.floor(Math.random() * 40),
                regionalScore: 60 + Math.floor(Math.random() * 40),
                regulationScore: 60 + Math.floor(Math.random() * 40),
                risks: [newRisk],
                summary: 'Automatically generated compliance report with detected issues',
                industry: 'Cloud & SaaS',
                region: 'North America',
                complianceStatus: 'partially-compliant',
                regulations: ['GDPR', 'HIPAA'],
                suggestions: []
              };
              
              onReportsUpdate([newReport, ...reports]);
              setAnalyzingDocument(null);
              onAnalyzingUpdate(null);
              toast.success(`New compliance report added: "${newReport.documentName}"`);
            }, analysisTime);
          }
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [enabled, reports, onReportsUpdate, onAnalyzingUpdate, onLastUpdatedChange]);

  return null; // This is a non-visual component
};

export default RealtimeAnalysisSimulator;
