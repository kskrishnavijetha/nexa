import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistoricalReports } from '@/utils/historyService';
import { ComplianceReport } from '@/utils/types';
import { 
  calculateRiskDistribution,
  SpecificReportView,
  OverallRiskView,
  EmptyRiskView,
  RiskCount,
  RiskCategory
} from './risk';
import LoadingRiskView from './risk/LoadingRiskView';
import { useSelectedReport } from './context/SelectedReportContext';

interface RiskSummaryProps {
  selectedReport?: ComplianceReport | null;
}

const RiskSummary = ({ selectedReport: propSelectedReport }: RiskSummaryProps) => {
  const { user } = useAuth();
  const { selectedReport: contextSelectedReport } = useSelectedReport();
  const [riskData, setRiskData] = useState<RiskCount[]>([]);
  const [categoryData, setCategoryData] = useState<RiskCategory[]>([]);
  const [risks, setRisks] = useState<ComplianceReport['risks']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userReports, setUserReports] = useState<ComplianceReport[]>([]);
  
  const selectedReport = propSelectedReport || contextSelectedReport;
  
  useEffect(() => {
    const loadUserReports = () => {
      if (user?.id) {
        const reports = getUserHistoricalReports(user.id);
        setUserReports(reports);
      }
    };

    loadUserReports();
    
    const timer = setInterval(loadUserReports, 30000); // 30 seconds
    
    return () => clearInterval(timer);
  }, [user]);
  
  useEffect(() => {
    const calculateRisks = () => {
      setLoading(true);
      
      const result = calculateRiskDistribution(
        selectedReport,
        selectedReport ? null : userReports
      );
      
      setRiskData(result.riskData);
      setCategoryData(result.categoryData);
      setRisks(result.risks);
      setLoading(false);
    };
    
    calculateRisks();
  }, [selectedReport, userReports]);

  const hasRiskData = riskData.some(item => item.value > 0);
  
  if (loading) {
    return <LoadingRiskView />;
  }
  
  if (!hasRiskData) {
    return <EmptyRiskView />;
  }
  
  if (selectedReport) {
    return (
      <SpecificReportView
        selectedReport={selectedReport}
        riskData={riskData}
        categoryData={categoryData}
        risks={risks}
      />
    );
  }
  
  return (
    <OverallRiskView
      riskData={riskData}
      risks={risks}
    />
  );
};

export default RiskSummary;
