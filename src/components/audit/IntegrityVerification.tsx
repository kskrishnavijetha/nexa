
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

interface IntegrityVerificationProps {
  verificationCode?: string | null;
  compact?: boolean;
  className?: string;
}

const IntegrityVerification: React.FC<IntegrityVerificationProps> = ({
  verificationCode,
  compact = false,
  className = "",
}) => {
  if (!verificationCode) {
    if (compact) {
      return (
        <Badge variant="outline" className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          No Verification
        </Badge>
      );
    }
    
    return (
      <div className={`p-2 bg-yellow-50 border border-yellow-100 rounded-md flex items-center ${className}`}>
        <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-700">
            No SHA-256 verification available
          </p>
          <p className="text-xs text-yellow-600">
            This document does not include cryptographic verification.
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              SHA-256 Verified
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              SHA-256 tamper-proof verification: {verificationCode}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className={`border-green-100 bg-green-50 ${className}`}>
      <CardContent className="p-3 flex items-start">
        <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">
            SHA-256 tamper-proof verification active
          </p>
          <p className="text-xs text-green-700 mb-1">
            This document uses cryptographic SHA-256 verification suitable for regulated industries.
          </p>
          <div className="bg-green-100 rounded p-1.5 border border-green-200">
            <p className="font-mono text-xs text-green-700 break-all">
              Verification Code: {verificationCode}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrityVerification;
