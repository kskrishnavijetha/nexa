
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RiskFilterControl from './RiskFilterControl';

interface DashboardHeaderProps {
  riskFilter: string;
  setRiskFilter: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  riskFilter, 
  setRiskFilter 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Recent Compliance Scans</h2>
      <div className="flex items-center gap-4">
        <RiskFilterControl 
          riskFilter={riskFilter} 
          setRiskFilter={setRiskFilter} 
        />
        <Button onClick={() => navigate('/history')}>View History</Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
