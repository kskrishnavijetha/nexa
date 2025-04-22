
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateFileHash, verifyHashesMatch, logVerificationEvent } from '@/utils/audit/hashVerification';
import { getSubscription } from '@/utils/paymentService';
import { isFeatureAvailable } from '@/utils/pricingData';

export type VerificationMethod = 'paste' | 'select';
export type Document = { id: string; name: string; hash: string; timestamp: string };
export type VerificationResult = 'pending' | 'match' | 'mismatch' | null;

export const useHashVerification = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string>('');
  const [compareMethod, setCompareMethod] = useState<VerificationMethod>('paste');
  const [pastedHash, setPastedHash] = useState<string>('');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Check if user's plan allows hash verification
  const subscription = getSubscription(user?.id);
  const canUseHashVerification = subscription && isFeatureAvailable('hashVerification', subscription.plan);

  // Fetch recent documents
  useEffect(() => {
    if (user) {
      fetchRecentDocuments();
    }
  }, [user]);

  const fetchRecentDocuments = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, we'll simulate this with mock data
      const mockDocuments: Document[] = [
        { id: '1', name: 'Financial Compliance Report Q2.pdf', hash: '8a1e4c53d21b2e47b4c12fa9226867beaefb56c518ce6be7b15d25d59573a', timestamp: '2023-06-15' },
        { id: '2', name: 'Data Privacy Audit.pdf', hash: '62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63', timestamp: '2023-07-01' },
        { id: '3', name: 'Security Assessment.pdf', hash: '38d1e64c9a5bdb26bd25d66c8e465fce3c0b1b879dd8503bded6dba869fe9', timestamp: '2023-07-10' },
      ];
      
      setRecentDocuments(mockDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load recent documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelection = async (selectedFile: File) => {
    // Check if user can use hash verification
    if (!canUseHashVerification) {
      toast.error('Hash verification is only available in Pro and Enterprise plans. Please upgrade to access this feature.');
      return;
    }
    
    setFile(selectedFile);
    setVerificationResult(null);
    
    try {
      // Convert file to ArrayBuffer for hashing
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      // Use the proper file hash generation function
      const hash = await generateFileHash(arrayBuffer);
      setComputedHash(hash);
    } catch (error) {
      console.error('Error computing hash:', error);
      toast.error('Failed to compute document hash');
    }
  };

  const handleVerification = async () => {
    // Check if user can use hash verification
    if (!canUseHashVerification) {
      toast.error('Hash verification is only available in Pro and Enterprise plans. Please upgrade to access this feature.');
      return;
    }
    
    if (!computedHash) {
      toast.error('Please upload a file first');
      return;
    }

    setIsVerifying(true);
    setVerificationResult('pending');
    
    try {
      // Get comparison hash from paste or selected document
      let comparisonHash = '';
      if (compareMethod === 'paste') {
        comparisonHash = pastedHash.trim();
      } else {
        const selectedDoc = recentDocuments.find(doc => doc.id === selectedDocumentId);
        comparisonHash = selectedDoc?.hash || '';
      }
      
      if (!comparisonHash) {
        toast.error('No comparison hash provided');
        setVerificationResult(null);
        setIsVerifying(false);
        return;
      }
      
      // Compare hashes using the utility function
      const isMatch = verifyHashesMatch(computedHash, comparisonHash);
      const result = isMatch ? 'match' : 'mismatch';
      
      // Short delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setVerificationResult(result);
      
      // Log the verification attempt
      logVerificationAttempt(isMatch);
      
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error('Verification process failed');
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const logVerificationAttempt = async (isMatch: boolean) => {
    if (!file || !user) return;
    
    try {
      // Use the utility function to log verification event
      await logVerificationEvent(
        user.id,
        file.name,
        isMatch
      );
    } catch (error) {
      console.error('Error logging verification:', error);
    }
  };

  return {
    file,
    computedHash,
    compareMethod,
    pastedHash,
    setPastedHash,
    selectedDocumentId,
    setSelectedDocumentId,
    recentDocuments,
    isVerifying,
    verificationResult,
    isLoading,
    setCompareMethod,
    handleFileSelection,
    handleVerification,
    canUseHashVerification
  };
};
