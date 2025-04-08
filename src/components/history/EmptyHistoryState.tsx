
import React from 'react';

const EmptyHistoryState: React.FC = () => {
  return (
    <div className="mt-10 text-center p-10 border rounded-lg bg-slate-50">
      <h3 className="text-xl font-medium text-slate-700">No compliance reports found</h3>
      <p className="mt-2 text-slate-500">Upload and analyze documents to see them here</p>
    </div>
  );
};

export default EmptyHistoryState;
