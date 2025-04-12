
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FeatureList from './FeatureList';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
  onSelectPlan: () => void;
  buttonText: string;
  buttonVariant?: 'default' | 'outline';
  disabled?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  isRecommended = false,
  onSelectPlan,
  buttonText,
  buttonVariant = 'default',
  disabled = false
}) => {
  return (
    <Card className={`flex flex-col ${isRecommended 
      ? 'border-primary bg-primary/5 hover:bg-primary/10' 
      : 'border-border hover:border-primary/50'} ${disabled ? 'opacity-70' : ''} transition-colors`}
    >
      {isRecommended && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Recommended
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <FeatureList features={features} highlight={isRecommended} />
      </CardContent>
      <CardFooter>
        <Button 
          variant={buttonVariant} 
          className="w-full"
          onClick={onSelectPlan}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
