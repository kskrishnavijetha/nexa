
import React from 'react';

const TrustedBySection: React.FC = () => {
  return (
    <div className="my-16 text-center">
      <h2 className="text-2xl font-bold mb-4">🔗 Trusted by Industry Leaders</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">💼 Finance</span>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">🏥 Healthcare</span>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">🛒 E-commerce</span>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">🌐 SaaS & Startups</span>
      </div>
      <p className="text-lg font-medium text-gray-700">
        📍 Enterprise-Grade Security | AI-Powered | Always Up-to-Date
      </p>
    </div>
  );
};

export default TrustedBySection;
