
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlackScanOptions } from '@/utils/slack/types';

interface SensitivitySelectorProps {
  sensitivityLevel: SlackScanOptions['sensitivityLevel'];
  onChange: (value: SlackScanOptions['sensitivityLevel']) => void;
  disabled?: boolean;
}

const SensitivitySelector: React.FC<SensitivitySelectorProps> = ({
  sensitivityLevel,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label>Sensitivity Level</Label>
      <Select
        disabled={disabled}
        value={sensitivityLevel}
        onValueChange={onChange}
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
  );
};

export default SensitivitySelector;
