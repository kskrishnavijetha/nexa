
import React from 'react';

const industries = [
  {
    name: "Finance & Banking",
    features: [
      "KYC & AML Compliance automation",
      "SOC 2 & PCI-DSS risk assessments",
      "Secure transaction monitoring"
    ]
  },
  {
    name: "Healthcare",
    features: [
      "AI-driven HIPAA & FDA regulatory compliance",
      "Medical data security & risk checks",
      "Automated reporting for audits"
    ]
  },
  {
    name: "E-commerce & Retail",
    features: [
      "PCI-DSS compliance for online payments",
      "GDPR & CCPA user data protection",
      "Fraud detection & security audits"
    ]
  },
  {
    name: "Cloud & SaaS",
    features: [
      "SOC 2 & ISO 27001 readiness",
      "GDPR & CCPA compliance automation",
      "Cloud security & risk management"
    ]
  }
];

const IndustriesSection: React.FC = () => {
  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold mb-8 text-center">💼 Who Is CompliZen For?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map((industry, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-xl mb-4 text-primary">{industry.name}</h3>
            <ul className="space-y-2">
              {industry.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">✔️</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustriesSection;
