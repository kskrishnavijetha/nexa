
import React from 'react';
import { 
  Hospital, Microscope, Briefcase, Rocket, ShoppingBag, 
  Factory, Shield, ShieldCheck 
} from 'lucide-react';

export interface Industry {
  name: string;
  icon: React.ReactNode;
  features: string[];
}

export interface FocusIndustry {
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  imageAlt: string;
}

export const industries: Industry[] = [
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

export const focusIndustries: FocusIndustry[] = [
  {
    title: "Healthcare Compliance Excellence",
    description: "Our specialized healthcare compliance solutions address the unique challenges faced by healthcare providers, ensuring patient data security and regulatory compliance.",
    features: [
      "HIPAA Risk Assessment & Remediation",
      "Patient Privacy Protection Framework",
      "Electronic Health Record Security Analysis",
      "Medical Device Compliance Verification"
    ],
    imageSrc: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Healthcare Compliance"
  },
  {
    title: "Pharma & Biotech Compliance",
    description: "Navigate complex regulatory landscapes with our specialized compliance solutions for pharmaceutical companies and biotech research organizations.",
    features: [
      "FDA 21 CFR Part 11 Compliance",
      "Clinical Trial Data Integrity",
      "GxP Validation Framework",
      "Pharmacovigilance Compliance Monitoring"
    ],
    imageSrc: "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Pharmaceutical Compliance"
  },
  {
    title: "Finance & Banking Solutions",
    description: "Secure financial operations and maintain regulatory compliance with our specialized solutions for banks, credit unions, and fintech companies.",
    features: [
      "KYC & AML Compliance Automation",
      "PCI-DSS Certification Readiness",
      "Financial Fraud Detection & Prevention",
      "SEC & FINRA Compliance Management"
    ],
    imageSrc: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Finance Compliance"
  },
  {
    title: "SaaS & Startup Compliance",
    description: "Accelerate your growth with compliance solutions designed specifically for fast-moving tech companies and startups, balancing innovation with security.",
    features: [
      "SOC 2 Certification Fast-Track",
      "Privacy-by-Design Implementation",
      "Compliance for Fundraising Readiness",
      "Cloud Infrastructure Security Management"
    ],
    imageSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "SaaS Compliance"
  },
  {
    title: "E-commerce Compliance Solutions",
    description: "Protect your customers' data and secure your payment processes with our comprehensive e-commerce compliance solutions tailored for online businesses.",
    features: [
      "PCI-DSS Compliance Framework",
      "Payment Gateway Security Verification",
      "Customer Data Protection & Privacy",
      "Cross-border Transaction Compliance"
    ],
    imageSrc: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "E-commerce Compliance"
  },
  {
    title: "Manufacturing Compliance",
    description: "Streamline your manufacturing compliance processes and secure your supply chain with our industry-specific solutions designed for modern factories.",
    features: [
      "Supply Chain Security Assessment",
      "Industrial IoT Security Protocol",
      "ISO 9001 & ISO 27001 Compliance",
      "Operational Technology Security Framework"
    ],
    imageSrc: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Manufacturing Compliance"
  },
  {
    title: "Insurance Compliance Excellence",
    description: "Enhance your insurance compliance posture with our specialized solutions designed to protect sensitive customer data and streamline regulatory reporting.",
    features: [
      "Policyholder Data Protection Framework",
      "Claims Processing Security Verification",
      "NYDFS Cybersecurity Regulation Compliance",
      "Underwriting Data Integrity Monitoring"
    ],
    imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageAlt: "Insurance Compliance"
  }
];
