
export const getServiceHelperTexts = (serviceId: string) => {
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
  if (serviceId.includes('gmail')) return 'Email Content';
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
  if (serviceId.includes('drive')) return 'Select a file to upload to your Google Drive';
  if (serviceId.includes('gmail')) return 'Create or analyze email content from your Gmail account';
  if (serviceId.includes('docs')) return 'Upload a document to Google Docs';
  return '';
};

export const getSubmitButtonText = (serviceId: string): string => {
  if (serviceId.includes('drive')) return 'Upload';
  if (serviceId.includes('gmail')) return 'Send Email';
  if (serviceId.includes('docs')) return 'Upload';
  return 'Submit';
};
