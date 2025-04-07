
import React from 'react';
import ChartsSection from './ChartsSection';
import BottomSection from './BottomSection';
import StatisticsCards from './StatisticsCards';

const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-4">
      <StatisticsCards />
      <ChartsSection />
      <div id="dashboard-bottom-section">
        <BottomSection />
      </div>
    </div>
  );
};

export default DashboardOverview;
