import { useState, useEffect } from 'react';

/**
 * Hook to persist only safe UI preference settings (e.g. theme, spacing).
 * Note: Never store sensitive user input or configuration contents.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
