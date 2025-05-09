
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyDetails } from '../types';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { complianceFrameworks } from '@/utils/audit/complianceUtils';
import { ImageUploader } from './ImageUploader';
import { Industry } from '@/utils/types';
import { Region } from '@/utils/types/common';

interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyDetails: CompanyDetails) => void;
}

export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [companyName, setCompanyName] = useState('');
  const [complianceType, setComplianceType] = useState('SOC 2');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState<Industry | undefined>(undefined);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const industries: Industry[] = [
    'Healthcare', 
    'Finance & Banking', 
    'Retail & Consumer', 
    'E-Commerce', 
    'Cloud & SaaS', 
    'Government & Defense', 
    'Energy & Utilities',
    'Telecom',
    'Manufacturing & Supply Chain',
    'Education',
    'Automotive',
    'Pharmaceutical & Biotech',
    'Global'
  ];

  // Fix the Region types to match the allowed values in the Region type
  const regions: Region[] = [
    'US',
    'EU',
    'UK',
    'APAC',
    'Global',
    'North America',
    'European Union',
    'Asia Pacific',
    'United Kingdom',
    'Latin America',
    'Middle East',
    'Africa'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    onSubmit({
      companyName,
      complianceType,
      logo: logoImage,
      contactName,
      designation,
      email,
      phone,
      industry,
      region
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Extended Audit Report</DialogTitle>
          <DialogDescription>
            Enter company details for your audit-ready report
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Organization Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter organization name"
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={industry} 
                onValueChange={(value) => setIndustry(value as Industry)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Select 
                value={region} 
                onValueChange={(value) => setRegion(value as Region)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((reg) => (
                    <SelectItem key={reg} value={reg}>
                      {reg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter contact person name"
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Enter designation/title"
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter contact email"
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter contact phone"
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="complianceType">Compliance Framework</Label>
              <Select 
                value={complianceType}
                onValueChange={setComplianceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  {complianceFrameworks.map(framework => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Company Logo (Optional)</Label>
              <ImageUploader onImageUpload={setLogoImage} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Generate Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
