
import { AuditEvent } from '@/components/audit/types';

/**
 * Type definition for verification metadata
 */
export interface VerificationMetadata {
  hash: string;
  shortHash: string;
  timestamp: string;
  verificationMethod: string;
  eventCount: number;
}

/**
 * Generate a hash from audit events to verify integrity
 * Uses SHA-256 algorithm via the Web Crypto API
 */
export const generateAuditHash = async (auditEvents: AuditEvent[]): Promise<string> => {
  try {
    // Create a stable string representation of audit events
    // Sort by timestamp to ensure deterministic output regardless of order
    const sortedEvents = [...auditEvents].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Create a string representation with only the essential data
    // This makes the hash more resistant to irrelevant changes
    const dataString = sortedEvents.map(event => 
      `${event.id}|${event.timestamp}|${event.action}|${event.user}|${event.documentName}`
    ).join(';;');
    
    // Use Web Crypto API to generate a SHA-256 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Error generating audit hash:', error);
    return 'error-generating-hash';
  }
};

/**
 * Generate a hash from file content
 * Uses SHA-256 algorithm via the Web Crypto API
 */
export const generateFileHash = async (fileData: ArrayBuffer): Promise<string> => {
  try {
    // Use Web Crypto API to generate a SHA-256 hash directly from file data
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileData);
    
    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Error generating file hash:', error);
    throw new Error('Failed to generate file hash');
  }
};

/**
 * Verifies if the current audit events match the provided hash
 */
export const verifyAuditIntegrity = async (
  auditEvents: AuditEvent[], 
  storedHash: string
): Promise<boolean> => {
  if (!storedHash) return false;
  
  try {
    const currentHash = await generateAuditHash(auditEvents);
    return currentHash === storedHash;
  } catch (error) {
    console.error('Error verifying audit integrity:', error);
    return false;
  }
};

/**
 * Generate a short version of the hash for display purposes
 */
export const getShortHash = (hash: string): string => {
  if (!hash || hash.length < 8) return hash || '';
  return `${hash.substring(0, 8)}...`;
};

/**
 * Generate verification metadata for the audit trail
 */
export const generateVerificationMetadata = async (auditEvents: AuditEvent[]): Promise<VerificationMetadata> => {
  const hash = await generateAuditHash(auditEvents);
  const timestamp = new Date().toISOString();
  
  return {
    hash,
    shortHash: getShortHash(hash),
    timestamp,
    verificationMethod: 'SHA-256',
    eventCount: auditEvents.length
  };
};

/**
 * Verify if two hashes match
 */
export const verifyHashesMatch = (hash1: string, hash2: string): boolean => {
  if (!hash1 || !hash2) return false;
  
  // Normalize the hashes before comparison (trim whitespace and convert to lowercase)
  const normalizedHash1 = hash1.trim().toLowerCase();
  const normalizedHash2 = hash2.trim().toLowerCase();
  
  return normalizedHash1 === normalizedHash2;
};

/**
 * Log a verification event to the console (and optionally to database)
 */
export const logVerificationEvent = async (
  userId: string | undefined,
  fileName: string,
  isMatch: boolean,
  timestamp: string = new Date().toISOString()
) => {
  const event = {
    userId: userId || 'anonymous',
    fileName,
    result: isMatch ? 'verified' : 'failed',
    timestamp
  };
  
  console.log('Verification event:', event);
  
  // In a real implementation, this would save to Supabase
  // await supabase.from('verification_logs').insert(event);
  
  return event;
};
