import { useState, useEffect } from 'react';

const MAX_DAILY_REQUESTS = 15;
const STORAGE_KEY = 'markflow_ai_usage';

interface UsageData {
  date: string;
  count: number;
}

export const useRateLimit = () => {
  const [remaining, setRemaining] = useState<number>(MAX_DAILY_REQUESTS);

  // Initialize and check limit
  const checkLimit = (): boolean => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(STORAGE_KEY);
      
      let data: UsageData = { date: today, count: 0 };

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          data = parsed;
        }
        // If date differs, we start with count 0 (reset)
      }

      setRemaining(Math.max(0, MAX_DAILY_REQUESTS - data.count));

      if (data.count >= MAX_DAILY_REQUESTS) {
        return false; // Blocked
      }

      return true; // Allowed
    } catch (e) {
      console.error('Error checking rate limit', e);
      return true; // Fail safe: Allow if storage error
    }
  };

  const incrementUsage = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(STORAGE_KEY);
      let count = 0;

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          count = parsed.count;
        }
      }

      const newData: UsageData = {
        date: today,
        count: count + 1
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setRemaining(Math.max(0, MAX_DAILY_REQUESTS - newData.count));
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
