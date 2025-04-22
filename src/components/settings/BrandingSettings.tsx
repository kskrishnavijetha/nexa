
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getOrganizationBranding, saveOrganizationBranding, OrganizationBranding } from '@/utils/branding/organizationBranding';

const BrandingSettings = () => {
  const { toast } = useToast();
  const [branding, setBranding] = useState<OrganizationBranding>({
    name: '',
    logoUrl: '',
    primaryColor: '',
    accentColor: '',
    contactEmail: '',
    website: '',
    legalDisclaimer: '',
  });
  
  useEffect(() => {
    // Load existing branding settings on component mount
    const savedBranding = getOrganizationBranding();
    setBranding(savedBranding);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBranding(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveOrganizationBranding(branding);
    toast({
      title: "Branding settings saved",
      description: "Your organization branding changes have been applied.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Branding Settings</h2>
        <p className="text-muted-foreground">
          Customize your organization's branding
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={branding.name} 
                  onChange={handleChange} 
                  placeholder="Nexabloom" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input 
                  id="logoUrl" 
                  name="logoUrl" 
                  value={branding.logoUrl || ''} 
                  onChange={handleChange} 
                  placeholder="https://example.com/logo.png" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primaryColor" 
                    name="primaryColor" 
                    value={branding.primaryColor || '#4F46E5'} 
                    onChange={handleChange} 
                    placeholder="#4F46E5" 
                  />
                  <input 
                    type="color" 
                    id="primaryColorPicker" 
                    value={branding.primaryColor || '#4F46E5'} 
                    onChange={(e) => handleChange({ 
                      target: { name: 'primaryColor', value: e.target.value } 
                    } as React.ChangeEvent<HTMLInputElement>)} 
                    className="h-10 w-10 rounded-md border cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="accentColor" 
                    name="accentColor" 
                    value={branding.accentColor || ''} 
                    onChange={handleChange} 
                    placeholder="#10B981" 
                  />
                  <input 
                    type="color" 
                    id="accentColorPicker" 
                    value={branding.accentColor || '#10B981'} 
                    onChange={(e) => handleChange({ 
                      target: { name: 'accentColor', value: e.target.value } 
                    } as React.ChangeEvent<HTMLInputElement>)} 
                    className="h-10 w-10 rounded-md border cursor-pointer" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail" 
                  value={branding.contactEmail || ''} 
                  onChange={handleChange} 
                  placeholder="contact@example.com" 
                  type="email" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={branding.website || ''} 
                  onChange={handleChange} 
                  placeholder="https://example.com" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legalDisclaimer">Legal Disclaimer</Label>
              <Textarea 
                id="legalDisclaimer" 
                name="legalDisclaimer" 
                value={branding.legalDisclaimer || ''} 
                onChange={handleChange} 
                placeholder="Enter your legal disclaimer text..." 
                rows={3} 
              />
            </div>
          </div>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default BrandingSettings;
