import { createContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { holdings as defaultHoldings, transactions as defaultTransactions } from '../data/portfolio';
import { RANGE_DAYS, buildHistory, computeTotals, filterRows, groupBySector, periodChange, toRows } from '../lib/calculations';
import type {
  Holding,
  HoldingRow,
  PeriodChange,
  PortfolioFilters,
  PortfolioTotals,
  PricePoint,
  RangeKey,
  Sector,
  SectorSlice,
  Transaction,
} from '../model/types';

export interface PortfolioData {
  rows: HoldingRow[];
  visibleRows: HoldingRow[];
  totals: PortfolioTotals;
  series: PricePoint[];
  change: PeriodChange;
  bySector: SectorSlice[];
  transactions: Transaction[];
}

export interface PortfolioFiltersApi {
  filters: PortfolioFilters;
  setRange: (range: RangeKey) => void;
  setSector: (sector: Sector | null) => void;
  toggleSector: (sector: Sector) => void;
  setSearch: (search: string) => void;
}

type FilterAction =
  | { type: 'range'; range: RangeKey }
  | { type: 'sector'; sector: Sector | null }
  | { type: 'toggleSector'; sector: Sector }
  | { type: 'search'; search: string };

export function filtersReducer(state: PortfolioFilters, action: FilterAction): PortfolioFilters {
  switch (action.type) {
    case 'range':
      return state.range === action.range ? state : { ...state, range: action.range };
    case 'sector':
      return { ...state, sector: action.sector };
    case 'toggleSector':
      return { ...state, sector: state.sector === action.sector ? null : action.sector };
    case 'search':
      return { ...state, search: action.search };
  }
}

const initialFilters: PortfolioFilters = { range: '6M', sector: null, search: '' };

export const PortfolioDataContext = createContext<PortfolioData | null>(null);
export const PortfolioFiltersContext = createContext<PortfolioFiltersApi | null>(null);

interface PortfolioProviderProps {
  children: ReactNode;
  holdings?: Holding[];
  transactions?: Transaction[];
}

/**
 * Holds the filters and derives everything else from the raw data.
 * Each derived value has its own useMemo, so changing the search only
 * recomputes the visible rows, not the chart or the totals.
 */
export function PortfolioProvider({ children, holdings = defaultHoldings, transactions = defaultTransactions }: PortfolioProviderProps) {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  const rows = useMemo(() => toRows(holdings), [holdings]);
  const totals = useMemo(() => computeTotals(rows), [rows]);
  const bySector = useMemo(() => groupBySector(rows), [rows]);
  const history = useMemo(() => buildHistory(totals.value), [totals.value]);
  const series = useMemo(() => history.slice(-RANGE_DAYS[filters.range]), [history, filters.range]);
  const change = useMemo(() => periodChange(series), [series]);
  const visibleRows = useMemo(() => filterRows(rows, filters.sector, filters.search), [rows, filters.sector, filters.search]);

  const data = useMemo<PortfolioData>(
    () => ({ rows, visibleRows, totals, series, change, bySector, transactions }),
    [rows, visibleRows, totals, series, change, bySector, transactions]
  );

  const filtersApi = useMemo<PortfolioFiltersApi>(
    () => ({
      filters,
      setRange: (range) => dispatch({ type: 'range', range }),
      setSector: (sector) => dispatch({ type: 'sector', sector }),
      toggleSector: (sector) => dispatch({ type: 'toggleSector', sector }),
      setSearch: (search) => dispatch({ type: 'search', search }),
    }),
    [filters]
  );

  return (
    <PortfolioFiltersContext.Provider value={filtersApi}>
      <PortfolioDataContext.Provider value={data}>{children}</PortfolioDataContext.Provider>
    </PortfolioFiltersContext.Provider>
  );
}
