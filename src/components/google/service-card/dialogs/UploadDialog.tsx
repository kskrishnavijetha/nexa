
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Scan, FileText } from 'lucide-react';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  serviceId: string;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  serviceId,
  dialogTitle,
  dialogDescription,
  submitButtonText,
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [emailContent, setEmailContent] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Collect form data based on service type
    let formData;
    if (serviceId.includes('drive')) {
      formData = { file: uploadFile, fileName };
    } else if (serviceId.includes('gmail')) {
      formData = { emailContent };
    } else if (serviceId.includes('docs')) {
      formData = { docTitle, docContent, file: uploadFile };
    }
    
    onSubmit(formData);
    
    // Auto close dialog after submission
    onClose();
    
    // Clear form
    setUploadFile(null);
    setEmailContent('');
    setDocTitle('');
    setDocContent('');
    setFileName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {serviceId.includes('drive') && (
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <div className="flex flex-col gap-2">
                <Input 
                  id="file" 
                  type="file" 
                  onChange={handleFileChange} 
                  required 
                />
                {fileName && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded border border-slate-200">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{fileName}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {serviceId.includes('gmail') && (
            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea 
                id="content" 
                value={emailContent} 
                onChange={(e) => setEmailContent(e.target.value)} 
                placeholder="Type your message here or paste content to analyze..." 
                rows={8} 
                required 
              />
            </div>
          )}
          
          {serviceId.includes('docs') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="file">Upload Document</Label>
                <Input 
                  id="file" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".doc,.docx,.pdf,.txt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input 
                  id="title" 
                  value={docTitle} 
                  onChange={(e) => setDocTitle(e.target.value)} 
                  placeholder="Untitled Document" 
                  required 
                />
              </div>
              {!uploadFile && (
                <div className="space-y-2">
                  <Label htmlFor="docContent">Document Content</Label>
                  <Textarea 
                    id="docContent" 
                    value={docContent} 
                    onChange={(e) => setDocContent(e.target.value)} 
                    placeholder="Start typing or paste document content..." 
                    rows={8} 
                    required={!uploadFile}
                  />
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {serviceId.includes('gmail') ? (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
