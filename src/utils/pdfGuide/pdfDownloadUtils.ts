
/**
 * Creates a download link for the user guide PDF
 */
export const getPdfDownloadUrl = (): string => {
  const pdfBlob = generateUserGuide();
  return URL.createObjectURL(pdfBlob);
};

// Importing here to avoid circular dependencies
import { generateUserGuide } from './generateUserGuide';
