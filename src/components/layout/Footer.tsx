
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Shield, FileText, Linkedin, X } from 'lucide-react';
import { getPrivacyPolicyPdfUrl, getTermsOfServicePdfUrl, getCookiePolicyPdfUrl } from '@/utils/pdfGuide';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const handlePrivacyPolicyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const pdfUrl = getPrivacyPolicyPdfUrl();
      window.open(pdfUrl, '_blank');
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error('Error generating privacy policy PDF', error);
      toast.error('Unable to open privacy policy. Please try again later.');
    }
  };
  
  const handleTermsOfServiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const pdfUrl = getTermsOfServicePdfUrl();
      window.open(pdfUrl, '_blank');
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error('Error generating terms of service PDF', error);
      toast.error('Unable to open terms of service. Please try again later.');
    }
  };
  
  const handleCookiePolicyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const pdfUrl = getCookiePolicyPdfUrl();
      window.open(pdfUrl, '_blank');
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error('Error generating cookie policy PDF', error);
      toast.error('Unable to open cookie policy. Please try again later.');
    }
  };
  
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/public/lovable-uploads/b96b3f45-8a1a-40d5-b884-1142753be402.png" 
                alt="Logo" 
                className="h-6 w-6" 
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Automate your compliance monitoring with AI. Stay compliant with GDPR, HIPAA, SOC 2, and PCI-DSS regulations effortlessly.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://x.com/nexabloom171521" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/nexabloom" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:contact@nexabloom.live" className="hover:text-primary transition-colors">contact@nexabloom.live</a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <a href="https://www.nexabloom.live" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.nexabloom.live</a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <X className="h-4 w-4 mr-2" />
                <a href="https://x.com/nexabloom171521" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@nexabloom171521</a>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <Linkedin className="h-4 w-4 mr-2" />
                <a href="https://linkedin.com/company/nexabloom" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Nexabloom</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm text-muted-foreground">© {currentYear} Nexabloom. All rights reserved.</span>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="#" 
              onClick={handlePrivacyPolicyClick} 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4 mr-1" />
              Privacy Policy
            </a>
            <a 
              href="#" 
              onClick={handleTermsOfServiceClick} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              onClick={handleCookiePolicyClick} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
