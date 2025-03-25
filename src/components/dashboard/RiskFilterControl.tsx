
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface RiskFilterControlProps {
  riskFilter: string;
  setRiskFilter: (value: string) => void;
}

const RiskFilterControl: React.FC<RiskFilterControlProps> = ({ 
  riskFilter, 
  setRiskFilter 
}) => {
  const navigate = useNavigate();
  
  const handleViewAllByRisk = () => {
    // Navigate to history page with current risk filter
    if (riskFilter !== 'all') {
      navigate(`/history?riskLevel=${riskFilter}`);
    } else {
      navigate('/history');
    }
  };
  
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
      <Button 
        variant="link" 
        size="sm" 
        onClick={handleViewAllByRisk}
        className="text-primary"
      >
        View All
      </Button>
    </div>
  );
};

export default RiskFilterControl;
