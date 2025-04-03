
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangle, Check, FileText, Download, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScanViolation, ScanResults as ScanResultsType } from './types';
import { generateReportPDF } from '@/utils/reportService';
import { toast } from 'sonner';
import { SupportedLanguage } from '@/utils/language';
import { ComplianceRisk, Industry, Region, Suggestion } from '@/utils/types';

interface ScanResultsProps {
  violations: ScanViolation[];
  industry?: Industry; // Add industry prop
}

const ScanResults: React.FC<ScanResultsProps> = ({ violations, industry }) => {
  // Get unique services from violations
  const uniqueServices = [...new Set(violations.map(v => v.service))];

  // Group violations by service
  const violationsByService = uniqueServices.reduce((acc, service) => {
    acc[service] = violations.filter(v => v.service === service);
    return acc;
  }, {} as Record<string, ScanViolation[]>);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-purple-200 bg-purple-100 text-purple-800';
      case 'high':
        return 'border-red-200 bg-red-100 text-red-800';
      case 'medium':
        return 'border-amber-200 bg-amber-100 text-amber-800';
      default:
        return 'border-blue-200 bg-blue-100 text-blue-800';
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle>Scan Results</CardTitle>
        <CardDescription>
          Found {violations.length} potential compliance issues
          {industry && <span className="ml-1">in {industry} industry</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {violations.map((violation, index) => (
            <div key={index} className="flex items-start p-3 rounded-md bg-muted/50">
              {getSeverityIcon(violation.severity)}
              <div>
                <h4 className="font-medium">
                  {violation.title}
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${getSeverityBadgeClass(violation.severity)}`}
                  >
                    {violation.severity}
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {violation.service}
                  </Badge>
                  <span>{violation.location}</span>
                  {violation.industry && (
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                      {violation.industry}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {violations.length === 0 && (
            <div className="flex items-center justify-center p-4 rounded-md bg-green-50 text-green-700">
              <Check className="h-5 w-5 mr-2" />
              <span>No compliance issues found</span>
            </div>
          )}
        </div>
      </CardContent>
      {violations.length > 0 && (
        <CardFooter className="flex flex-col space-y-3 items-stretch sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-2">
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
          {uniqueServices.map(service => (
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
        </CardFooter>
      )}
    </Card>
  );
};

export default ScanResults;
