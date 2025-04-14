
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  return (
    <div 
      className="rounded-xl p-6 border bg-card transition-all duration-300 hover:shadow-soft animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="rounded-lg inline-flex items-center justify-center p-3 bg-primary/5 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
