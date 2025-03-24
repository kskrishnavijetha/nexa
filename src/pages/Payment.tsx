
import React from 'react';
import PaymentForm from '@/components/PaymentForm';

const Payment = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          Subscription Plans
        </h1>
        
        <PaymentForm />
      </div>
    </div>
  );
};

export default Payment;
