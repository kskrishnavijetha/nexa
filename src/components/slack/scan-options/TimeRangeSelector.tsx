
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { SlackScanOptions } from '@/utils/slack/types';

interface TimeRangeSelectorProps {
  timeRange: SlackScanOptions['timeRange'];
  onChange: (value: SlackScanOptions['timeRange']) => void;
  disabled?: boolean;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        Time Range
      </Label>
      <Select
        disabled={disabled}
        value={timeRange}
        onValueChange={onChange}
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
  );
};

export default TimeRangeSelector;
