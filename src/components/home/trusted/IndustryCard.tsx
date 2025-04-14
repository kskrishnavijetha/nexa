
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface IndustryCardProps {
  name: string;
  icon: React.ReactNode;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ name, icon }) => {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-4 flex items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <p className="font-medium text-gray-700">{name}</p>
      </CardContent>
    </Card>
  );
};

export default IndustryCard;
