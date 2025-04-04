
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { generateReportPDF } from '@/utils/reportService';
import { ScanViolation, SupportedLanguage } from '../types';
import { ComplianceRisk, Industry, Region, Suggestion } from '@/utils/types';

interface ReportActionsProps {
  violations: ScanViolation[];
  industry?: Industry;
  services: string[];
}

const ReportActions: React.FC<ReportActionsProps> = ({ violations, industry, services }) => {
  const handleDownloadPDF = async (serviceFilter?: string) => {
    try {
      const filteredViolations = serviceFilter 
        ? violations.filter(v => v.service === serviceFilter)
        : violations;
      
      if (filteredViolations.length === 0) {
        toast.error('No violations to include in report');
        return;
      }
      
      toast.info(`Generating PDF report${serviceFilter ? ` for ${serviceFilter}` : ''}...`);
      
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
      
      const result = await generateReportPDF(mockReport, 'en' as SupportedLanguage);
      
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
        document.body.removeChild(link);
        
        toast.success(`PDF report for ${serviceFilter || 'all services'} downloaded successfully`);
      } else {
        toast.error('Failed to generate PDF report');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('An error occurred while generating the PDF');
    }
  };
  
  return (
    <div className="flex flex-col space-y-3 items-stretch sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-2">
      {/* Download all results button */}
      <Button 
        onClick={() => handleDownloadPDF()}
        variant="outline"
        className="flex items-center justify-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Download Full Report
      </Button>
      
      {/* Per-service download buttons */}
      {services.map(service => (
        <Button 
          key={service}
          onClick={() => handleDownloadPDF(service)}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download {service}
        </Button>
      ))}
    </div>
  );
};

export default ReportActions;
