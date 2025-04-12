
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { SlackScanOptions } from '@/utils/slack/types';
import { ChannelSelector, TimeRangeSelector, SensitivitySelector } from './scan-options';

interface SlackScanOptionsProps {
  options: SlackScanOptions;
  onOptionsChange: (options: SlackScanOptions) => void;
  disabled?: boolean;
}

const SlackScanOptionsComponent: React.FC<SlackScanOptionsProps> = ({
  options,
  onOptionsChange,
  disabled = false
}) => {
  const handleAddChannel = (channel: string) => {
    if (!options.channels.includes(channel)) {
      const updatedChannels = [...options.channels, channel];
      onOptionsChange({ ...options, channels: updatedChannels });
    }
  };
  
  const handleRemoveChannel = (channel: string) => {
    const updatedChannels = options.channels.filter(c => c !== channel);
    onOptionsChange({ ...options, channels: updatedChannels });
  };
  
  const handleTimeRangeChange = (value: "hour" | "day" | "week" | "month") => {
    onOptionsChange({ 
      ...options, 
      timeRange: value 
    });
  };
  
  const handleSensitivityChange = (value: "strict" | "standard" | "relaxed") => {
    onOptionsChange({ 
      ...options, 
      sensitivityLevel: value 
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Scan Configuration
        </CardTitle>
        <CardDescription>
          Configure the scanning options for Slack messages and file uploads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ChannelSelector 
            channels={options.channels}
            onAddChannel={handleAddChannel}
            onRemoveChannel={handleRemoveChannel}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SlackScanOptionsComponent;
