
/**
 * Hash-based verification utility for audit trail integrity
 * 
 * This module provides cryptographic functions to verify the integrity
 * of audit trails, ensuring data hasn't been tampered with
 */

/**
 * Generate a verification hash for an audit event
 * @param data - The data to generate a hash for
 */
export function generateEventHash(data: any): string {
  try {
    // Convert the object to a sorted, deterministic string
    const sortedData = sortObjectKeys(data);
    const jsonString = JSON.stringify(sortedData);
    
    // Use a simple hash algorithm for demonstration
    // In production, use a more robust crypto library
    return simpleHash(jsonString);
  } catch (error) {
    console.error('Error generating verification hash:', error);
    return 'hash-error';
  }
}

/**
 * Generate a verification hash for a collection of events
 * @param events - Array of events to generate a hash for
 */
export function generateAuditTrailHash(events: any[]): string {
  try {
    if (!events || events.length === 0) {
      return 'empty-trail';
    }
    
    // Sort events by timestamp to ensure deterministic ordering
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
    
    // Generate hashes for each event and combine them
    const eventHashes = sortedEvents.map(event => generateEventHash(event));
    const combinedHash = eventHashes.join('|');
    
    return simpleHash(combinedHash);
  } catch (error) {
    console.error('Error generating audit trail hash:', error);
    return 'hash-error';
  }
}

/**
 * Create a verification signature with timestamp
 * @param hash - The hash to sign
 */
export function createVerificationSignature(hash: string): string {
  const timestamp = new Date().toISOString();
  const verificationId = generateRandomId(8);
  
  return `${hash}:${timestamp}:${verificationId}`;
}

/**
 * Generate a verification code that can be used to verify document authenticity
 * @param documentName - The name of the document
 * @param events - The audit events to hash
 */
export function generateVerificationCode(documentName: string, events: any[]): string {
  const hash = generateAuditTrailHash(events);
  const documentNameHash = simpleHash(documentName);
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  
  return `NX-${documentNameHash.substring(0, 6)}-${hash.substring(0, 8)}-${timestamp}`;
}

// ================ Private Helper Functions ================

/**
 * Sort object keys alphabetically to ensure deterministic JSON stringification
 * @param obj - The object to sort keys for
 */
function sortObjectKeys(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  const sortedObj: Record<string, any> = {};
  const sortedKeys = Object.keys(obj).sort();
  
  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key]);
  }
  
  return sortedObj;
}

/**
 * Simple hash function for demonstration purposes
 * In production, use a cryptographic library like crypto-js
 * @param str - The string to hash
 */
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and ensure it's always positive
  const hexHash = Math.abs(hash).toString(16);
  return hexHash.padStart(8, '0');
}

/**
 * Generate a random ID with specified length
 * @param length - The length of the ID to generate
 */
function generateRandomId(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}
