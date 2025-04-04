
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { getPdfDownloadUrl } from '@/utils/pdfGuide';

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
      a.download = 'Nexabloom_User_Guide.pdf';
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
          <CardTitle className="text-2xl">📚 Nexabloom Comprehensive User Guide</CardTitle>
          <CardDescription>
            Download our detailed user guide with industry-specific features and regional regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our comprehensive user guide includes detailed explanations of all features, industry-specific 
            compliance requirements, region-specific regulations, and best practices for compliance management.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Detailed features for each industry (Finance, Healthcare, Cloud & SaaS, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Region-specific regulations (US, EU, UK, APAC) and compliance tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Step-by-step implementation guides for each regulation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">✓</span>
              <span>Integration setup instructions for all supported platforms</span>
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
            {isGenerating ? 'Generating PDF...' : 'Download Comprehensive Guide (PDF)'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserGuide;
