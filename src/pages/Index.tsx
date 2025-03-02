
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary mb-2">Trusted by 1000+ companies</p>
          <h1 className="text-4xl font-bold mb-4">AI-Powered Compliance Monitoring</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Automate your compliance monitoring with AI. Stay compliant with GDPR, HIPAA, SOC 2, and PCI-DSS regulations effortlessly.
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
                navigate('/payment');
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
