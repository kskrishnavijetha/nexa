
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, FileText, BookOpen, BookMarked } from 'lucide-react';
import { getPdfDownloadUrl } from '@/utils/pdfGuide';
import { toast } from 'sonner';

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
      
      toast.success("User guide downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF', error);
      toast.error("Failed to generate the guide. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="my-16">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden border-2 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <BookMarked className="h-6 w-6 text-primary mr-2" />
            <div>
              <CardTitle className="text-2xl">Nexabloom Comprehensive User Guide</CardTitle>
              <CardDescription className="text-base">
                Everything you need to know about maximizing your compliance automation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Our detailed user guide includes step-by-step instructions, best practices, and 
                industry-specific guidance to help you achieve compliance excellence with Nexabloom.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-primary font-semibold text-sm">1</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Industry-Specific Compliance</h4>
                    <p className="text-sm text-muted-foreground">Tailored guidance for Finance, Healthcare, SaaS, and more</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-primary font-semibold text-sm">2</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Regional Regulation Mapping</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive coverage of GDPR, HIPAA, SOC 2, and more</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-primary font-semibold text-sm">3</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">Integration Walkthroughs</h4>
                    <p className="text-sm text-muted-foreground">Step-by-step setup for all supported platforms</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -right-6 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
              <div className="absolute -left-6 -bottom-10 w-32 h-32 bg-secondary/5 rounded-full blur-xl"></div>
              <div className="relative bg-card p-6 rounded-lg border shadow-sm">
                <BookOpen className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">What's Inside:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 text-primary mr-2" />
                    <span>Implementation Strategies</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 text-primary mr-2" />
                    <span>Risk Mitigation Techniques</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 text-primary mr-2" />
                    <span>Compliance Best Practices</span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 text-primary mr-2" />
                    <span>Regulatory Update Guidance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6 pt-4">
          <Button 
            onClick={handleDownload} 
            disabled={isGenerating}
            size="lg"
            className="gap-2 transition-all hover:scale-105"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileDown className="h-5 w-5" />
                Download Complete Guide (PDF)
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserGuide;
