import { memo, useCallback, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { theme } from 'antd';
import { useElementWidth } from '../../../shared/hooks/useElementWidth';
import { useChartScale } from '../hooks/useChartScale';
import type { ChartPoint, ChartPadding } from '../hooks/useChartScale';
import { longDate, money2, moneyShort, shortDate } from '../lib/format';
import type { PricePoint } from '../model/types';

const HEIGHT = 280;
const PAD: ChartPadding = { top: 16, right: 16, bottom: 28, left: 56 };

interface PerformanceChartProps {
  data: PricePoint[];
}

/**
 * SVG line chart, no chart library. Colors come from Ant Design design tokens,
 * so it follows light and dark mode automatically.
 */
export const PerformanceChart = memo(function PerformanceChart({ data }: PerformanceChartProps) {
  const { token } = theme.useToken();
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<ChartPoint | null>(null);
  const { points, line, area, yTicks, xTicks } = useChartScale(data, width, HEIGHT, PAD);

  const up = data.length > 1 && data[data.length - 1].value >= data[0].value;
  const color = up ? token.colorSuccess : token.colorError;
  const last = points[points.length - 1];

  const handleMove = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect || points.length === 0) return;
      const px = e.clientX - rect.left;
      // Points are evenly spaced, so the nearest one can be computed directly.
      const step = points.length > 1 ? (points[1].x - points[0].x) : 1;
      const i = Math.min(points.length - 1, Math.max(0, Math.round((px - PAD.left) / step)));
      setHover((prev) => (prev === points[i] ? prev : points[i]));
    },
    [points]
  );

  return (
    <div ref={wrapRef} className="chart-wrap">
      <svg
        ref={svgRef}
        width={width}
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        role="img"
        aria-label="Portfolio value over time"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="perfFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t.value}>
            <line x1={PAD.left} x2={width - PAD.right} y1={t.y} y2={t.y} stroke={token.colorBorderSecondary} strokeDasharray="3 4" />
            <text x={PAD.left - 8} y={t.y + 4} textAnchor="end" fontSize={11} fill={token.colorTextTertiary}>
              {moneyShort(t.value)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t.date} x={t.x} y={HEIGHT - 8} textAnchor="middle" fontSize={11} fill={token.colorTextTertiary}>
            {shortDate(t.date)}
          </text>
        ))}
        <path d={area} fill="url(#perfFill)" />
        <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        {last && <circle cx={last.x} cy={last.y} r={4.5} fill={color} stroke={token.colorBgContainer} strokeWidth={2} />}
        {hover && (
          <g pointerEvents="none">
            <line x1={hover.x} x2={hover.x} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke={token.colorTextQuaternary} strokeDasharray="3 3" />
            <circle cx={hover.x} cy={hover.y} r={5} fill={color} stroke={token.colorBgContainer} strokeWidth={2} />
          </g>
        )}
      </svg>
      {hover && (
        <div
          className="chart-tooltip"
          style={{
            left: Math.min(Math.max(hover.x, 70), width - 70),
            top: hover.y,
            background: token.colorBgSpotlight,
            color: token.colorTextLightSolid,
          }}
        >
          <span>{longDate(hover.date)}</span>
          <strong>{money2(hover.value)}</strong>
        </div>
      )}
    </div>
  );
});
