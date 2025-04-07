
import React from 'react';
import { RiskCategory } from './types';

interface RiskCategoryListProps {
  categoryData: RiskCategory[];
  limit?: number;
}

const RiskCategoryList: React.FC<RiskCategoryListProps> = ({ 
  categoryData, 
  limit = 4
}) => {
  if (categoryData.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-1 text-xs mt-2">
      {categoryData.slice(0, limit).map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-2 h-2 mr-1 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="truncate">{item.category}: {item.count}</span>
        </div>
      ))}
    </div>
  );
};

export default RiskCategoryList;
