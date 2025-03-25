
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DocumentHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Document Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload a document to analyze compliance with various industry regulations
        </p>
      </div>
    </>
  );
};

export default DocumentHeader;
