
import React from 'react';
import SlackMonitor from '@/components/slack/SlackMonitor';
import { Helmet } from 'react-helmet';

const SlackMonitoringPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Slack Monitoring | Compliance Scanner</title>
      </Helmet>
      
      <SlackMonitor />
    </div>
  );
};

export default SlackMonitoringPage;
