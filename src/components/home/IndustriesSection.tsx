import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Briefcase, Stethoscope, Building2, ShieldCheck, Factory, Truck, FileText, LandPlot, Microscope, Hospital, Rocket, Cloud, Lock, ShoppingBag, Shield } from 'lucide-react';

const industries = [
  {
    name: "Healthcare",
    icon: <Hospital className="h-6 w-6" />,
    features: [
      "AI-driven HIPAA compliance automation",
      "Protected health information safeguards",
      "Medical records security assessment",
      "Real-time compliance monitoring"
    ]
  },
  {
    name: "Pharmaceutical & Biotech",
    icon: <Microscope className="h-6 w-6" />,
    features: [
      "FDA compliance management",
      "GxP validation and documentation",
      "Clinical trial data protection",
      "Regulatory submission readiness"
    ]
  },
  {
    name: "Finance & Banking",
    icon: <Briefcase className="h-6 w-6" />,
    features: [
      "KYC & AML Compliance automation",
      "SOC 2 & PCI-DSS risk assessments",
      "Secure transaction monitoring",
      "Financial fraud prevention"
    ]
  },
  {
    name: "SaaS & Startups",
    icon: <Rocket className="h-6 w-6" />,
    features: [
      "SOC 2 & ISO 27001 certification readiness",
      "GDPR & CCPA compliance frameworks",
      "Data privacy by design implementation",
      "Scalable security infrastructure"
    ]
  },
  {
    name: "E-commerce",
    icon: <ShoppingBag className="h-6 w-6" />,
    features: [
      "PCI-DSS compliance automation",
      "Customer data protection framework",
      "Secure payment processing validation",
      "GDPR & CCPA implementation"
    ]
  },
  {
    name: "Manufacturing",
    icon: <Factory className="h-6 w-6" />,
    features: [
      "Supply chain compliance management",
      "Industrial IoT security framework",
      "Quality management system validation",
      "Regulatory reporting automation"
    ]
  },
  {
    name: "Insurance",
    icon: <Shield className="h-6 w-6" />,
    features: [
      "Customer data protection compliance",
      "Claims processing security verification",
      "Underwriting data integrity monitoring",
      "Regulatory reporting automation"
    ]
  },
  {
    name: "Government & Defense",
    icon: <ShieldCheck className="h-6 w-6" />,
    features: [
      "FISMA compliance automation",
      "Classified information handling",
      "Records management compliance"
    ]
  }
];

const IndustriesSection: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Industry-Specific Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tailored compliance solutions for your industry's unique requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((industry, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{industry.name}</h3>
                </div>
                <ul className="space-y-3">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Healthcare focus section */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-primary">Healthcare Compliance Excellence</h3>
              <p className="mb-4 text-gray-700">
                Our specialized healthcare compliance solutions address the unique challenges faced by healthcare providers, 
                ensuring patient data security and regulatory compliance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">HIPAA Risk Assessment & Remediation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Patient Privacy Protection Framework</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Electronic Health Record Security Analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Medical Device Compliance Verification</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Healthcare Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pharmaceutical & Biotech focus section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1579165466949-3180a3d056d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Pharmaceutical Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 text-primary">Pharma & Biotech Compliance</h3>
              <p className="mb-4 text-gray-700">
                Navigate complex regulatory landscapes with our specialized compliance solutions for pharmaceutical 
                companies and biotech research organizations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">FDA 21 CFR Part 11 Compliance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Clinical Trial Data Integrity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">GxP Validation Framework</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Pharmacovigilance Compliance Monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Finance & Banking focus section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-primary">Finance & Banking Solutions</h3>
              <p className="mb-4 text-gray-700">
                Secure financial operations and maintain regulatory compliance with our specialized solutions 
                for banks, credit unions, and fintech companies.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">KYC & AML Compliance Automation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">PCI-DSS Certification Readiness</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Financial Fraud Detection & Prevention</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">SEC & FINRA Compliance Management</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Finance Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* SaaS & Startups focus section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="SaaS Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 text-primary">SaaS & Startup Compliance</h3>
              <p className="mb-4 text-gray-700">
                Accelerate your growth with compliance solutions designed specifically for fast-moving 
                tech companies and startups, balancing innovation with security.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">SOC 2 Certification Fast-Track</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Privacy-by-Design Implementation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Compliance for Fundraising Readiness</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cloud Infrastructure Security Management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* E-commerce focus section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-primary">E-commerce Compliance Solutions</h3>
              <p className="mb-4 text-gray-700">
                Protect your customers' data and secure your payment processes with our comprehensive 
                e-commerce compliance solutions tailored for online businesses.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">PCI-DSS Compliance Framework</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Payment Gateway Security Verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Customer Data Protection & Privacy</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cross-border Transaction Compliance</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="E-commerce Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturing focus section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Manufacturing Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4 text-primary">Manufacturing Compliance</h3>
              <p className="mb-4 text-gray-700">
                Streamline your manufacturing compliance processes and secure your supply chain 
                with our industry-specific solutions designed for modern factories.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Supply Chain Security Assessment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Industrial IoT Security Protocol</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">ISO 9001 & ISO 27001 Compliance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Operational Technology Security Framework</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Insurance focus section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-primary">Insurance Compliance Excellence</h3>
              <p className="mb-4 text-gray-700">
                Enhance your insurance compliance posture with our specialized solutions designed 
                to protect sensitive customer data and streamline regulatory reporting.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Policyholder Data Protection Framework</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Claims Processing Security Verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">NYDFS Cybersecurity Regulation Compliance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Underwriting Data Integrity Monitoring</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Insurance Compliance" 
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustriesSection;
