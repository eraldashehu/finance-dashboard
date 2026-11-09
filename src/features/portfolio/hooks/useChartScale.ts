import { useMemo } from 'react';
import type { PricePoint } from '../model/types';

export interface ChartPoint extends PricePoint {
  x: number;
  y: number;
}

export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Turns a price series into SVG coordinates, paths and axis ticks.
 * Memoized on the data and size, so hovering the chart does not recompute it.
 */
export function useChartScale(data: PricePoint[], width: number, height: number, pad: ChartPadding) {
  return useMemo(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const lo = min - span * 0.08;
    const hi = max + span * 0.08;
    const innerW = Math.max(1, width - pad.left - pad.right);
    const innerH = Math.max(1, height - pad.top - pad.bottom);

    const x = (i: number) => pad.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : 0);
    const y = (v: number) => pad.top + (1 - (v - lo) / (hi - lo)) * innerH;

    const points: ChartPoint[] = data.map((d, i) => ({ ...d, x: x(i), y: y(d.value) }));
    const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
    const baseline = height - pad.bottom;
    const area = points.length ? `${line}L${points[points.length - 1].x},${baseline}L${points[0].x},${baseline}Z` : '';

    const yTicks = Array.from({ length: 4 }, (_, i) => {
      const v = lo + ((hi - lo) * i) / 3;
      return { value: v, y: y(v) };
    });
    const tickCount = width < 480 ? 3 : 6;
    const step = Math.max(1, Math.floor(points.length / tickCount));
    const xTicks = points.filter((_, i) => i % step === 0);

    return { points, line, area, yTicks, xTicks };
  }, [data, width, height, pad]);
}
