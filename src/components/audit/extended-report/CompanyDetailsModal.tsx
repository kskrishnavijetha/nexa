
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    onSubmit({
      companyName,
      complianceType,
      logo: logoImage
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
