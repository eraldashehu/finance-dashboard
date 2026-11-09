// Demo data only. Values are generated, not real market prices.
import type { Holding, Sector, Transaction } from '../model/types';

export const holdings: Holding[] = [
  { ticker: 'NOVA', name: 'Nova Systems', sector: 'Technology', shares: 42, avgCost: 118.4, price: 164.25, dayChangePct: 1.8 },
  { ticker: 'HELX', name: 'Helix Health', sector: 'Healthcare', shares: 60, avgCost: 72.1, price: 81.6, dayChangePct: -0.6 },
  { ticker: 'GRDN', name: 'Garden Energy', sector: 'Energy', shares: 120, avgCost: 24.9, price: 21.35, dayChangePct: -1.4 },
  { ticker: 'ORBT', name: 'Orbit Payments', sector: 'Financials', shares: 35, avgCost: 141.0, price: 176.8, dayChangePct: 0.9 },
  { ticker: 'LUMA', name: 'Luma Retail', sector: 'Consumer', shares: 80, avgCost: 38.2, price: 44.9, dayChangePct: 2.3 },
  { ticker: 'CRST', name: 'Crest Industrial', sector: 'Industrials', shares: 25, avgCost: 210.5, price: 198.7, dayChangePct: -0.3 },
  { ticker: 'VRTX', name: 'Vertex Cloud', sector: 'Technology', shares: 18, avgCost: 305.0, price: 352.4, dayChangePct: 1.1 },
  { ticker: 'BNDX', name: 'Global Bond ETF', sector: 'Fixed income', shares: 150, avgCost: 49.8, price: 50.6, dayChangePct: 0.1 },
];

export const SECTOR_COLORS: Record<Sector, string> = {
  Technology: '#1677ff',
  Healthcare: '#13c2c2',
  Energy: '#faad14',
  Financials: '#722ed1',
  Consumer: '#eb2f96',
  Industrials: '#2f54eb',
  'Fixed income': '#8c8c8c',
};

export const transactions: Transaction[] = [
  { id: 1, date: '2026-11-04', type: 'Buy', ticker: 'NOVA', amount: 1642.5 },
  { id: 2, date: '2026-11-02', type: 'Dividend', ticker: 'BNDX', amount: 63.0 },
  { id: 3, date: '2026-10-28', type: 'Sell', ticker: 'GRDN', amount: 854.0 },
  { id: 4, date: '2026-10-21', type: 'Buy', ticker: 'LUMA', amount: 898.0 },
  { id: 5, date: '2026-10-15', type: 'Dividend', ticker: 'ORBT', amount: 41.3 },
];
