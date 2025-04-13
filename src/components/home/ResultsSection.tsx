
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, BarChart, TrendingDown, Clock } from 'lucide-react';

const benefits = [
  {
    icon: <TrendingDown className="h-8 w-8 text-primary" />,
    title: "Reduce Compliance Costs by 50%",
    details: "Our AI-powered platform analyzes your compliance processes and identifies cost-saving opportunities, resulting in an average 50% reduction in compliance-related expenses."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Cut Manual Work by 90%",
    details: "Automate document review, risk assessment, and compliance monitoring tasks that previously required hours of manual effort, freeing your team to focus on strategic initiatives."
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Faster Compliance in Minutes, Not Months",
    details: "Real-time scanning and analysis allows you to assess compliance status instantly, dramatically reducing the time required to identify and address potential issues."
  }
];

const ResultsSection: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Results with Nexabloom</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our customers achieve significant improvements in their compliance processes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  </div>
                  
                  {expandedItems.includes(index) && (
                    <p className="text-muted-foreground mb-4">{benefit.details}</p>
                  )}
                  
                  <button 
                    onClick={() => toggleItem(index)}
                    className="text-primary flex items-center mt-auto self-start hover:underline"
                  >
                    {expandedItems.includes(index) ? (
                      <>Hide details <ChevronUp size={16} className="ml-1" /></>
                    ) : (
                      <>Learn more <ChevronDown size={16} className="ml-1" /></>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
