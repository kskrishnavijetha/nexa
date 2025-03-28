
import { ApiResponse, ApiServiceResponse } from './apiService';

interface UploadResult {
  documentId: string;
  documentName: string;
}

/**
 * Simulates uploading a document to the server
 */
export const uploadDocument = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<UploadResult>> => {
  try {
    // Simulate upload progress
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
    }
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate a unique document ID
    const documentId = `doc_${Date.now()}`;
    
    return {
      success: true,
      data: {
        documentId,
        documentName: file.name
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'Failed to upload the document. Please try again.'
    };
  }
};
