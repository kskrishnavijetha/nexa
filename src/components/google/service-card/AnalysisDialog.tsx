
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Industry, INDUSTRIES, Region, REGIONS } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

interface AnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalyze: (industry?: Industry, language?: SupportedLanguage, region?: Region) => void;
  serviceType?: 'sharepoint' | 'outlook' | 'teams';
  title?: string;
  description?: string;
}

const AnalysisDialog: React.FC<AnalysisDialogProps> = ({
  open,
  onOpenChange,
  onAnalyze,
  serviceType,
  title = 'Analyze Service',
  description = 'Scan this service for compliance issues'
}) => {
  const [industry, setIndustry] = useState<Industry>();
  const [region, setRegion] = useState<Region>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get service-specific description
  const getServiceDescription = () => {
    if (serviceType === 'sharepoint') {
      return 'Scan SharePoint sites and documents for compliance issues';
    } else if (serviceType === 'outlook') {
      return 'Analyze Outlook emails for sensitive information and compliance violations';
    } else if (serviceType === 'teams') {
      return 'Scan Teams messages and channels for PII and regulatory compliance';
    }
    return description;
  };

  const handleAnalyze = async () => {
    if (!industry) return;
    
    setIsAnalyzing(true);
    await onAnalyze(industry, undefined, region);
    setIsAnalyzing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {getServiceDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value as Industry)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(INDUSTRIES).map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {INDUSTRIES[ind as Industry]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Region (Optional)</Label>
            <Select
              value={region}
              onValueChange={(value) => setRegion(value as Region)}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(REGIONS).map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {REGIONS[reg as Region]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleAnalyze}
            disabled={!industry || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Analysis'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
