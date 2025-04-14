
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Compliance Scanner</h1>
      <p className="mb-8">Scan your documents for compliance with various regulations.</p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/document-analysis')}>Document Analysis</Button>
        <Button variant="outline" onClick={() => navigate('/pricing')}>View Pricing</Button>
      </div>
    </div>
  );
};

export default Home;
