import { ServiceCardProps } from './types';

export interface ServiceHelperTexts {
  actionButtonText: string;
  uploadDialogTitle: string;
  uploadDialogDescription: string;
  submitButtonText: string;
}

export const getServiceHelperTexts = (serviceId: string): ServiceHelperTexts => {
  return {
    actionButtonText: getActionButtonText(serviceId),
    uploadDialogTitle: getUploadDialogTitle(serviceId),
    uploadDialogDescription: getUploadDialogDescription(serviceId),
    submitButtonText: getSubmitButtonText(serviceId)
  };
};

// Helper functions for service-specific text
export const getActionButtonText = (serviceId: string): string => {
  if (serviceId.includes('drive')) return 'Upload File';
  if (serviceId.includes('gmail')) return 'Scan Email Content';
  if (serviceId.includes('docs')) return 'Upload Google Doc';
  return 'Action';
};

export const getUploadDialogTitle = (serviceId: string): string => {
  if (serviceId.includes('drive')) return 'Upload to Google Drive';
  if (serviceId.includes('gmail')) return 'Email Content';
  if (serviceId.includes('docs')) return 'Upload Google Document';
  return 'Action';
};

export const getUploadDialogDescription = (serviceId: string): string => {
  if (serviceId.includes('drive')) return 'Select a file to upload to your Google Drive for compliance scanning';
  if (serviceId.includes('gmail')) return 'Enter email content to scan for compliance issues or paste existing content to analyze';
  if (serviceId.includes('docs')) return 'Upload a document or enter content to create a new Google Doc for scanning';
  return '';
};

export const getSubmitButtonText = (serviceId: string): string => {
  if (serviceId.includes('drive')) return 'Upload & Scan';
  if (serviceId.includes('gmail')) return 'Scan';
  if (serviceId.includes('docs')) return 'Upload & Scan';
  return 'Submit';
};
