
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { SupportedLanguage } from '@/utils/language';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { useReportContext } from './hooks/useReportContext';

interface PreviewButtonProps {
  language?: SupportedLanguage;
}

const PreviewButton: React.FC<PreviewButtonProps> = ({ language = 'en' }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { report } = useReportContext();

  const getPreviewButtonLabel = (): string => {
    switch (language) {
      case 'es': return 'Vista Previa';
      case 'fr': return 'Aperçu';
      case 'de': return 'Vorschau';
      case 'zh': return '预览';
      default: return 'Preview';
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setPreviewOpen(true)}
        className="flex gap-2 items-center"
      >
        <Eye className="h-4 w-4" />
        {getPreviewButtonLabel()}
      </Button>

      {previewOpen && (
        <DocumentPreview 
          report={report}
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
};

export default PreviewButton;
