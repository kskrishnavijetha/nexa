
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [emailSubject, setEmailSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Collect form data based on service type
    let formData;
    if (serviceId.includes('drive')) {
      formData = { file: uploadFile };
    } else if (serviceId.includes('gmail')) {
      formData = { recipientEmail, emailSubject, emailContent };
    } else if (serviceId.includes('docs')) {
      formData = { docTitle, docContent };
    }
    
    onSubmit(formData);
    
    // Clear form
    setUploadFile(null);
    setEmailContent('');
    setEmailSubject('');
    setRecipientEmail('');
    setDocTitle('');
    setDocContent('');
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
              <Input 
                id="file" 
                type="file" 
                onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} 
                required 
              />
            </div>
          )}
          
          {serviceId.includes('gmail') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="recipient">To</Label>
                <Input 
                  id="recipient" 
                  type="email" 
                  value={recipientEmail} 
                  onChange={(e) => setRecipientEmail(e.target.value)} 
                  placeholder="recipient@example.com" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)} 
                  placeholder="Email subject" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Message</Label>
                <Textarea 
                  id="content" 
                  value={emailContent} 
                  onChange={(e) => setEmailContent(e.target.value)} 
                  placeholder="Type your message here..." 
                  rows={6} 
                  required 
                />
              </div>
            </>
          )}
          
          {serviceId.includes('docs') && (
            <>
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
              <div className="space-y-2">
                <Label htmlFor="docContent">Document Content</Label>
                <Textarea 
                  id="docContent" 
                  value={docContent} 
                  onChange={(e) => setDocContent(e.target.value)} 
                  placeholder="Start typing..." 
                  rows={8} 
                  required 
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {submitButtonText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
