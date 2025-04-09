
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { OrganizationBranding, getOrganizationBranding, saveOrganizationBranding } from '@/utils/branding/organizationBranding';

const BrandingSettings: React.FC = () => {
  const [branding, setBranding] = useState<OrganizationBranding>(getOrganizationBranding());
  const [logoPreview, setLogoPreview] = useState<string | undefined>(branding.logoUrl);

  useEffect(() => {
    // Load branding settings from storage on component mount
    setBranding(getOrganizationBranding());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBranding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the logo
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      
      // In a real app, you would upload the logo to a server here
      // For now, we'll just store the URL
      setBranding(prev => ({
        ...prev,
        logoUrl: url
      }));
    }
  };

  const handleSave = () => {
    try {
      saveOrganizationBranding(branding);
      toast.success('Branding settings saved successfully');
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast.error('Failed to save branding settings');
    }
  };

  const handleReset = () => {
    // Reset to default Nexabloom branding
    const defaultBranding: OrganizationBranding = {
      name: "Nexabloom",
      primaryColor: "rgb(79, 70, 229)",
      legalDisclaimer: "LEGAL DISCLAIMER: This report is for informational purposes only and does not constitute legal advice."
    };
    
    setBranding(defaultBranding);
    setLogoPreview(undefined);
    saveOrganizationBranding(defaultBranding);
    toast.info('Branding reset to defaults');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Organization Branding</CardTitle>
        <CardDescription>
          Customize how your organization appears in reports and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={branding.name} 
                onChange={handleChange} 
                placeholder="Your Organization" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                name="contactEmail" 
                type="email"
                value={branding.contactEmail || ''} 
                onChange={handleChange} 
                placeholder="contact@yourorganization.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                name="website" 
                value={branding.website || ''} 
                onChange={handleChange} 
                placeholder="https://yourorganization.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Organization Logo</Label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                    <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <Input 
                  id="logo" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange} 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended size: 200x200px. PNG or SVG with transparent background.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="primaryColor" 
                  name="primaryColor" 
                  value={branding.primaryColor || ''} 
                  onChange={handleChange} 
                  placeholder="#4F46E5" 
                  className="flex-1"
                />
                <input 
                  type="color" 
                  value={branding.primaryColor || '#4F46E5'} 
                  onChange={(e) => setBranding(prev => ({...prev, primaryColor: e.target.value}))}
                  className="w-10 h-10 p-1 border rounded"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This color will be used for your organization name in reports.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="accentColor" 
                  name="accentColor" 
                  value={branding.accentColor || ''} 
                  onChange={handleChange} 
                  placeholder="#10B981" 
                  className="flex-1"
                />
                <input 
                  type="color" 
                  value={branding.accentColor || '#10B981'} 
                  onChange={(e) => setBranding(prev => ({...prev, accentColor: e.target.value}))}
                  className="w-10 h-10 p-1 border rounded"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This color will be used for secondary elements in reports.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="legal" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="legalDisclaimer">Legal Disclaimer</Label>
              <Textarea 
                id="legalDisclaimer" 
                name="legalDisclaimer" 
                value={branding.legalDisclaimer || ''} 
                onChange={handleChange} 
                placeholder="This report is for informational purposes only..." 
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This disclaimer will appear at the bottom of reports and documents.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSave}>
            Save Branding Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingSettings;
