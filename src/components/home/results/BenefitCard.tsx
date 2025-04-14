
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  details: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
          </div>
          
          {expanded && (
            <p className="text-muted-foreground mb-4">{details}</p>
          )}
          
          <button 
            onClick={() => setExpanded(prev => !prev)}
            className="text-primary flex items-center mt-auto self-start hover:underline"
          >
            {expanded ? (
              <>Hide details <ChevronUp size={16} className="ml-1" /></>
            ) : (
              <>Learn more <ChevronDown size={16} className="ml-1" /></>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
