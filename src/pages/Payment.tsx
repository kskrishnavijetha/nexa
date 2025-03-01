
import React from 'react';
import PaymentForm from '@/components/PaymentForm';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // In a real app, you might want to redirect to a success page or dashboard
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </div>
          <div className="flex-1 bg-muted/30 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">What you get</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">
                  Comprehensive GDPR, HIPAA, and SOC2 compliance analysis
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">
                  Downloadable PDF reports for your records
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">
                  Detailed risk analysis with severity ratings
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">
                  AI-powered suggestions for addressing compliance issues
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
