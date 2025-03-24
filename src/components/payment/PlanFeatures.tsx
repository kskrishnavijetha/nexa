
import React from 'react';
import FeatureList from './FeatureList';

const PlanFeatures: React.FC = () => {
  // Feature lists for each tier
  const freeFeatures = [
    "1 compliance scan per month",
    "Basic GDPR compliance check",
    "Basic PDF report",
    "Community support"
  ];
  
  const basicFeatures = [
    "10 compliance scans per month",
    "Basic GDPR, HIPAA, and SOC2 compliance checks",
    "Downloadable PDF reports",
    "Email support"
  ];
  
  const proFeatures = [
    "50 compliance scans per month",
    "Advanced compliance analysis for all regulations",
    "Detailed risk analysis with severity ratings",
    "AI-powered recommendations",
    "Priority email support"
  ];
  
  const enterpriseFeatures = [
    "Unlimited compliance scans",
    "Comprehensive compliance analysis for all regulations",
    "Custom compliance templates",
    "Advanced AI-powered suggestions",
    "Dedicated account manager",
    "24/7 priority support"
  ];

  return (
    <div className="space-y-6">
      <FeatureList 
        title="Free Plan" 
        features={freeFeatures} 
      />
      
      <FeatureList 
        title="Basic Plan" 
        price="$29/month" 
        features={basicFeatures} 
      />
      
      <FeatureList 
        title="Pro Plan" 
        price="$99/month" 
        features={proFeatures} 
      />
      
      <FeatureList 
        title="Enterprise Plan" 
        price="$299/month" 
        features={enterpriseFeatures} 
      />
    </div>
  );
};

export default PlanFeatures;
