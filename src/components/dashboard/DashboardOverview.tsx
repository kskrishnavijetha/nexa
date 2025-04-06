
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatisticsCards from '@/components/dashboard/StatisticsCards';
import ChartsSection from '@/components/dashboard/ChartsSection';
import BottomSection from '@/components/dashboard/BottomSection';
import { loadDashboardData, DashboardData } from '@/services/dashboardService';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    complianceScore: 0,
    documentsScanned: 0,
    criticalIssues: 0,
    resolvedItems: 0,
    complianceChange: 0,
    recentScans: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const data = await loadDashboardData(user);
      setDashboardData(data);
    };

    fetchDashboardData();
  }, [user]);

  const hasData = dashboardData.documentsScanned > 0;

  return (
    <div className="space-y-4">
      <StatisticsCards dashboardData={dashboardData} hasData={hasData} />
      <ChartsSection />
      <BottomSection />
    </div>
  );
};

export default DashboardOverview;
