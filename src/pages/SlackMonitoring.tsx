
import React from 'react';
import SlackMonitor from '@/components/slack/SlackMonitor';
import { Helmet } from 'react-helmet';

const SlackMonitoringPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Slack Monitoring | Nexabloom</title>
        <meta name="description" content="Real-time monitoring of Slack messages for compliance violations" />
      </Helmet>
      
      <SlackMonitor />
    </div>
  );
};

export default SlackMonitoringPage;
