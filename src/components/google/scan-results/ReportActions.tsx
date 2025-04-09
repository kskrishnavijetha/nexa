
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
      
      const toastId = toast.loading(`Preparing report data${serviceFilter ? ` for ${serviceFilter}` : ''}...`);
      
      // Stage 1: Prepare data with minimal processing - use requestAnimationFrame instead of setTimeout
      requestAnimationFrame(async () => {
        setProgress(20);
        
        // Create a unique document ID
        const docId = `scan-${Date.now()}`;
        
        // Create lightweight suggestions data
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
        
        setProgress(30);
        toast.loading('Processing violation data...', { id: toastId });
        
        // Stage 2: Create formatted risks from violations - process in chunks
        // using a more efficient approach to prevent UI freeze
        const risks: ComplianceRisk[] = [];
        const chunkSize = 20;
        
        // Process violations in chunks to avoid UI freezing
        for (let i = 0; i < filteredViolations.length; i += chunkSize) {
          // Get current chunk
          const chunk = filteredViolations.slice(i, i + chunkSize);
          
          // Process this chunk
          const chunkRisks = chunk.map((v, index) => ({
            id: `risk-${i + index + 1}`,
            title: v.title,
            severity: v.severity as 'high' | 'medium' | 'low',
            description: v.description,
            mitigation: 'Review and address the identified issue',
            regulation: v.service,
            section: v.location
          }));
          
          // Add to main risks array
          risks.push(...chunkRisks);
          
          // Allow UI to update if there are more chunks to process
          if (i + chunkSize < filteredViolations.length) {
            await new Promise(resolve => requestAnimationFrame(resolve));
          }
        }
        
        setProgress(50);
        
        // Always use the explicitly selected industry from props or from the first violation
        const reportIndustry = industry || 
          (filteredViolations.length > 0 && filteredViolations[0].industry) || 
          'Global' as Industry;
        
        // Create a lightweight report structure
        const mockReport = {
          id: docId,
          documentId: docId,
          documentName: serviceFilter 
            ? `${serviceFilter} Compliance Scan` 
            : 'Cloud Services Compliance Scan',
          timestamp: new Date().toISOString(),
          overallScore: Math.max(100 - filteredViolations.length * 5, 50),
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
        
        setProgress(60);
        toast.loading('Building PDF document...', { id: toastId });
        
        // Stage 3: Generate PDF with optimized settings
        const result = await new Promise(resolve => {
          requestAnimationFrame(async () => {
            try {
              const response = await generateReportPDF(mockReport, 'en' as SupportedLanguage);
              resolve(response);
            } catch (err) {
              console.error("Error in PDF generation:", err);
              resolve({ error: "PDF generation failed" });
            }
          });
        });
        
        setProgress(80);
        toast.loading('Finalizing download...', { id: toastId });
        
        // @ts-ignore - We know result has the correct structure
        if (result.data) {
          // Stage 4: Create download link with immediate cleanup
          requestAnimationFrame(() => {
            try {
              // @ts-ignore - We know result has the correct structure
              const url = URL.createObjectURL(result.data);
              const link = document.createElement('a');
              link.href = url;
              link.download = serviceFilter 
                ? `${serviceFilter.toLowerCase()}-compliance-scan.pdf` 
                : 'compliance-scan-report.pdf';
              
              // Click to download
              link.click();
              
              // Immediate cleanup to prevent memory leaks
              URL.revokeObjectURL(url);
              
              toast.dismiss(toastId);
              toast.success(`PDF report for ${serviceFilter || 'all services'} downloaded successfully`);
              setProgress(100);
              
              // Reset state immediately
              setIsGenerating(false);
              setCurrentService(null);
              setProgress(0);
            } catch (err) {
              console.error("Error in download process:", err);
              toast.dismiss(toastId);
              toast.error('Failed to download the generated PDF');
              setIsGenerating(false);
              setCurrentService(null);
              setProgress(0);
            }
          });
        } else {
          toast.dismiss(toastId);
          toast.error('Failed to generate PDF report');
          setIsGenerating(false);
          setCurrentService(null);
          setProgress(0);
        }
      });
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
