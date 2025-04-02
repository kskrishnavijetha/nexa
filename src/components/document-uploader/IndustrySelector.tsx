
import React from 'react';
import { Industry, INDUSTRY_REGULATIONS } from '@/utils/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IndustrySelectorProps {
  industry: Industry | undefined;
  setIndustry: (industry: Industry) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industry,
  setIndustry,
}) => {
  return (
    <div className="w-full mt-4">
      <label className="text-sm font-medium mb-1 block">Select Industry</label>
      <Select value={industry} onValueChange={(value) => setIndustry(value as Industry)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an industry" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(INDUSTRY_REGULATIONS).map((ind) => (
            <SelectItem key={ind} value={ind}>
              {ind}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Industry selection determines applicable regulations and compliance requirements
      </p>
    </div>
  );
};

export default IndustrySelector;
