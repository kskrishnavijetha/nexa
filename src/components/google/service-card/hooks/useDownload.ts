
import { toast } from 'sonner';
import { UploadedFileInfo } from './types';

export const useDownload = (serviceId: string, uploadedFile: UploadedFileInfo | null) => {
  const handleDownload = () => {
    // Simulate downloading a document
    toast.info("Preparing PDF document for download...");
    
    setTimeout(() => {
      let documentName = '';
      if (serviceId.includes('drive')) {
        documentName = uploadedFile?.name || 'drive-document.pdf';
      } else if (serviceId.includes('gmail')) {
        documentName = 'email-scan-report.pdf';
      } else if (serviceId.includes('docs')) {
        documentName = uploadedFile?.name || 'google-doc.pdf';
      } else {
        documentName = 'document.pdf';
      }
      
      // Make sure documentName has .pdf extension
      if (!documentName.toLowerCase().endsWith('.pdf')) {
        documentName = documentName.split('.')[0] + '.pdf';
      }
      
      // Create a mock blob to simulate a file download
      const blob = new Blob(['Mock file content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`PDF "${documentName}" downloaded successfully`);
    }, 1500);
  };

  return { handleDownload };
};
