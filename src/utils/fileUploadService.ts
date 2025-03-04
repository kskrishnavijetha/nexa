
import { ApiResponse } from './types';

/**
 * Upload a file to the server
 */
export const uploadFile = async (file: File): Promise<ApiResponse<{ id: string }>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Simulate API latency (shorter for better UX)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful response (would be a real API call in production)
    return {
      data: { id: 'doc_' + Math.random().toString(36).substr(2, 9) },
      status: 200
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      error: 'Failed to upload the file. Please try again.',
      status: 500
    };
  }
};
