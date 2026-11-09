import { memo, useMemo, useState } from 'react';
import { Card, Typography, theme } from 'antd';
import { SECTOR_COLORS } from '../data/portfolio';
import { usePortfolioData, usePortfolioFilters } from '../hooks/usePortfolio';
import { money } from '../lib/format';
import type { Sector } from '../model/types';

const R = 70;
const C = 2 * Math.PI * R;

/** Donut chart by sector. Clicking a slice or a legend row filters the holdings table. */
export const AllocationCard = memo(function AllocationCard() {
  const { bySector, totals } = usePortfolioData();
  const { filters, toggleSector } = usePortfolioFilters();
  const { token } = theme.useToken();
  const [hover, setHover] = useState<Sector | null>(null);

  const focus = hover ?? filters.sector;
  const focused = bySector.find((s) => s.sector === focus);

  // Each slice starts where the previous one ended; recomputed only when the data changes.
  const segments = useMemo(() => {
    let offset = 0;
    return bySector.map((s) => {
      const length = (s.share / 100) * C;
      const seg = { ...s, length, offset };
      offset += length;
      return seg;
    });
  }, [bySector]);

  return (
    <Card title="Allocation" extra={<Typography.Text type="secondary">Click a sector to filter</Typography.Text>}>
      <div className="donut-wrap">
        <svg viewBox="0 0 200 200" className="donut" role="img" aria-label="Allocation by sector">
          <circle cx="100" cy="100" r={R} fill="none" stroke={token.colorFillSecondary} strokeWidth={26} />
          {segments.map((s) => (
            <circle
              key={s.sector}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={SECTOR_COLORS[s.sector]}
              strokeWidth={focus === s.sector ? 32 : 26}
              strokeDasharray={`${Math.max(s.length - 2, 0)} ${C}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 100 100)"
              opacity={focus && focus !== s.sector ? 0.35 : 1}
              onMouseEnter={() => setHover(s.sector)}
              onMouseLeave={() => setHover(null)}
              onClick={() => toggleSector(s.sector)}
              style={{ cursor: 'pointer', transition: 'stroke-width .2s, opacity .2s' }}
            />
          ))}
          <text x="100" y="94" textAnchor="middle" fontSize={11} fill={token.colorTextSecondary}>
            {focused ? focused.sector : 'Total'}
          </text>
          <text x="100" y="116" textAnchor="middle" fontSize={18} fontWeight={700} fill={token.colorText}>
            {focused ? `${focused.share.toFixed(1)}%` : money(totals.value)}
          </text>
        </svg>

        <ul className="legend">
          {bySector.map((s) => (
            <li key={s.sector}>
              <button
                type="button"
                aria-pressed={filters.sector === s.sector}
                onClick={() => toggleSector(s.sector)}
                onMouseEnter={() => setHover(s.sector)}
                onMouseLeave={() => setHover(null)}
                style={{ background: filters.sector === s.sector ? token.colorFillSecondary : undefined, color: token.colorText }}
              >
                <i style={{ background: SECTOR_COLORS[s.sector] }} />
                <span>{s.sector}</span>
                <b>{s.share.toFixed(1)}%</b>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
});
