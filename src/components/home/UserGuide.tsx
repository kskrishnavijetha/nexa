
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { getPdfDownloadUrl } from '@/utils/pdfGuideGenerator';

const UserGuide: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = () => {
    setIsGenerating(true);
    try {
      // Generate a URL for the PDF guide
      const pdfUrl = getPdfDownloadUrl();
      
      // Create an anchor element and trigger the download
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'CompliZen_User_Guide.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="my-16">
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl">📚 CompliZen User Guide</CardTitle>
          <CardDescription>
            Download our comprehensive user guide to learn how to use all the features of CompliZen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our user guide includes detailed explanations of all features, step-by-step tutorials,
            integration guides, and best practices for compliance management.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Learn how to use AI-powered compliance scanning</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Understand risk assessment and mitigation tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Set up integrations with cloud services</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Configure automated compliance reporting</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={handleDownload} 
            disabled={isGenerating}
            size="lg"
            className="gap-2"
          >
            <FileDown className="h-5 w-5" />
            {isGenerating ? 'Generating PDF...' : 'Download User Guide (PDF)'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserGuide;
