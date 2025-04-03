
import React from 'react';
import { Check } from 'lucide-react';

const NoViolationsFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4 rounded-md bg-green-50 text-green-700">
      <Check className="h-5 w-5 mr-2" />
      <span>No compliance issues found</span>
    </div>
  );
};

export default NoViolationsFound;
