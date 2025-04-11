
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reports';
import { ScanViolation, SupportedLanguage } from '../types';
import { ComplianceRisk, Industry, Region, Suggestion } from '@/utils/types';

interface ReportActionsProps {
  violations: ScanViolation[];
  industry?: Industry;
  services: string[];
}

const ReportActions: React.FC<ReportActionsProps> = ({ violations, industry, services }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentService, setCurrentService] = useState<string | null>(null);

  const captureViolationChartsAsImage = async (): Promise<string | undefined> => {
    // Find any charts container in the violations view
    const chartsContainer = document.querySelector('.violation-charts-container');
    
    if (!chartsContainer) {
      console.warn('No charts container found for violations');
      return undefined;
    }
    
    try {
      // Use html2canvas to capture the chart
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartsContainer as HTMLElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture violation charts:', error);
      return undefined;
    }
  };

  const handleDownloadPDF = async (serviceFilter?: string) => {
    if (isGeneratingReport) return;
    
    try {
      const filteredViolations = serviceFilter 
        ? violations.filter(v => v.service === serviceFilter)
        : violations;
      
      if (filteredViolations.length === 0) {
        toast.error('No violations to include in report');
        return;
      }
      
      setIsGeneratingReport(true);
      setCurrentService(serviceFilter || 'all services');
      
      const toastId = toast.loading(`Generating PDF report${serviceFilter ? ` for ${serviceFilter}` : ''}...`, { 
        duration: 30000
      });
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Try to capture any charts before generating the PDF
          const chartImage = await captureViolationChartsAsImage();
          if (chartImage) {
            console.log('Violation charts captured successfully');
          }
          
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
          
          const result = await generateReportPDF(mockReport, 'en' as SupportedLanguage, chartImage);
          
          if (result.data) {
            // Create a download link for the PDF
            const url = URL.createObjectURL(result.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = serviceFilter 
              ? `${serviceFilter.toLowerCase()}-compliance-scan.pdf` 
              : 'compliance-scan-report.pdf';
              
            document.body.appendChild(link);
            link.click();
            
            // Clean up properly to avoid memory leaks
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.dismiss(toastId);
              toast.success(`PDF report for ${serviceFilter || 'all services'} downloaded successfully`);
              setIsGeneratingReport(false);
              setCurrentService(null);
            }, 100);
          } else {
            toast.dismiss(toastId);
            toast.error('Failed to generate PDF report');
            setIsGeneratingReport(false);
            setCurrentService(null);
          }
        } catch (error) {
          console.error('Error in animation frame:', error);
          toast.dismiss(toastId);
          toast.error('An error occurred while generating the PDF');
          setIsGeneratingReport(false);
          setCurrentService(null);
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('An error occurred while generating the PDF');
      setIsGeneratingReport(false);
      setCurrentService(null);
    }
  };
  
  return (
    <div className="flex flex-col space-y-3 items-stretch sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-2">
      {/* Download all results button */}
      <Button 
        onClick={() => handleDownloadPDF()}
        variant="outline"
        disabled={isGeneratingReport}
        className="flex items-center justify-center gap-2"
      >
        {isGeneratingReport && currentService === 'all services' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Download Full Report
          </>
        )}
      </Button>
      
      {/* Per-service download buttons */}
      {services.map(service => (
        <Button 
          key={service}
          onClick={() => handleDownloadPDF(service)}
          variant="outline"
          disabled={isGeneratingReport}
          className="flex items-center justify-center gap-2"
        >
          {isGeneratingReport && currentService === service ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download {service}
            </>
          )}
        </Button>
      ))}
    </div>
  );
};

export default ReportActions;
