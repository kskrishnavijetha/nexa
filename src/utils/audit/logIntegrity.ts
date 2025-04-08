
import { sha256 } from 'crypto-hash';
import { AuditEvent } from '@/components/audit/types';

/**
 * Generate a hash for an audit event to verify integrity
 */
export const generateEventHash = async (event: AuditEvent): Promise<string> => {
  // Create a string representation of the event for hashing
  // Exclude the hash property itself if it exists
  const { hash, ...eventData } = event as AuditEvent & { hash?: string };
  const eventString = JSON.stringify(eventData);
  
  // Generate SHA-256 hash
  return await sha256(eventString);
};

/**
 * Generate a chain hash for a sequence of audit events
 * Each event's hash includes the hash of the previous event
 */
export const generateChainHash = async (events: AuditEvent[]): Promise<string> => {
  if (events.length === 0) return '';
  
  // Start with an empty hash
  let previousHash = '';
  
  // Process each event in sequence
  for (const event of events) {
    // Combine the event data with the previous hash
    const combinedData = JSON.stringify({
      event: { ...event, previousHash },
      timestamp: Date.now()
    });
    
    // Update the chain hash
    previousHash = await sha256(combinedData);
  }
  
  return previousHash;
};

/**
 * Verify the integrity of the audit log chain
 * Returns true if the chain is intact, false if tampering is detected
 */
export const verifyLogIntegrity = async (events: AuditEvent[]): Promise<boolean> => {
  try {
    // Generate a fresh hash for comparison
    const freshHash = await generateChainHash(events);
    
    // In a real-world scenario, you would compare with a stored hash
    // For now, we'll simulate this by storing the hash in localStorage
    const storedHash = localStorage.getItem('auditTrailHash') || '';
    
    // If no stored hash exists yet, store the current one and return true
    if (!storedHash) {
      localStorage.setItem('auditTrailHash', freshHash);
      return true;
    }
    
    // Compare hashes to verify integrity
    return storedHash === freshHash;
  } catch (error) {
    console.error('Error verifying log integrity:', error);
    return false;
  }
};

/**
 * Store the current hash of the audit trail
 */
export const storeLogHash = async (events: AuditEvent[]): Promise<void> => {
  try {
    const hash = await generateChainHash(events);
    localStorage.setItem('auditTrailHash', hash);
  } catch (error) {
    console.error('Error storing log hash:', error);
  }
};
