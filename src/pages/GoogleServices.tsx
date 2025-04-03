
import React, { useState } from 'react';
import GoogleServicesPage from '@/components/GoogleServicesPage';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';

const GoogleServices: React.FC = () => {
  // Use the Google authorization hook
  useGoogleAuth();
  
  return <GoogleServicesPage />;
};

export default GoogleServices;
