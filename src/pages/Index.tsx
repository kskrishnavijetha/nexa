
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import Payment from './Payment';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Check if URL contains payment
    if (window.location.pathname.includes('payment')) {
      setCurrentPage('payment');
    }
  }, []);

  const handleGetStarted = () => {
    // Handle the get started action
    console.log("Get started clicked");
    // You might want to navigate to a specific page or open a modal here
  };

  if (currentPage === 'payment') {
    return <Payment />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">AI-Powered Compliance Checker</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Automatically analyze your documents for GDPR, HIPAA, and SOC2 compliance
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="px-8"
              onClick={() => {
                // Navigate to upload page or open upload modal
                console.log("Upload clicked");
              }}
            >
              Upload Document
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                window.location.href = "/payment";
                setCurrentPage('payment');
              }}
            >
              Pricing Plans
            </Button>
          </div>
        </div>
        
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
