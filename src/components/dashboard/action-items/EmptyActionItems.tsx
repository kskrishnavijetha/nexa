
import React from 'react';

const EmptyActionItems: React.FC = () => {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <p>No action items available.</p>
      <p className="text-xs mt-1">Perform document scans to generate action items.</p>
    </div>
  );
};

export default EmptyActionItems;
