
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reports';
import { ScanViolation, SupportedLanguage } from '../types';
import { ComplianceRisk, Industry, Region, Suggestion } from '@/utils/types';
import { Progress } from '@/components/ui/progress';

interface ReportActionsProps {
  violations: ScanViolation[];
  industry?: Industry;
  services: string[];
}

const ReportActions: React.FC<ReportActionsProps> = ({ violations, industry, services }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentService, setCurrentService] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownloadPDF = async (serviceFilter?: string) => {
    if (isGenerating) return;
    
    try {
      const filteredViolations = serviceFilter 
        ? violations.filter(v => v.service === serviceFilter)
        : violations;
      
      if (filteredViolations.length === 0) {
        toast.error('No violations to include in report');
        return;
      }
      
      setIsGenerating(true);
      setCurrentService(serviceFilter || 'all');
      setProgress(10);
      
      const toastId = toast.loading(`Generating PDF report${serviceFilter ? ` for ${serviceFilter}` : ''}...`);
      
      // Allow UI to breathe
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress(20);
      
      // Create a unique document ID
      const docId = `scan-${Date.now()}`;
      
      // Create suggestions with proper format
      const suggestionObjects: Suggestion[] = [
        {
          id: 'sugg-1',
          title: 'Review high severity issues immediately',
          description: 'Review high severity issues immediately'
        },
        {
          id: 'sugg-2',
          title: 'Implement access controls for sensitive data',
          description: 'Implement access controls for sensitive data'
        },
        {
          id: 'sugg-3',
          title: 'Update compliance policies for all connected services',
          description: 'Update compliance policies for all connected services'
        }
      ];

      setProgress(40);
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Create formatted risks from violations
      const risks: ComplianceRisk[] = filteredViolations.map((v, index) => ({
        id: `risk-${index + 1}`,
        title: v.title,
        severity: v.severity as 'high' | 'medium' | 'low',
        description: v.description,
        mitigation: 'Review and address the identified issue',
        regulation: v.service,
        section: v.location
      }));
      
      setProgress(60);
      // Always use the explicitly selected industry from props or from the first violation
      const reportIndustry = industry || 
        (filteredViolations.length > 0 && filteredViolations[0].industry) || 
        'Global' as Industry;
        
      console.log(`[ScanResults] Using industry for report: ${reportIndustry}`);
      
      // Create a mock report structure with the filtered violations data
      const mockReport = {
        id: docId,
        documentId: docId,
        documentName: serviceFilter 
          ? `${serviceFilter} Compliance Scan` 
          : 'Cloud Services Compliance Scan',
        timestamp: new Date().toISOString(),
        overallScore: Math.max(100 - filteredViolations.length * 5, 50), // Simple score calculation
        gdprScore: Math.floor(Math.random() * 30) + 70,
        hipaaScore: Math.floor(Math.random() * 30) + 70,
        soc2Score: Math.floor(Math.random() * 30) + 70,
        pciDssScore: Math.floor(Math.random() * 30) + 70,
        industryScore: Math.floor(Math.random() * 30) + 70,
        regionalScore: Math.floor(Math.random() * 30) + 70,
        regulationScore: Math.floor(Math.random() * 30) + 70,
        industry: reportIndustry,
        region: 'Global' as Region,
        risks: risks,
        summary: `Scan completed with ${filteredViolations.length} potential compliance issues found${serviceFilter ? ` in ${serviceFilter}` : ' across cloud services'}.`,
        suggestions: suggestionObjects,
        complianceStatus: 'partially-compliant' as 'compliant' | 'non-compliant' | 'partially-compliant',
        regulations: industry === 'Healthcare' ? ['HIPAA', 'GDPR'] :
                     industry === 'Finance & Banking' ? ['GLBA', 'PCI-DSS', 'SOC 2'] :
                     industry === 'Retail & Consumer' ? ['PCI-DSS', 'GDPR', 'CCPA'] :
                     ['GDPR', 'ISO/IEC 27001']
      };
      
      setProgress(80);
      
      // Use promise with timeout to allow UI updates
      const result = await new Promise(resolve => {
        setTimeout(async () => {
          const response = await generateReportPDF(mockReport, 'en' as SupportedLanguage);
          resolve(response);
        }, 50);
      });
      
      setProgress(90);
      toast.loading('Preparing download...', { id: toastId });
      
      // @ts-ignore - We know result has the correct structure
      if (result.data) {
        // Create a download link for the PDF with a timeout
        setTimeout(() => {
          // @ts-ignore - We know result has the correct structure
          const url = URL.createObjectURL(result.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = serviceFilter 
            ? `${serviceFilter.toLowerCase()}-compliance-scan.pdf` 
            : 'compliance-scan-report.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the URL
          setTimeout(() => {
            URL.revokeObjectURL(url);
            toast.dismiss(toastId);
            toast.success(`PDF report for ${serviceFilter || 'all services'} downloaded successfully`);
            setProgress(100);
            
            // Reset after a short delay
            setTimeout(() => {
              setIsGenerating(false);
              setCurrentService(null);
              setProgress(0);
            }, 200);
          }, 100);
        }, 50);
      } else {
        toast.dismiss(toastId);
        toast.error('Failed to generate PDF report');
        setIsGenerating(false);
        setCurrentService(null);
        setProgress(0);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('An error occurred while generating the PDF');
      setIsGenerating(false);
      setCurrentService(null);
      setProgress(0);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-3 items-stretch sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-2">
        {/* Download all results button */}
        <Button 
          onClick={() => handleDownloadPDF()}
          variant="outline"
          className="flex items-center justify-center gap-2"
          disabled={isGenerating}
        >
          {isGenerating && currentService === 'all' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {isGenerating && currentService === 'all' ? 'Generating...' : 'Download Full Report'}
        </Button>
        
        {/* Per-service download buttons */}
        {services.map(service => (
          <Button 
            key={service}
            onClick={() => handleDownloadPDF(service)}
            variant="outline"
            className="flex items-center justify-center gap-2"
            disabled={isGenerating}
          >
            {isGenerating && currentService === service ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGenerating && currentService === service ? 'Generating...' : `Download ${service}`}
          </Button>
        ))}
      </div>
      
      {isGenerating && (
        <Progress value={progress} className="h-1.5" />
      )}
    </div>
  );
};

export default ReportActions;
