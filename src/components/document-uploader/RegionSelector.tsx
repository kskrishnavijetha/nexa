
import React from 'react';
import { Region, REGION_REGULATIONS } from '@/utils/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegionSelectorProps {
  region: Region | undefined;
  setRegion: (region: Region) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  region,
  setRegion,
}) => {
  return (
    <div className="w-full mt-4">
      <label className="text-sm font-medium mb-1 block">Select Region</label>
      <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a geographic region" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(REGION_REGULATIONS).map((reg) => (
            <SelectItem key={reg} value={reg}>
              {reg}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Region-specific compliance frameworks will be applied
      </p>
    </div>
  );
};

export default RegionSelector;
