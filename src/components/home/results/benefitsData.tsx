
import React from 'react';
import { BarChart, TrendingDown, Clock } from 'lucide-react';

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  details: string;
}

export const benefits: Benefit[] = [
  {
    icon: <TrendingDown className="h-8 w-8 text-primary" />,
    title: "Reduce Compliance Costs by 50%",
    details: "Our AI-powered platform analyzes your compliance processes and identifies cost-saving opportunities, resulting in an average 50% reduction in compliance-related expenses."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Cut Manual Work by 90%",
    details: "Automate document review, risk assessment, and compliance monitoring tasks that previously required hours of manual effort, freeing your team to focus on strategic initiatives."
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Faster Compliance in Minutes, Not Months",
    details: "Real-time scanning and analysis allows you to assess compliance status instantly, dramatically reducing the time required to identify and address potential issues."
  }
];
