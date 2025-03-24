
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Features from '@/components/Features';
import ContactForm from '@/components/ContactForm';
import Hero from '@/components/home/Hero';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import ComplianceFeaturesSection from '@/components/home/ComplianceFeaturesSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import ResultsSection from '@/components/home/ResultsSection';
import TrustedBySection from '@/components/home/TrustedBySection';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const location = useLocation();
  
  useEffect(() => {
    // Check if URL contains payment
    if (location.pathname.includes('payment')) {
      setCurrentPage('payment');
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Hero />
        <WhyChooseSection />
        <ComplianceFeaturesSection />
        <IndustriesSection />
        <ResultsSection />
        <TrustedBySection />
        <Features />
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
