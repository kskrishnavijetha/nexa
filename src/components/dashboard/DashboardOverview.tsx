
import React, { useState, useEffect } from 'react';
import ChartsSection from './ChartsSection';
import BottomSection from './BottomSection';
import StatisticsCards from './StatisticsCards';
import { useAuth } from '@/contexts/AuthContext';
import { loadDashboardData, DashboardData } from '@/services/dashboardService';
import IvorynthAICard from './IvorynthAICard';
import StandUpGenieCard from './StandUpGenieCard';

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    complianceScore: 0,
    documentsScanned: 0,
    criticalIssues: 0,
    resolvedItems: 0,
    complianceChange: 0,
    recentScans: 0,
  });
  const [hasData, setHasData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await loadDashboardData(user);
        setDashboardData(data);
        // If we have at least one document scanned, we consider that we have data
        setHasData(data.documentsScanned > 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      </div>
      <StatisticsCards dashboardData={dashboardData} hasData={hasData} />
      
      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StandUpGenieCard />
        <IvorynthAICard />
      </div>
      
      <ChartsSection />
      <div id="dashboard-bottom-section">
        <BottomSection />
      </div>
    </div>
  );
};

export default DashboardOverview;
