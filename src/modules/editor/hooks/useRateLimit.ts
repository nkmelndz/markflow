import { useState, useEffect } from 'react';
import {
  MAX_DAILY_REQUESTS,
  STORAGE_KEY,
  createUpdatedUsage,
  getRemainingRequests,
  getToday,
  isRequestAllowed,
  parseStoredUsage,
} from './rateLimitUtils';

export const useRateLimit = () => {
  const [remaining, setRemaining] = useState<number>(MAX_DAILY_REQUESTS);

  // Initialize and check limit
  const checkLimit = (): boolean => {
    try {
      const today = getToday();
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = parseStoredUsage(stored, today);

      setRemaining(getRemainingRequests(data.count));

      return isRequestAllowed(data.count);
    } catch (e) {
      console.error('Error checking rate limit', e);
      return true; // Fail safe: Allow if storage error
    }
  };

  const incrementUsage = () => {
    try {
      const today = getToday();
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentData = parseStoredUsage(stored, today);
      const newData = createUpdatedUsage(currentData.count, today);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setRemaining(getRemainingRequests(newData.count));
    } catch (e) {
      console.error('Error updating usage', e);
    }
  };

  // Sync remaining on mount
  useEffect(() => {
    checkLimit();
  }, []);

  return {
    checkLimit,
    incrementUsage,
    remaining,
    limit: MAX_DAILY_REQUESTS
  };
};
