
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

/**
 * Breaks down a heavy operation into smaller chunks to prevent UI freezing
 * @param tasks Array of functions to execute
 * @param chunkSize Number of tasks to execute in each chunk
 */
export const executeInChunks = async <T>(
  tasks: Array<() => Promise<T>>,
  chunkSize = 3,
  onProgress?: (processed: number, total: number) => void
): Promise<T[]> => {
  const results: T[] = [];
  const totalTasks = tasks.length;
  
  for (let i = 0; i < totalTasks; i += chunkSize) {
    // Process a chunk of tasks
    const chunk = tasks.slice(i, i + chunkSize);
    
    // Let the UI breathe before starting the next chunk
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Process the chunk
    const chunkResults = await Promise.all(chunk.map(task => task()));
    results.push(...chunkResults);
    
    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + chunkSize, totalTasks), totalTasks);
    }
  }
  
  return results;
};

/**
 * Forces garbage collection by creating and releasing large objects
 * This is a workaround as JS doesn't have direct GC control
 */
export const forceGarbageCollection = (): void => {
  // Create references to large objects
  const references: any[] = [];
  
  // Create some large objects then release them
  for (let i = 0; i < 10; i++) {
    references.push(new Array(1000000).fill(0));
  }
  
  // Clear all references
  references.length = 0;
};
