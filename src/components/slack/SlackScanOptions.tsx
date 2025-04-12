
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { SlackScanOptions as SlackScanOptionsType } from '@/utils/slack/types';
import { SupportedLanguage } from '@/utils/language';
import { 
  ChannelSelector, 
  TimeRangeSelector, 
  SensitivitySelector,
  FileTypesSelector
} from './scan-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SlackScanOptionsProps {
  options: SlackScanOptionsType;
  onOptionsChange: (options: SlackScanOptionsType) => void;
  disabled?: boolean;
}

const SlackScanOptions: React.FC<SlackScanOptionsProps> = ({
  options,
  onOptionsChange,
  disabled = false
}) => {
  const handleChannelChange = (channels: string[]) => {
    onOptionsChange({ ...options, channels });
  };

  const handleTimeRangeChange = (timeRange: SlackScanOptionsType['timeRange']) => {
    onOptionsChange({ ...options, timeRange });
  };

  const handleSensitivityChange = (sensitivityLevel: SlackScanOptionsType['sensitivityLevel']) => {
    onOptionsChange({ ...options, sensitivityLevel });
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    onOptionsChange({ ...options, language });
  };

  const handleIncludeAttachmentsChange = (checked: boolean) => {
    onOptionsChange({ ...options, includeAttachments: checked });
  };

  const handleGenerateAuditTrailChange = (checked: boolean) => {
    onOptionsChange({ ...options, generateAuditTrail: checked });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ChannelSelector 
            channels={options.channels}
            onChange={handleChannelChange}
            disabled={disabled}
          />
          
          <TimeRangeSelector 
            timeRange={options.timeRange}
            onChange={handleTimeRangeChange}
            disabled={disabled}
          />
          
          <SensitivitySelector 
            sensitivityLevel={options.sensitivityLevel}
            onChange={handleSensitivityChange}
            disabled={disabled}
          />

          <FileTypesSelector
            includeAttachments={options.includeAttachments || false}
            onToggleAttachments={handleIncludeAttachmentsChange}
            disabled={disabled}
          />

          <div className="space-y-2">
            <Label>Audit Trail</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="generate-audit-trail" 
                checked={options.generateAuditTrail} 
                onCheckedChange={handleGenerateAuditTrailChange}
                disabled={disabled}
              />
              <Label htmlFor="generate-audit-trail" className="font-normal">
                Generate audit trail for compliance records
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlackScanOptions;
