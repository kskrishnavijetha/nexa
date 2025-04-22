
import React from 'react';
import BrandingSettings from '@/components/settings/BrandingSettings';

const Settings: React.FC = () => {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="w-full">
        <BrandingSettings />
      </div>
    </div>
  );
};

export default Settings;
