
import React from 'react';
import { Briefcase, Stethoscope, ShoppingBag, Rocket, Building, Factory, Shield, Wifi } from 'lucide-react';

export interface TrustedIndustry {
  name: string;
  icon: React.ReactNode;
}

export const trustedIndustries: TrustedIndustry[] = [
  { name: 'Finance', icon: <Briefcase className="h-6 w-6" /> },
  { name: 'Healthcare', icon: <Stethoscope className="h-6 w-6" /> }, 
  { name: 'E-commerce', icon: <ShoppingBag className="h-6 w-6" /> }, 
  { name: 'SaaS & Startups', icon: <Rocket className="h-6 w-6" /> },
  { name: 'Government', icon: <Building className="h-6 w-6" /> }, 
  { name: 'Manufacturing', icon: <Factory className="h-6 w-6" /> }, 
  { name: 'Insurance', icon: <Shield className="h-6 w-6" /> }, 
  { name: 'Telecommunications', icon: <Wifi className="h-6 w-6" /> }
];
