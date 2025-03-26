
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search } from 'lucide-react';
import { AnalysisDialogProps } from './types';

const AnalysisDialog: React.FC<AnalysisDialogProps> = ({
  serviceId,
  showDialog,
  setShowDialog,
  searchQuery,
  setSearchQuery,
  selectedContent,
  setSelectedContent,
  isAnalyzing,
  analysisResult,
  onAnalyze
}) => {
  const getAnalysisDialogTitle = () => {
    if (serviceId.includes('gmail')) {
      return 'Analyze Gmail Content';
    } else if (serviceId.includes('docs')) {
      return 'Analyze Google Docs';
    } else if (serviceId.includes('drive')) {
      return 'Analyze Drive Files';
    }
    return 'Analyze Content';
  };

  const getAnalysisDialogDescription = () => {
    if (serviceId.includes('gmail')) {
      return 'Search and analyze emails for compliance violations and sensitive information.';
    } else if (serviceId.includes('docs')) {
      return 'Check your documents for regulatory compliance issues and PII.';
    } else if (serviceId.includes('drive')) {
      return 'Scan your Drive files for compliance issues and security vulnerabilities.';
    }
    return 'Analyze your content for compliance.';
  };

  const getPlaceholderText = () => {
    if (serviceId.includes('gmail')) {
      return 'Search by sender, subject, or content...';
    } else if (serviceId.includes('docs')) {
      return 'Search documents by title or content...';
    } else if (serviceId.includes('drive')) {
      return 'Search files by name or content...';
    }
    return 'Search...';
  };

  const getContentSamplePlaceholder = () => {
    if (serviceId.includes('gmail')) {
      return 'Or paste email content to analyze...';
    } else if (serviceId.includes('docs')) {
      return 'Or paste document content to analyze...';
    } else if (serviceId.includes('drive')) {
      return 'Describe file contents to analyze...';
    }
    return 'Enter content to analyze...';
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getAnalysisDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getAnalysisDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onAnalyze} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="searchQuery" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder={getPlaceholderText()}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentSample">Content Sample</Label>
            <Textarea 
              id="contentSample" 
              value={selectedContent} 
              onChange={(e) => setSelectedContent(e.target.value)} 
              placeholder={getContentSamplePlaceholder()}
              rows={6} 
            />
          </div>
          
          {analysisResult && (
            <div className="p-4 bg-slate-50 border rounded-md text-sm whitespace-pre-line">
              <div className="font-semibold mb-2">Analysis Results:</div>
              {analysisResult}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
            <Button type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Run Analysis'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
