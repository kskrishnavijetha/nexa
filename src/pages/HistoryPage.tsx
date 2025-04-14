
import React from 'react';
import HistoryContainer from '@/components/history/HistoryContainer';

const HistoryPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Scan History</h1>
      <HistoryContainer />
    </div>
  );
};

export default HistoryPage;
