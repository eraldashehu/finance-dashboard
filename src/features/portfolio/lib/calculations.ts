// Pure functions: no React, easy to test.
import type { Holding, HoldingRow, PeriodChange, PortfolioTotals, PricePoint, RangeKey, Sector, SectorSlice } from '../model/types';

export const RANGE_DAYS: Record<RangeKey, number> = { '1M': 30, '3M': 90, '6M': 182, '1Y': 365 };

export function toRows(holdings: Holding[]): HoldingRow[] {
  const withValue = holdings.map((h) => {
    const value = h.shares * h.price;
    const cost = h.shares * h.avgCost;
    return { ...h, value, cost, gain: value - cost, gainPct: ((value - cost) / cost) * 100 };
  });
  const total = withValue.reduce((sum, r) => sum + r.value, 0);
  return withValue.map((r) => ({ ...r, weight: total ? (r.value / total) * 100 : 0 }));
}

export function computeTotals(rows: HoldingRow[]): PortfolioTotals {
  const value = rows.reduce((s, r) => s + r.value, 0);
  const cost = rows.reduce((s, r) => s + r.cost, 0);
  // Today's change in money: value - value / (1 + pct/100)
  const dayChange = rows.reduce((s, r) => s + r.value - r.value / (1 + r.dayChangePct / 100), 0);
  return {
    value,
    cost,
    gain: value - cost,
    gainPct: cost ? ((value - cost) / cost) * 100 : 0,
    dayChange,
    dayChangePct: value - dayChange ? (dayChange / (value - dayChange)) * 100 : 0,
    positions: rows.length,
    sectors: new Set(rows.map((r) => r.sector)).size,
  };
}

export function groupBySector(rows: HoldingRow[]): SectorSlice[] {
  const map = new Map<Sector, number>();
  for (const r of rows) map.set(r.sector, (map.get(r.sector) ?? 0) + r.value);
  const total = rows.reduce((s, r) => s + r.value, 0);
  return [...map.entries()]
    .map(([sector, value]) => ({ sector, value, share: total ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function filterRows(rows: HoldingRow[], sector: Sector | null, search: string): HoldingRow[] {
  const q = search.trim().toLowerCase();
  return rows.filter(
    (r) => (!sector || r.sector === sector) && (!q || r.ticker.toLowerCase().includes(q) || r.name.toLowerCase().includes(q))
  );
}

export function periodChange(series: PricePoint[]): PeriodChange {
  if (series.length < 2) return { abs: 0, pct: 0 };
  const first = series[0].value;
  const last = series[series.length - 1].value;
  return { abs: last - first, pct: ((last - first) / first) * 100 };
}

/** Small seeded random generator so the demo looks the same on every load. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** One year of daily values ending at `endValue` today. */
export function buildHistory(endValue: number, today = new Date(), days = 365): PricePoint[] {
  const rand = seeded(42);
  const raw: number[] = [];
  let v = endValue * 0.82;
  for (let i = 0; i < days; i++) {
    v *= 1 + (rand() - 0.47) * 0.018;
    raw.push(v);
  }
  const k = endValue / raw[raw.length - 1];
  return raw.map((value, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return { date: d.toISOString().slice(0, 10), value: value * k };
  });
}
