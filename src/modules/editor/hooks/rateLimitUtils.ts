const MAX_DAILY_REQUESTS = 15;
const STORAGE_KEY = 'markflow_ai_usage';

interface UsageData {
  date: string;
  count: number;
}

const getToday = () => new Date().toISOString().split('T')[0];

const parseStoredUsage = (stored: string | null, today: string): UsageData => {
  if (!stored) return { date: today, count: 0 };

  const parsed = JSON.parse(stored) as UsageData;
  if (parsed.date !== today) {
    return { date: today, count: 0 };
  }

  return parsed;
};

const getRemainingRequests = (count: number) =>
  Math.max(0, MAX_DAILY_REQUESTS - count);

const isRequestAllowed = (count: number) => count < MAX_DAILY_REQUESTS;

const createUpdatedUsage = (currentCount: number, today: string): UsageData => ({
  date: today,
  count: currentCount + 1,
});

export {
  MAX_DAILY_REQUESTS,
  STORAGE_KEY,
  createUpdatedUsage,
  getRemainingRequests,
  getToday,
  isRequestAllowed,
  parseStoredUsage,
};

export type { UsageData };
