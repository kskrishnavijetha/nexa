
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RiskFilterControlProps {
  riskFilter: string;
  setRiskFilter: (value: string) => void;
}

const RiskFilterControl: React.FC<RiskFilterControlProps> = ({ 
  riskFilter, 
  setRiskFilter 
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Filter by Risk Level:</span>
      <Select value={riskFilter} onValueChange={setRiskFilter}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="All Risk Levels" />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-white">
          <SelectItem value="all">All Risk Levels</SelectItem>
          <SelectItem value="high">High Risk</SelectItem>
          <SelectItem value="medium">Medium Risk</SelectItem>
          <SelectItem value="low">Low Risk</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RiskFilterControl;
