
import React, { useState, useRef, useEffect } from 'react';
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
  const [progressPercent, setProgressPercent] = useState(0);
  const toastIdRef = useRef<string | number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const captureViolationChartsAsImage = async (): Promise<string | undefined> => {
    // Find any charts container in the violations view
    const chartsContainer = document.querySelector('.violation-charts-container');
    
    if (!chartsContainer) {
      console.warn('No charts container found for violations');
      return undefined;
    }
    
    try {
      // Use html2canvas to capture the chart with optimized settings
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartsContainer as HTMLElement, {
        scale: 1.5, // Lower scale for better performance
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 5000, // Timeout to prevent hanging
        removeContainer: true // Clean up after capture
      });
      
      return canvas.toDataURL('image/png', 0.8); // 80% quality for better performance
    } catch (error) {
      console.error('Failed to capture violation charts:', error);
      return undefined;
    }
  };

  // Updated download handler with progressive rendering and optimized memory
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
      setProgressPercent(0);
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      // Show loading toast with progress
      toastIdRef.current = toast.loading(`Generating PDF report (0%)${serviceFilter ? ` for ${serviceFilter}` : ''}...`, { 
        duration: 60000
      });
      
      // Update progress periodically
      const progressInterval = setInterval(() => {
        setProgressPercent(prev => {
          // Cap at 90% - final 10% when actually complete
          const newValue = Math.min(prev + 5, 90);
          if (toastIdRef.current) {
            toast.loading(`Generating PDF report (${newValue}%)${serviceFilter ? ` for ${serviceFilter}` : ''}...`, { 
              id: toastIdRef.current 
            });
          }
          return newValue;
        });
      }, 300); // Less frequent updates
      
      // Use requestAnimationFrame to ensure UI updates before heavy operation
      requestAnimationFrame(async () => {
        try {
          // Use microtasks for better UI priority
          queueMicrotask(async () => {
            try {
              // Try to capture any charts before generating the PDF
              const chartImage = await captureViolationChartsAsImage();
              if (chartImage) {
                console.log('Violation charts captured successfully');
              }
              
              if (toastIdRef.current) {
                toast.loading(`Building report document...`, { 
                  id: toastIdRef.current 
                });
              }
              
              // Create a unique document ID
              const docId = `scan-${Date.now()}`;
              
              // Create suggestions with proper format - limit to 3 for performance
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
        
              // Limit total violations to avoid memory issues
              const maxViolations = 50;
              const limitedViolations = filteredViolations.length > maxViolations
                ? filteredViolations.slice(0, maxViolations)
                : filteredViolations;
        
              // Create formatted risks from violations (limited)
              const risks: ComplianceRisk[] = limitedViolations.map((v, index) => ({
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
              
              clearInterval(progressInterval);
              setProgressPercent(100);
              
              if (toastIdRef.current) {
                toast.loading(`Starting download (100%)...`, { 
                  id: toastIdRef.current 
                });
              }
              
              if (result.data) {
                // Create a download link for the PDF
                const url = URL.createObjectURL(result.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = serviceFilter 
                  ? `${serviceFilter.toLowerCase()}-compliance-scan.pdf` 
                  : 'compliance-scan-report.pdf';
                link.style.position = 'absolute'; 
                link.style.visibility = 'hidden';
                  
                document.body.appendChild(link);
                link.click();
                
                // Clean up properly to avoid memory leaks
                setTimeout(() => {
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  if (toastIdRef.current) {
                    toast.dismiss(toastIdRef.current);
                    toast.success(`PDF report for ${serviceFilter || 'all services'} downloaded successfully`);
                    toastIdRef.current = null;
                  }
                  setIsGeneratingReport(false);
                  setCurrentService(null);
                  abortControllerRef.current = null;
                  setProgressPercent(0);
                }, 100);
              } else {
                handleError(`Failed to generate PDF report for ${serviceFilter || 'all services'}`, progressInterval);
              }
            } catch (error) {
              handleError(`Error generating PDF: ${error}`, progressInterval);
            }
          });
        } catch (error) {
          handleError(`Error in animation frame: ${error}`, progressInterval);
        }
      });
    } catch (error) {
      handleError(`Error starting PDF generation: ${error}`, null);
    }
  };
  
  // Centralized error handler
  const handleError = (message: string, interval: NodeJS.Timeout | null) => {
    console.error(message);
    if (interval) clearInterval(interval);
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toast.error('An error occurred while generating the PDF');
      toastIdRef.current = null;
    }
    setIsGeneratingReport(false);
    setCurrentService(null);
    abortControllerRef.current = null;
    setProgressPercent(0);
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
            {progressPercent > 0 ? `${progressPercent}%` : 'Generating...'}
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Download Full Report
          </>
        )}
      </Button>
      
      {/* Per-service download buttons */}
      {services.slice(0, 5).map(service => ( // Limit to top 5 services for UI clarity
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
              {progressPercent > 0 ? `${progressPercent}%` : 'Generating...'}
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
