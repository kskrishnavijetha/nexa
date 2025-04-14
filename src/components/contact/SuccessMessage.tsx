
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SuccessMessage: React.FC = () => {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
      <p className="text-muted-foreground">
        We've added you to our early access list. We'll be in touch soon!
      </p>
    </div>
  );
};

export default SuccessMessage;
