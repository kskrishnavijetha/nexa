
import React from 'react';
import StandUpGenie from '@/components/standup/StandUpGenie';

const StandUpGeniePage = () => {
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">StandUp Genie</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered daily standup generation from your development activity
        </p>
      </div>
      
      <StandUpGenie />
    </div>
  );
};

export default StandUpGeniePage;
