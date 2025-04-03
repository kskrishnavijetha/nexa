
import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold mr-1">Error:</strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default ErrorDisplay;
