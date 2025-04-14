
import React from 'react';
import { Check, Rocket, Award, BarChart, Shield, Clock } from 'lucide-react';

export interface ComplianceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const complianceFeatures: ComplianceFeature[] = [
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "Risk Detection & Alerts",
    description: "Our AI automatically identifies compliance gaps and sends real-time alerts to your team"
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Automated Reporting",
    description: "Generate comprehensive compliance reports and audit logs with a single click"
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: "Enforcement Actions",
    description: "Proactively block risky actions and suggest compliant alternatives"
  },
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: "Continuous Learning",
    description: "Our system continuously adapts to new regulations and compliance requirements"
  },
  {
    icon: <Check className="h-10 w-10 text-primary" />,
    title: "Policy Generation",
    description: "Create tailored compliance policies that meet your specific industry requirements"
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Real-Time Monitoring",
    description: "Monitor your compliance status in real-time across all your systems and processes"
  }
];
