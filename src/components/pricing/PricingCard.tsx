
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
  highlighted?: boolean;
  onSelectPlan: () => void;
  buttonText: string;
  buttonDisabled?: boolean;
  buttonVariant?: 'default' | 'outline' | 'secondary';
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  price,
  features,
  isRecommended = false,
  highlighted = false,
  onSelectPlan,
  buttonText,
  buttonDisabled = false,
  buttonVariant = 'default'
}) => {
  return (
    <Card className={`flex flex-col ${isRecommended 
      ? 'border-primary bg-primary/5 hover:bg-primary/10' 
      : highlighted 
        ? 'border-amber-400 bg-amber-50/50 hover:bg-amber-50'
        : 'border-border hover:border-primary/50'} transition-colors`}
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
          disabled={buttonDisabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
