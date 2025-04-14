
import React from 'react';
import { 
  Shield, 
  BarChart, 
  FileText, 
  Zap, 
  Clock, 
  Download
} from 'lucide-react';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: 'Comprehensive Compliance Checks',
    description: 'Analyze your documents against GDPR, HIPAA, SOC 2, and other regulatory frameworks with pinpoint accuracy.'
  },
  {
    icon: <BarChart className="w-10 h-10 text-primary" />,
    title: 'Detailed Risk Assessment',
    description: 'Get a complete breakdown of compliance risks categorized by severity, with clear explanations and references.'
  },
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: 'Custom Report Generation',
    description: 'Export professional compliance reports in PDF format with your branding for internal reviews or client presentations.'
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI engine provides context-aware analysis that understands the nuances of regulatory requirements.'
  },
  {
    icon: <Clock className="w-10 h-10 text-primary" />,
    title: 'Real-Time Processing',
    description: 'Get instant results in seconds, not days, allowing you to quickly iterate on compliance improvements.'
  },
  {
    icon: <Download className="w-10 h-10 text-primary" />,
    title: 'Multi-Format Support',
    description: 'Upload documents in various formats including PDF, DOCX, and plain text for seamless verification.'
  }
];
