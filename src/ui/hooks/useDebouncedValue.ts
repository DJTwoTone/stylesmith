import { useEffect, useState } from 'react';

/**
 * useDebouncedValue
 * Returns a debounced version of a value, updating only after `delay` ms without changes.
 * Lightweight (no external deps) and stable across renders.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
