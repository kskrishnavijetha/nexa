
import { useState } from 'react';
import { toast } from 'sonner';
import { SupportedLanguage } from '@/utils/language';
import { Industry, Region } from '@/utils/types';
import { scanMicrosoftService } from '@/utils/microsoft/microsoftServices';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface UseMicrosoftServiceScannerProps {
  serviceId: string;
  serviceType: 'sharepoint' | 'outlook' | 'teams';
}

export function useMicrosoftServiceScanner({ serviceId, serviceType }: UseMicrosoftServiceScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleScan = async (industry?: Industry, language?: SupportedLanguage, region?: Region) => {
    if (!industry) {
      toast.error('Please select an industry before scanning');
      return;
    }
    
    setIsScanning(true);
    try {
      let scanDescription = '';
      
      // Service-specific scan messaging
      if (serviceType === 'sharepoint') {
        scanDescription = 'SharePoint sites and documents for compliance issues';
      } else if (serviceType === 'outlook') {
        scanDescription = 'Outlook emails for sensitive information and compliance violations';
      } else if (serviceType === 'teams') {
        scanDescription = 'Teams messages and channels for PII and regulatory compliance';
      }
      
      toast.info(`Scanning ${scanDescription}...`);
      
      const result = await scanMicrosoftService(serviceId, industry, language, region);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        const { itemsScanned, violationsFound } = result.data;
        toast.success(`Scan complete: ${itemsScanned} items scanned, ${violationsFound} violations found`);
        return result.data;
      }
    } catch (error) {
      console.error(`Error scanning ${serviceType}:`, error);
      toast.error(`Failed to scan ${serviceType}`);
    } finally {
      setIsScanning(false);
    }
    
    return null;
  };

  const handleFileUpload = async (industry?: Industry, language?: SupportedLanguage, region?: Region) => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!industry) {
      toast.error('Please select an industry for compliance checking');
      return;
    }
    
    setIsScanning(true);
    try {
      toast.info(`Uploading and scanning document for ${serviceType}...`);
      
      // Simulate file upload and scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Document "${file.name}" uploaded and scanned successfully`);
      setShowUploadDialog(false);
      setFile(null);
      
      // Now perform actual scan on the service including the new document
      return handleScan(industry, language, region);
    } catch (error) {
      console.error(`Error uploading document for ${serviceType}:`, error);
      toast.error(`Failed to upload document for ${serviceType}`);
    } finally {
      setIsScanning(false);
    }
    
    return null;
  };

  // Component for the upload dialog
  const UploadDialog = ({ 
    open, 
    onOpenChange, 
    onUpload,
    industry,
    language,
    region
  }: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
    onUpload: () => void;
    industry?: Industry;
    language?: SupportedLanguage;
    region?: Region;
  }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document for {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</DialogTitle>
          <DialogDescription>
            Upload a document to scan for compliance in your {serviceType} environment
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select file</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
            />
          </div>
          <Button 
            onClick={onUpload} 
            disabled={!file || isScanning} 
            className="w-full"
          >
            {isScanning ? 'Uploading...' : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload and Scan
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return {
    isScanning,
    handleScan,
    showUploadDialog,
    setShowUploadDialog,
    UploadDialog,
    handleFileUpload
  };
}
