
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface IndustryCardProps {
  name: string;
  icon: React.ReactNode;
  features: string[];
}

const IndustryCard: React.FC<IndustryCardProps> = ({ name, icon, features }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-primary">{name}</h3>
        </div>
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default IndustryCard;
