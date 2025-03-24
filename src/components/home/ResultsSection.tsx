
import React from 'react';

const benefits = [
  "Reduce Compliance Costs by 50%",
  "Cut Manual Work by 90%",
  "Achieve Faster Compliance in Days, Not Months"
];

const ResultsSection: React.FC = () => {
  return (
    <div className="my-16 bg-primary/5 p-8 rounded-xl text-center">
      <h2 className="text-3xl font-bold mb-8">📈 Results with CompliZen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-4xl text-primary mb-4">✔️</div>
            <p className="text-xl font-medium">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
