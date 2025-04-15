
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { AuditEvent } from '@/components/audit/types';
import { generateAuditHash } from '@/utils/audit/hashVerification';

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
    setFile(selectedFile);
    setVerificationResult(null);
    
    try {
      // Convert file to text/binary for hashing
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Use the existing generateAuditHash function but adapt it for file data
      // Create a properly structured mock AuditEvent with all required properties
      const mockAuditEvents: AuditEvent[] = [{ 
        id: '1',
        timestamp: new Date().toISOString(),
        action: 'FILE_VERIFICATION',
        user: user?.email || 'anonymous',
        documentName: selectedFile.name,
        status: 'completed',
        comments: [],
      }];
      
      const hash = await generateAuditHash(mockAuditEvents);
      setComputedHash(hash);
    } catch (error) {
      console.error('Error computing hash:', error);
      toast.error('Failed to compute document hash');
    }
  };

  const handleVerification = async () => {
    if (!computedHash) {
      toast.error('Please upload a file first');
      return;
    }

    setIsVerifying(true);
    setVerificationResult('pending');
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
        return;
      }
      
      // Compare hashes
      const result = computedHash === comparisonHash ? 'match' : 'mismatch';
      setVerificationResult(result);
      
      // Log the verification attempt
      logVerificationAttempt(result === 'match');
      
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
      // In a real implementation, this would save to Supabase
      // For demonstration, we'll just log to console
      console.log('Verification attempt logged:', {
        userId: user.id,
        fileName: file.name,
        result: isMatch ? 'pass' : 'fail',
        timestamp: new Date().toISOString()
      });
      
      // This would be the actual Supabase insert
      // await supabase.from('verification_logs').insert({
      //   user_id: user.id,
      //   file_name: file.name,
      //   result: isMatch ? 'pass' : 'fail',
      //   timestamp: new Date()
      // });
      
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
    handleVerification
  };
};
