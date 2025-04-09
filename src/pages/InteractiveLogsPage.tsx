
import React from 'react';
import { Helmet } from 'react-helmet';
import InteractiveLogs from '../components/logs/InteractiveLogs';

const InteractiveLogsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Interactive Logs | Nexabloom</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Interactive Logs</h1>
      <InteractiveLogs />
    </div>
  );
};

export default InteractiveLogsPage;
