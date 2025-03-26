import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Eye, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { ScanViolation } from '@/components/google/types';
import { ComplianceReport } from '@/utils/types';

interface MicrosoftScanResultsProps {
  violations: ScanViolation[];
  serviceName: string;
}

const MicrosoftScanResults: React.FC<MicrosoftScanResultsProps> = ({ violations, serviceName }) => {
  const [selectedViolation, setSelectedViolation] = useState<ScanViolation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const violationsByService = violations.reduce((acc, violation) => {
    const service = violation.service;
    if (!acc[service]) {
      acc[service] = [];
    }
    acc[service].push(violation);
    return acc;
  }, {} as Record<string, ScanViolation[]>);

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-orange-500 text-white">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleViewViolation = (violation: ScanViolation) => {
    setSelectedViolation(violation);
    setPreviewOpen(true);
  };

  const handleDownloadPDF = async (service: string) => {
    setIsGeneratingPDF(true);
    
    setTimeout(() => {
      try {
        const blob = new Blob(['PDF content for ' + service], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${service}-compliance-report.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success(`Downloaded compliance report for ${service}`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error(`Failed to generate PDF for ${service}`);
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 1500);
  };

  const violationToReport = (violation: ScanViolation): ComplianceReport => {
    return {
      id: Math.random().toString(),
      documentId: Math.random().toString(),
      documentName: violation.location || 'Unknown',
      timestamp: new Date().toISOString(),
      overallScore: 100 - (violation.severity === 'high' ? 40 : violation.severity === 'medium' ? 20 : 10),
      gdprScore: 100 - (violation.severity === 'high' ? 40 : violation.severity === 'medium' ? 20 : 10),
      hipaaScore: 100 - (violation.severity === 'high' ? 40 : violation.severity === 'medium' ? 20 : 10),
      soc2Score: 100 - (violation.severity === 'high' ? 40 : violation.severity === 'medium' ? 20 : 10),
      pciDssScore: 100 - (violation.severity === 'high' ? 40 : violation.severity === 'medium' ? 20 : 10),
      region: 'global',
      language: 'en',
      industry: 'technology',
      fileSize: '1.2 MB',
      contentType: 'document',
      summary: `This document contains a compliance violation related to ${violation.title}. The specific issue is: ${violation.description}`,
      risks: [
        {
          id: `risk-${Math.random().toString().substring(2, 10)}`,
          severity: violation.severity,
          regulation: serviceName,
          description: violation.description,
          section: violation.title
        }
      ],
      suggestions: [
        `Review the document to remove any sensitive information.`,
        `Update your compliance policies to prevent similar issues.`,
        `Consider additional training for staff on handling sensitive data.`
      ]
    };
  };

  if (violations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scan Results: {serviceName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No compliance violations found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Scan Results: {serviceName}</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(violationsByService).map(([service, serviceViolations]) => (
            <div key={service} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{service}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadPDF(service)}
                  disabled={isGeneratingPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceViolations.map((violation, index) => (
                      <TableRow key={index}>
                        <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                        <TableCell className="font-medium">{violation.title}</TableCell>
                        <TableCell>{violation.location}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewViolation(violation)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedViolation && (
        <DocumentPreview
          report={violationToReport(selectedViolation)}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          footer={
            <Button 
              onClick={() => handleDownloadPDF(selectedViolation.service)}
              disabled={isGeneratingPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          }
        />
      )}
    </>
  );
};

export default MicrosoftScanResults;
