import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Measures an element's width and updates when it resizes.
 * Uses ResizeObserver (not window resize), so it also reacts to sidebars,
 * grid changes and font loading.
 */
export function useElementWidth<T extends HTMLElement>(fallback = 600): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      // Only update when the width really changed, to avoid extra renders.
      setWidth((prev) => (prev === next ? prev : next));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
