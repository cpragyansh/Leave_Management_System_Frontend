/**
 * @file helpers.js
 * @description General utility helper functions used across the application.
 */

/**
 * Gets the first letter of the first two words in a name.
 * Used to show initials inside user avatar circles.
 * 
 * @param {string} name - The user's full name.
 * @returns {string} Two-letter initials (e.g. "John Doe" -> "JD").
 */
export const getInitials = (name) => {
  if (!name) return 'EE';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Formats start and end dates into a neat human-readable range.
 * 
 * @param {string|Date} start - The start date.
 * @param {string|Date} end - The end date.
 * @returns {string} Formatted range string (e.g. "Nov 12 - Nov 15, 2026").
 */
export const formatDates = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts = { month: 'short', day: '2-digit' };
  return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', opts)}, ${e.getFullYear()}`;
};

/**
 * Calculates how long ago a date timestamp was created relative to now.
 * 
 * @param {string|Date} dateStr - The creation date string.
 * @returns {string} Text string like "Just now" or "2 days ago".
 */
export const timeAgo = (dateStr) => {
  const created = new Date(dateStr);
  const now = new Date();
  const hours = Math.floor((now - created) / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

/**
 * Calculates the number of working days between two dates, excluding weekends.
 * 
 * @param {string|Date} startDate - The start date.
 * @param {string|Date} endDate - The end date.
 * @returns {number} The count of weekdays/working days.
 */
export const countWorkingDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) return 0;

  let count = 0;
  let current = new Date(start);
  
  while (current <= end) {
    const day = current.getDay();
    // 0 = Sunday, 6 = Saturday. Skip these.
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
};
