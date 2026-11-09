import { useContext } from 'react';
import { PortfolioDataContext, PortfolioFiltersContext } from '../context/PortfolioContext';
import type { PortfolioData, PortfolioFiltersApi } from '../context/PortfolioContext';

/** All derived portfolio data: rows, totals, chart series, sectors, activity. */
export function usePortfolioData(): PortfolioData {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) throw new Error('usePortfolioData must be used inside <PortfolioProvider>');
  return ctx;
}

/** Current filters (range, sector, search) and functions to change them. */
export function usePortfolioFilters(): PortfolioFiltersApi {
  const ctx = useContext(PortfolioFiltersContext);
  if (!ctx) throw new Error('usePortfolioFilters must be used inside <PortfolioProvider>');
  return ctx;
}
