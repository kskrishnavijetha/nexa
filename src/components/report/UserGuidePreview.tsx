
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileDown } from 'lucide-react';
import { getPdfDownloadUrl } from '@/utils/pdfGuide';
import { toast } from 'sonner';

interface UserGuidePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuidePreview: React.FC<UserGuidePreviewProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const handleDownload = () => {
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Nexabloom User Guide</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-6 text-left p-1">
            {/* Introduction */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Introduction</h3>
              <p className="text-gray-700">
                Welcome to Nexabloom - your AI-powered compliance automation platform. This guide 
                will help you understand our main features and how to make the most of our platform.
              </p>
            </div>
            
            <Separator />
            
            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-700">Document Analysis with AI-powered compliance scanning</li>
                <li className="text-gray-700">Cloud Services Compliance for Google, Microsoft and more</li>
                <li className="text-gray-700">Real-time Slack monitoring for compliance violations</li>
                <li className="text-gray-700">Automated audit reports and compliance documentation</li>
                <li className="text-gray-700">Predictive analytics for risk assessment</li>
              </ul>
            </div>
            
            <Separator />
            
            {/* Getting Started */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li className="text-gray-700">
                  <span className="font-medium">Account Setup:</span> Create and configure your Nexabloom account with your organization's details
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Industry Selection:</span> Choose your specific industry to enable tailored compliance checks
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Document Upload:</span> Upload your first document for compliance analysis
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Service Integration:</span> Connect cloud services for comprehensive compliance monitoring
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Schedule Monitoring:</span> Set up regular compliance scans and monitoring schedules
                </li>
              </ol>
            </div>
            
            <Separator />
            
            {/* Industry-Specific Guidance */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Industry-Specific Guidance</h3>
              <p className="text-gray-700 mb-3">
                Nexabloom provides specialized compliance frameworks for various industries:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-primary">Healthcare</h4>
                  <p className="text-sm text-gray-600">HIPAA, HITECH, and FDA compliance</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-primary">Finance</h4>
                  <p className="text-sm text-gray-600">SOX, PCI DSS, and AML regulations</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-primary">Technology</h4>
                  <p className="text-sm text-gray-600">GDPR, CCPA, and ISO standards</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-primary">Retail</h4>
                  <p className="text-sm text-gray-600">PCI DSS, CCPA, and CAN-SPAM</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Regional Regulations */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Regional Regulations</h3>
              <p className="text-gray-700 mb-3">
                Nexabloom covers regulatory requirements across multiple regions:
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li className="text-gray-700">
                  <span className="font-medium">European Union:</span> GDPR, ePrivacy Directive
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">United States:</span> HIPAA, CCPA, SOX, GLBA
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Canada:</span> PIPEDA, CASL
                </li>
                <li className="text-gray-700">
                  <span className="font-medium">Australia:</span> Privacy Act, Notifiable Data Breaches
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-6">
          <Button 
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download Complete Guide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuidePreview;
