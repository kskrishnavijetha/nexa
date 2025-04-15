
import React from 'react';
import Layout from '@/components/layout/Layout';
import HashVerifier from '@/components/hash-verification/HashVerifier';

const HashVerification = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Document Hash Verification</h1>
        <HashVerifier />
      </div>
    </Layout>
  );
};

export default HashVerification;
