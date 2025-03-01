
/**
 * Maximum allowed file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Allowed file types
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',                                                       // PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword',                                                    // DOC
  'text/plain'                                                             // TXT
];

/**
 * Validates if the file meets the requirements
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload a PDF, DOCX, or TXT file'
    };
  }

  return { valid: true };
};

/**
 * Formats file size to human-readable format
 */
export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Gets file extension from file name
 */
export const getFileExtension = (fileName: string): string | null => {
  const match = fileName.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : null;
};

/**
 * Creates a blob URL for downloading a file
 */
export const createDownloadLink = (content: string, fileName: string, mimeType: string): string => {
  const blob = new Blob([content], { type: mimeType });
  return URL.createObjectURL(blob);
};
