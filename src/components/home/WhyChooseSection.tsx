
import React from 'react';

const keyFeatures = [
  "AI-Powered Compliance Audits – Identify risks, missing policies & compliance gaps instantly.",
  "Automated Policy Generation – Generate & update compliance documents tailored to your industry.",
  "Real-Time Risk Monitoring – Get alerts before compliance violations happen.",
  "Smart Compliance Reporting – Auto-generate reports for regulators & audits.",
  "Seamless Integrations – Works with AWS, Azure, Salesforce, and more."
];

const WhyChooseSection: React.FC = () => {
  return (
    <div className="my-16 text-center">
      <h2 className="text-3xl font-bold mb-8">🔍 Why Choose Nexabloom?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {keyFeatures.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex items-start">
            <div className="mr-4 mt-1 text-primary">✅</div>
            <p className="text-left text-gray-800">{feature}</p>
          </div>
        ))}
      </div>
      <p className="text-2xl font-bold text-primary mt-10">
        🎯 100% Compliance, 90% Less Effort, 50% Lower Costs!
      </p>
    </div>
  );
};

export default WhyChooseSection;
