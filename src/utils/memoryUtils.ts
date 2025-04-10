
/**
 * Memory management utilities for large operations
 */

/**
 * Schedules a heavy operation to run without blocking the UI
 * by utilizing microtasks and animation frames appropriately
 */
export const scheduleNonBlockingOperation = <T>(
  operation: () => Promise<T>, 
  progressCallback?: (percent: number) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
    // Request animation frame to let the UI update first
    requestAnimationFrame(() => {
      // Use a microtask for better task prioritization
      queueMicrotask(async () => {
        try {
          // Start the heavy operation
          const result = await operation();
          resolve(result);
        } catch (error) {
          console.error('Operation failed:', error);
          reject(error);
        }
      });
    });
  });
};

/**
 * Creates a download link and triggers the download
 * with proper cleanup to prevent memory leaks
 */
export const triggerDownload = (blob: Blob, filename: string): Promise<void> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.position = 'absolute';
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up to prevent memory leaks - crucial for large files
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve();
    }, 100);
  });
};
