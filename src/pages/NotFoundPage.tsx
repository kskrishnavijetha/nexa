
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <p className="text-2xl mb-8">Page not found</p>
      <Button onClick={() => navigate('/')}>
        Return to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
