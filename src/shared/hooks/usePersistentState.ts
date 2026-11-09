import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** useState that is remembered in localStorage between visits. */
export function usePersistentState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T = (v): v is T => v !== undefined
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initial;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable: keep working for this visit.
    }
  }, [key, value]);

  return [value, setValue];
}
