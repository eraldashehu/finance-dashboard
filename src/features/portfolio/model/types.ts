export type Sector = 'Technology' | 'Healthcare' | 'Energy' | 'Financials' | 'Consumer' | 'Industrials' | 'Fixed income';

export interface Holding {
  ticker: string;
  name: string;
  sector: Sector;
  shares: number;
  avgCost: number;
  price: number;
  /** Today's change in percent */
  dayChangePct: number;
}

/** A holding with values derived from price and cost. */
export interface HoldingRow extends Holding {
  value: number;
  cost: number;
  gain: number;
  gainPct: number;
  /** Share of the whole portfolio, in percent */
  weight: number;
}

export interface PricePoint {
  /** ISO date "YYYY-MM-DD" */
  date: string;
  value: number;
}

export interface PortfolioTotals {
  value: number;
  cost: number;
  gain: number;
  gainPct: number;
  dayChange: number;
  dayChangePct: number;
  positions: number;
  sectors: number;
}

export interface SectorSlice {
  sector: Sector;
  value: number;
  /** Percent of total */
  share: number;
}

export type TransactionType = 'Buy' | 'Sell' | 'Dividend';

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  ticker: string;
  amount: number;
}

export type RangeKey = '1M' | '3M' | '6M' | '1Y';

export interface PeriodChange {
  abs: number;
  pct: number;
}

export interface PortfolioFilters {
  range: RangeKey;
  sector: Sector | null;
  search: string;
}
