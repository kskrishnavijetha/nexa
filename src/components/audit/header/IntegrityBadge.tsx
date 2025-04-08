
import React from 'react';
import { Shield } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IntegrityBadgeProps {
  integrityVerified: boolean | null;
}

const IntegrityBadge: React.FC<IntegrityBadgeProps> = ({ integrityVerified }) => {
  if (integrityVerified === null) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center ml-2 ${integrityVerified ? 'text-green-600' : 'text-red-600'}`}>
            <Shield className="h-5 w-5" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">
            {integrityVerified 
              ? "Log Integrity: Verified" 
              : "Log Integrity: Verification Failed"}
          </p>
          <p className="text-sm mt-1">
            {integrityVerified 
              ? "SHA-256 verification confirms these logs have not been tampered with." 
              : "Potential tampering detected. The audit log chain may have been modified."}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IntegrityBadge;
