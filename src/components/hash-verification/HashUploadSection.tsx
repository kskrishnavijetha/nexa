
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import HashFileUploader from './HashFileUploader';
import { toast } from 'sonner';

interface HashUploadSectionProps {
  file: File | null;
  computedHash: string;
  onFileSelect: (file: File) => void;
}

const HashUploadSection: React.FC<HashUploadSectionProps> = ({ 
  file, 
  computedHash, 
  onFileSelect 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="mr-2" />
          File Upload
        </h2>
        <HashFileUploader 
          onFileSelect={onFileSelect}
          file={file}
        />
        
        {computedHash && (
          <div className="mt-6">
            <Label htmlFor="computed-hash" className="mb-2 block">Computed Document Hash (SHA-256)</Label>
            <div className="flex space-x-2">
              <Input 
                id="computed-hash"
                value={computedHash}
                className="font-mono text-sm bg-slate-50"
                readOnly
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(computedHash);
                  toast.success('Hash copied to clipboard');
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HashUploadSection;
