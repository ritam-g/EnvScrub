import { useState, useEffect } from 'react';

/**
 * Debounces a fast-changing value (e.g. textarea input) by specified milliseconds.
 */
export function useDebouncedValue<T>(value: T, delayMs = 150): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
