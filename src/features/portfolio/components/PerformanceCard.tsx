import { Card, Segmented } from 'antd';
import { usePortfolioData, usePortfolioFilters } from '../hooks/usePortfolio';
import { PerformanceChart } from './PerformanceChart';
import type { RangeKey } from '../model/types';

const RANGES: RangeKey[] = ['1M', '3M', '6M', '1Y'];

export function PerformanceCard() {
  const { series } = usePortfolioData();
  const { filters, setRange } = usePortfolioFilters();

  return (
    <Card
      title="Performance"
      extra={<Segmented<RangeKey> size="small" options={RANGES.map((r) => ({ label: r, value: r }))} value={filters.range} onChange={setRange} />}
    >
      <PerformanceChart data={series} />
    </Card>
  );
}
