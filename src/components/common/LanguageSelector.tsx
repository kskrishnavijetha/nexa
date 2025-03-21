
import React from 'react';
import { Check, Globe } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SupportedLanguage, supportedLanguages } from '@/utils/languageService';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  variant?: 'default' | 'outline' | 'subtle';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange,
  variant = 'outline'
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === 'subtle' ? 'ghost' : variant}
          size="sm"
          className="gap-1"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentLanguage.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              onLanguageChange(language.code);
              localStorage.setItem('preferredLanguage', language.code);
            }}
            className="flex items-center justify-between"
          >
            <span>
              {language.nativeName} <span className="text-muted-foreground">({language.name})</span>
            </span>
            {currentLanguage === language.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
