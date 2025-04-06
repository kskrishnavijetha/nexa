
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Features from '@/components/Features';
import Hero from '@/components/home/Hero';
import WhyChooseSection from '@/components/home/WhyChooseSection';
import ComplianceFeaturesSection from '@/components/home/ComplianceFeaturesSection';
import IndustriesSection from '@/components/home/IndustriesSection';
import ResultsSection from '@/components/home/ResultsSection';
import UserGuide from '@/components/home/UserGuide';
import Layout from '@/components/layout/Layout';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Hero />
          <WhyChooseSection />
          <ComplianceFeaturesSection />
          <IndustriesSection />
          <ResultsSection />
          <UserGuide />
          <Features />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
