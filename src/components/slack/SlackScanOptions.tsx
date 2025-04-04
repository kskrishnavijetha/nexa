
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageCircle, Calendar, Shield } from 'lucide-react';
import { SlackScanOptions } from '@/utils/slack/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SupportedLanguage, supportedLanguages } from '@/utils/language';

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
  const [channelInput, setChannelInput] = React.useState('');
  
  const handleAddChannel = () => {
    if (channelInput.trim() && !options.channels.includes(channelInput.trim())) {
      const updatedChannels = [...options.channels, channelInput.trim()];
      onOptionsChange({ ...options, channels: updatedChannels });
      setChannelInput('');
    }
  };
  
  const handleRemoveChannel = (channel: string) => {
    const updatedChannels = options.channels.filter(c => c !== channel);
    onOptionsChange({ ...options, channels: updatedChannels });
  };
  
  const handleTimeRangeChange = (value: string) => {
    onOptionsChange({ 
      ...options, 
      timeRange: value as 'hour' | 'day' | 'week' | 'month' 
    });
  };
  
  const handleSensitivityChange = (value: string) => {
    onOptionsChange({ 
      ...options, 
      sensitivityLevel: value as 'strict' | 'standard' | 'relaxed' 
    });
  };
  
  const handleLanguageChange = (value: string) => {
    onOptionsChange({
      ...options,
      language: value as SupportedLanguage
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
          {/* Channels Configuration */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Channels to Monitor
            </Label>
            <div className="flex">
              <Input
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Enter channel name"
                disabled={disabled}
                className="mr-2"
              />
              <Button
                onClick={handleAddChannel}
                disabled={disabled || !channelInput.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
            {options.channels.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {options.channels.map((channel) => (
                  <div
                    key={channel}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    #{channel}
                    <button
                      onClick={() => handleRemoveChannel(channel)}
                      className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                      disabled={disabled}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">
                No channels selected. All accessible channels will be scanned.
              </p>
            )}
          </div>
          
          {/* Time Range Configuration */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Time Range
            </Label>
            <Select
              disabled={disabled}
              value={options.timeRange}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Last Hour</SelectItem>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Language Configuration */}
          <div className="space-y-2">
            <Label>Message Language</Label>
            <Select
              disabled={disabled}
              value={options.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sensitivity Level */}
          <div className="space-y-2">
            <Label>Sensitivity Level</Label>
            <Select
              disabled={disabled}
              value={options.sensitivityLevel}
              onValueChange={handleSensitivityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sensitivity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict (More Alerts)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="relaxed">Relaxed (Fewer Alerts)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlackScanOptionsComponent;
