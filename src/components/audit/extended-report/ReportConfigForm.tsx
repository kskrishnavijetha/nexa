
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';
import { ReportConfig } from './types';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';

interface ReportConfigFormProps {
  config: ReportConfig;
  onChange: (config: ReportConfig) => void;
  report: ComplianceReport;
}

export function ReportConfigForm({ config, onChange, report }: ReportConfigFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const complianceOptions = [
    { label: 'GDPR', value: 'GDPR' },
    { label: 'HIPAA', value: 'HIPAA' },
    { label: 'SOC 2', value: 'SOC 2' },
    { label: 'PCI-DSS', value: 'PCI-DSS' },
    { label: 'CCPA', value: 'CCPA' },
  ];

  const handleChange = (field: keyof ReportConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Logo file is too large. Please select an image under 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        handleChange('logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    handleChange('logoUrl', '');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name*</Label>
            <Input 
              id="organizationName" 
              value={config.organizationName} 
              onChange={(e) => handleChange('organizationName', e.target.value)}
              placeholder="Enter your organization name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reportTitle">Report Title</Label>
            <Input 
              id="reportTitle" 
              value={config.reportTitle} 
              onChange={(e) => handleChange('reportTitle', e.target.value)}
              placeholder="Extended Audit-Ready Compliance Report"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reportVersion">Report Version</Label>
            <Input 
              id="reportVersion" 
              value={config.reportVersion} 
              onChange={(e) => handleChange('reportVersion', e.target.value)}
              placeholder="1.0"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Compliance Types</Label>
            <MultiSelect
              selected={config.complianceTypes}
              options={complianceOptions}
              onChange={(selected) => handleChange('complianceTypes', selected)}
              placeholder="Select compliance frameworks"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Company Logo</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <Label 
                  htmlFor="logo-upload" 
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-primary"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                </Label>
              </div>
              
              {logoPreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={removeLogo}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {logoPreview && (
              <div className="mt-2 border rounded p-3 bg-gray-50">
                <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                <img 
                  src={logoPreview} 
                  alt="Company logo preview" 
                  className="max-h-20 max-w-full object-contain" 
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Textarea 
              id="contactInfo" 
              value={config.contactInfo} 
              onChange={(e) => handleChange('contactInfo', e.target.value)}
              placeholder="Enter contact information for audit confirmation"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-4 items-center mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeSignature" 
                checked={config.includeSignature}
                onCheckedChange={(checked) => 
                  handleChange('includeSignature', checked === true)
                }
              />
              <label 
                htmlFor="includeSignature" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Digital Signature
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeAppendix" 
                checked={config.includeAppendix}
                onCheckedChange={(checked) => 
                  handleChange('includeAppendix', checked === true)
                }
              />
              <label 
                htmlFor="includeAppendix" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Appendix
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="rounded-full bg-blue-100 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Document Information</h4>
            <p className="text-xs text-blue-600 mt-1">
              This report will be generated for: <strong>{report.documentName}</strong>
              <br />
              Industry: <strong>{report.industry}</strong>
              <br />
              Current compliance score: <strong>{report.overallScore}%</strong>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
