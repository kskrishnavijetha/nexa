
import { toast } from 'sonner';

// Maximum number of files to fetch from Google Drive
export const MAX_FILES_TO_SCAN = 100;

// Function to fetch files from Google Drive
export const fetchDriveFiles = async (maxFiles: number = MAX_FILES_TO_SCAN) => {
  try {
    if (!window.gapi || !window.gapi.client || !window.gapi.client.drive) {
      console.error('Google Drive API not initialized');
      return [];
    }

    const response = await window.gapi.client.drive.files.list({
      'pageSize': maxFiles,
      'fields': 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, parents)',
      'orderBy': 'modifiedTime desc'
    });
    
    console.log(`Retrieved ${response.result.files.length} files from Google Drive`);
    return response.result.files;
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    toast.error('Failed to fetch files from Google Drive');
    return [];
  }
};

// Function to check file permissions
export const checkFilePermissions = async (fileId: string) => {
  try {
    const response = await window.gapi.client.drive.permissions.list({
      'fileId': fileId
    });
    
    return response.result.permissions;
  } catch (error) {
    console.error('Error checking file permissions:', error);
    return [];
  }
};

// Function to analyze file content for potential compliance issues
export const analyzeFileContent = async (fileId: string) => {
  // In a real implementation, this would call your backend service
  // that uses Google Drive API to access and analyze the file content
  
  // For demo purposes, we'll simulate some analysis
  const simulatedRisks = [
    {
      type: 'PII',
      confidence: Math.random() * 100,
      description: 'Potential personally identifiable information detected'
    },
    {
      type: 'FinancialData',
      confidence: Math.random() * 100,
      description: 'Possible financial information detected'
    }
  ].filter(risk => risk.confidence > 70); // Only keep high confidence risks
  
  return simulatedRisks;
};

// Utility function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

// Utility function to determine if a file should be scanned based on its type
export const shouldScanFile = (file: any): boolean => {
  const scannable = [
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/pdf'
  ];
  
  return scannable.includes(file.mimeType);
};
