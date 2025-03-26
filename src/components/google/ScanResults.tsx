
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertTriangle, Check, FilePdf, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScanViolation } from './types';
import { generateReportPDF } from '@/utils/reportService';
import { toast } from 'sonner';
import { SupportedLanguage } from '@/utils/language';

interface ScanResultsProps {
  violations: ScanViolation[];
}

const ScanResults: React.FC<ScanResultsProps> = ({ violations }) => {
  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF report...');
      
      // Create a mock report structure with the violations data
      const mockReport = {
        documentName: 'Cloud Services Compliance Scan',
        timestamp: new Date().toISOString(),
        overallScore: Math.max(100 - violations.length * 5, 50), // Simple score calculation
        gdprScore: Math.floor(Math.random() * 30) + 70,
        hipaaScore: Math.floor(Math.random() * 30) + 70,
        soc2Score: Math.floor(Math.random() * 30) + 70,
        pciDssScore: Math.floor(Math.random() * 30) + 70,
        industry: 'Technology',
        risks: violations.map(v => ({
          severity: v.severity,
          description: v.title + ": " + v.description,
          regulation: v.service,
          section: v.location
        })),
        summary: `Scan completed with ${violations.length} potential compliance issues found across cloud services.`,
        suggestions: [
          'Review high severity issues immediately',
          'Implement access controls for sensitive data',
          'Update compliance policies for all connected services'
        ]
      };
      
      const result = await generateReportPDF(mockReport, 'en' as SupportedLanguage);
      
      if (result.data) {
        // Create a download link for the PDF
        const url = URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'compliance-scan-report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('PDF report downloaded successfully');
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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {violations.map((violation, index) => (
            <div key={index} className="flex items-start p-3 rounded-md bg-muted/50">
              {violation.severity === 'high' ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              ) : violation.severity === 'medium' ? (
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {violation.title}
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      violation.severity === 'high' 
                        ? 'border-red-200 bg-red-100 text-red-800' 
                        : violation.severity === 'medium'
                        ? 'border-amber-200 bg-amber-100 text-amber-800'
                        : 'border-blue-200 bg-blue-100 text-blue-800'
                    }`}
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
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FilePdf className="h-4 w-4" />
            Download PDF Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ScanResults;
