
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';

interface GoogleDocsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
}

const GoogleDocsDialog: React.FC<GoogleDocsDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dialogTitle,
  dialogDescription,
  submitButtonText,
}) => {
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { docTitle, file: docFile };
    onSubmit(formData);
    
    // Clear form
    setDocFile(null);
    setDocTitle('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <div className="border rounded-md p-4">
                <Input 
                  id="file" 
                  type="file" 
                  onChange={(e) => e.target.files && setDocFile(e.target.files[0])} 
                  accept=".doc,.docx,.pdf,.txt"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <img 
                    src="/lovable-uploads/b57d3b39-5331-4f30-8ccc-83a8e2a73f54.png" 
                    alt="Choose File" 
                    className="h-8 w-8 mb-2" 
                  />
                  <Label 
                    htmlFor="file" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                  >
                    Choose File
                  </Label>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {docFile ? docFile.name : 'No file chosen'}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input 
                id="title" 
                value={docTitle} 
                onChange={(e) => setDocTitle(e.target.value)} 
                placeholder="Untitled Document" 
                required={!docFile}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Scan className="h-4 w-4 mr-2" />
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleDocsDialog;
