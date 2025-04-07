
import React from 'react';

const LoadingRiskView: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-center">
        <div className="h-32 w-32 mx-auto rounded-full bg-slate-200 mb-4"></div>
        <div className="h-4 w-24 mx-auto bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};

export default LoadingRiskView;
