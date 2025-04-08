
/**
 * Utility functions for managing scheduled scans in local storage
 */

/**
 * Save schedule to local storage
 */
export const saveSchedule = (schedule: any) => {
  try {
    localStorage.setItem(`compliZen_schedule_${schedule.documentId}`, JSON.stringify(schedule));
    console.log('Schedule saved to local storage:', schedule);
  } catch (err) {
    console.error('Error saving schedule to localStorage:', err);
  }
};

/**
 * Load schedule from local storage
 */
export const loadSchedule = (documentId: string) => {
  try {
    const savedSchedule = localStorage.getItem(`compliZen_schedule_${documentId}`);
    return savedSchedule ? JSON.parse(savedSchedule) : null;
  } catch (err) {
    console.error('Error loading schedule from localStorage:', err);
    return null;
  }
};
