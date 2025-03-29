
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const benefits = [
  "Reduce Compliance Costs by 50%",
  "Cut Manual Work by 90%",
  "Achieve Faster Compliance in Minutes, Not Days and Months"
];

const ResultsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleTryDocuments = () => {
    navigate('/document-analysis');
  };

  return (
    <div className="my-16 bg-primary/5 p-8 rounded-xl text-center">
      <h2 className="text-3xl font-bold mb-8">📈 Results with CompliZen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="text-4xl text-primary mb-4">✔️</div>
            <p className="text-xl font-medium">{benefit}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleTryDocuments} 
          className="text-lg px-8 py-6 h-auto"
          size="lg"
        >
          Try with your documents
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
