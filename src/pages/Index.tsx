
import React, { useEffect, useState } from 'react';
import Features from '@/components/Features';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Rocket, Award, BarChart } from 'lucide-react';

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

  const industries = [
    {
      name: "Finance & Banking",
      features: [
        "KYC & AML Compliance automation",
        "SOC 2 & PCI-DSS risk assessments",
        "Secure transaction monitoring"
      ]
    },
    {
      name: "Healthcare & Life Sciences",
      features: [
        "AI-driven HIPAA & FDA regulatory compliance",
        "Medical data security & risk checks",
        "Automated reporting for audits"
      ]
    },
    {
      name: "E-commerce & Retail",
      features: [
        "PCI-DSS compliance for online payments",
        "GDPR & CCPA user data protection",
        "Fraud detection & security audits"
      ]
    },
    {
      name: "SaaS & Tech Startups",
      features: [
        "SOC 2 & ISO 27001 readiness",
        "GDPR & CCPA compliance automation",
        "Cloud security & risk management"
      ]
    }
  ];

  const benefits = [
    "Reduce Compliance Costs by 50%",
    "Cut Manual Work by 90%",
    "Achieve Faster Compliance in Days, Not Months"
  ];

  const keyFeatures = [
    "AI-Powered Compliance Audits – Identify risks, missing policies & compliance gaps instantly.",
    "Automated Policy Generation – Generate & update compliance documents tailored to your industry.",
    "Real-Time Risk Monitoring – Get alerts before compliance violations happen.",
    "Smart Compliance Reporting – Auto-generate reports for regulators & audits.",
    "Seamless Integrations – Works with AWS, Azure, Salesforce, and more."
  ];
  
  const complianceFeatures = [
    {
      icon: <Check className="h-6 w-6 text-primary" />,
      title: "Risk Detection & Alerts",
      description: "AI finds compliance gaps & sends alerts"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Automated Reporting",
      description: "AI generates reports & audit logs"
    },
    {
      icon: <BarChart className="h-6 w-6 text-primary" />,
      title: "Enforcement Actions",
      description: "AI blocks risky actions & suggests fixes"
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Continuous Learning",
      description: "AI keeps updating based on new laws"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary mb-2">Trusted by 1000+ companies</p>
          <h1 className="font-bold mb-2 text-5xl md:text-6xl text-gray-900">
            🚀 CompliZen
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
            AI-Powered Compliance Automation
          </h2>
          <p className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Effortless Compliance. Maximum Security. Zero Hassle.
          </p>
          <p className="text-muted-foreground mb-8 text-lg">
            📌 Stay ahead of regulations like GDPR, HIPAA, SOC 2, and PCI-DSS with AI-driven automation. 
            Reduce compliance costs, minimize risks, and ensure full regulatory alignment—without the manual effort.
          </p>
          
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
        
        {/* Why Choose CompliZen Section */}
        <div className="my-16 text-center">
          <h2 className="text-3xl font-bold mb-8">🔍 Why Choose CompliZen?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border flex items-start">
                <div className="mr-4 mt-1 text-primary">✅</div>
                <p className="text-left text-gray-800">{feature}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl font-bold text-primary mt-10">
            🎯 100% Compliance, 90% Less Effort, 50% Lower Costs!
          </p>
        </div>
        
        {/* Compliance Features Section */}
        <div className="my-16 bg-gray-50 p-8 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Who Is CompliZen For Section */}
        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">💼 Who Is CompliZen For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-xl mb-4 text-primary">{industry.name}</h3>
                <ul className="space-y-2">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2">✔️</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Results with CompliZen Section */}
        <div className="my-16 bg-primary/5 p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-8">📈 Results with CompliZen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-4xl text-primary mb-4">✔️</div>
                <p className="text-xl font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trusted By Section */}
        <div className="my-16 text-center">
          <h2 className="text-2xl font-bold mb-4">🔗 Trusted by Industry Leaders</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">💼 Finance</span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">🏥 Healthcare</span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">🛒 E-commerce</span>
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">🌐 SaaS & Startups</span>
          </div>
          <p className="text-lg font-medium text-gray-700">
            📍 Enterprise-Grade Security | AI-Powered | Always Up-to-Date
          </p>
        </div>
        
        <Features />
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
