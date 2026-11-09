import { memo } from 'react';
import { Card, Col, Row, Statistic, theme } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { usePortfolioData, usePortfolioFilters } from '../hooks/usePortfolio';
import { money, pct } from '../lib/format';

export const KpiCards = memo(function KpiCards() {
  const { totals, change } = usePortfolioData();
  const { filters } = usePortfolioFilters();
  const { token } = theme.useToken();
  const tone = (n: number) => (n >= 0 ? token.colorSuccess : token.colorError);
  const arrow = (n: number) => (n >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />);

  const items = [
    {
      title: 'Portfolio value',
      value: money(totals.value),
      sub: `${pct(totals.dayChangePct)} today`,
      color: tone(totals.dayChangePct),
      icon: arrow(totals.dayChangePct),
    },
    {
      title: `Return (${filters.range})`,
      value: pct(change.pct),
      sub: money(change.abs),
      color: tone(change.pct),
      icon: arrow(change.pct),
    },
    {
      title: 'Unrealised gain',
      value: money(totals.gain),
      sub: `${pct(totals.gainPct)} on cost`,
      color: tone(totals.gain),
      icon: arrow(totals.gain),
    },
    { title: 'Positions', value: String(totals.positions), sub: `${totals.sectors} sectors`, color: token.colorTextSecondary, icon: null },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((k) => (
        <Col xs={12} lg={6} key={k.title}>
          <Card size="small">
            <Statistic title={k.title} value={k.value} />
            <div style={{ color: k.color, fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
              {k.icon} {k.sub}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
});
