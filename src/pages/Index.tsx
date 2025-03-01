import React, { useState } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ContactForm from '@/components/ContactForm';
import DocumentUploader from '@/components/DocumentUploader';
import ComplianceReport from '@/components/ComplianceReport';
import { Button } from '@/components/ui/button';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';

const Index = () => {
  const [view, setView] = useState<'landing' | 'uploader' | 'report'>('landing');
  const [report, setReport] = useState<ComplianceReportType | null>(null);

  const handleGetStarted = () => {
    setView('uploader');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportGenerated = (reportId: string) => {
    // In a real app, we would fetch the report based on the ID
    // For now, we'll use the mock data from the API service
    
    const mockReport: ComplianceReportType = {
      documentId: reportId,
      documentName: 'Privacy Policy.pdf',
      overallScore: 74,
      gdprScore: 68,
      hipaaScore: 82,
      soc2Score: 76,
      risks: [
        {
          description: 'Personal data storage duration not specified',
          severity: 'medium',
          regulation: 'GDPR',
          section: 'Article 5'
        },
        {
          description: 'No clear process for data subject access requests',
          severity: 'high',
          regulation: 'GDPR',
          section: 'Article 15'
        },
        {
          description: 'Insufficient details on physical safeguards',
          severity: 'medium',
          regulation: 'HIPAA',
          section: '164.310'
        },
        {
          description: 'Access control policy needs enhancement',
          severity: 'low',
          regulation: 'SOC2',
          section: 'CC6.1'
        },
        {
          description: 'Missing data encryption requirements',
          severity: 'high',
          regulation: 'HIPAA',
          section: '164.312(a)(2)(iv)'
        }
      ],
      summary: 'This document has several compliance areas that need improvement. The most critical issues relate to GDPR data subject rights and HIPAA data encryption requirements.',
      timestamp: new Date().toISOString()
    };
    
    setReport(mockReport);
    setView('report');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseReport = () => {
    setView('uploader');
    setReport(null);
  };

  const renderLanding = () => (
    <>
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <ContactForm />
    </>
  );

  const renderUploader = () => (
    <div className="container px-4 py-10 md:py-16 mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Upload Your Document
        </h1>
        <p className="text-muted-foreground">
          Select a document to analyze for GDPR, HIPAA, and SOC 2 compliance.
          We support PDF, DOCX, and TXT files up to 10MB.
        </p>
      </div>
      
      <DocumentUploader onReportGenerated={handleReportGenerated} />
    </div>
  );

  const renderReport = () => (
    <div className="container px-4 py-10 md:py-16 mx-auto">
      {report && <ComplianceReport report={report} onClose={handleCloseReport} />}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex justify-between items-center h-16 px-4 mx-auto">
          <div className="flex items-center">
            <span className="text-xl font-bold">ComplianceNinja</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact Us
            </a>
            <button 
              onClick={handleGetStarted}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Upload Document
            </button>
          </nav>
          
          <Button 
            onClick={handleGetStarted}
            className="md:hidden"
            variant="outline"
            size="sm"
          >
            Get Started
          </Button>
        </div>
      </header>
      
      <main className="flex-1">
        {view === 'landing' && renderLanding()}
        {view === 'uploader' && renderUploader()}
        {view === 'report' && renderReport()}
      </main>
      
      <footer className="bg-muted/50 py-6">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2023 ComplianceNinja. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
