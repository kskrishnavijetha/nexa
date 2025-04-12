
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SlackScanOptions } from '@/utils/slack/types';

interface FileTypesSelectorProps {
  includeAttachments: boolean; 
  onToggleAttachments: (checked: boolean) => void;
  disabled?: boolean;
}

const FileTypesSelector: React.FC<FileTypesSelectorProps> = ({
  includeAttachments,
  onToggleAttachments,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label>File Types</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="include-attachments" 
            checked={includeAttachments} 
            onCheckedChange={onToggleAttachments}
            disabled={disabled}
          />
          <Label htmlFor="include-attachments" className="font-normal">
            Include message attachments
          </Label>
        </div>
      </div>
    </div>
  );
};

export default FileTypesSelector;
