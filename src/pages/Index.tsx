
import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComplianceFeatures from '@/components/ComplianceFeatures';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if URL contains payment
    if (location.pathname.includes('payment')) {
      setCurrentPage('payment');
    }
  }, [location]);
  
  const handleGetStarted = () => {
    // Handle the get started action
    console.log("Get started clicked");
    navigate('/document-analysis');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary mb-2">Trusted by 1000+ companies</p>
          <h1 className="font-bold mb-4 text-6xl text-gray-900">AI-Powered Compliance 
Monitoring  </h1>
          <p className="text-muted-foreground mb-8 text-xl">Automate your compliance monitoring with AI. Stay compliant with GDPR, HIPAA, SOC 2, and PCI-DSS regulations effortlessly.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" className="px-8" onClick={() => {
              // Navigate to document analysis page
              navigate('/document-analysis');
              console.log("Upload clicked");
            }}>
              Upload Document
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              navigate('/payment');
            }}>
              Pricing Plans
            </Button>
          </div>
        </div>
        
        <Hero onGetStarted={handleGetStarted} />
        <ComplianceFeatures />
        <Features />
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
