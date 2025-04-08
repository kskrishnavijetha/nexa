
/**
 * Get formatted date string for filenames (YYYY-MM-DD)
 */
export const getFormattedDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Sanitize document name for use in filenames
 */
export const getSanitizedFileName = (documentName: string): string => {
  return documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
};
