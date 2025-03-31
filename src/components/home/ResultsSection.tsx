
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const benefits = [
  {
    title: "Reduce Compliance Costs by 50%",
    details: "Our AI-powered platform analyzes your compliance processes and identifies cost-saving opportunities, resulting in an average 50% reduction in compliance-related expenses."
  },
  {
    title: "Cut Manual Work by 90%",
    details: "Automate document review, risk assessment, and compliance monitoring tasks that previously required hours of manual effort, freeing your team to focus on strategic initiatives."
  },
  {
    title: "Achieve Faster Compliance in Minutes, Not Days and Months",
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
    <div className="my-16 bg-primary/5 p-8 rounded-xl">
      <div className="flex items-center justify-center mb-4">
        <img 
          src="/public/lovable-uploads/b96b3f45-8a1a-40d5-b884-1142753be402.png" 
          alt="CompliZen Logo" 
          className="h-8 w-8 mr-2"
          style={{ backgroundColor: 'transparent' }}
        />
        <h2 className="text-3xl font-bold">Results with CompliZen</h2>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        Our customers achieve significant improvements in their compliance processes. Here's what you can expect:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col">
            <div className="flex items-start mb-4">
              <CheckCircle className="text-primary shrink-0 mt-1" size={24} />
              <h3 className="text-xl font-medium ml-3">{benefit.title}</h3>
            </div>
            
            {expandedItems.includes(index) && (
              <p className="text-gray-600 mt-2 mb-4">{benefit.details}</p>
            )}
            
            <button 
              onClick={() => toggleItem(index)}
              className="text-primary flex items-center mt-auto self-start hover:underline"
            >
              Learn more {expandedItems.includes(index) ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
