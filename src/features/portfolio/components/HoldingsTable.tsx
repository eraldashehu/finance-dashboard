import { memo, useMemo } from 'react';
import { Card, Flex, Input, Progress, Table, Tag, Typography, theme } from 'antd';
import type { TableProps } from 'antd';
import { SECTOR_COLORS } from '../data/portfolio';
import { usePortfolioData, usePortfolioFilters } from '../hooks/usePortfolio';
import { money, money2, pct } from '../lib/format';
import type { HoldingRow } from '../model/types';

export const HoldingsTable = memo(function HoldingsTable() {
  const { visibleRows } = usePortfolioData();
  const { filters, setSearch, setSector } = usePortfolioFilters();
  const { token } = theme.useToken();

  // Column definitions depend only on theme colors, so they are built once per theme.
  const columns = useMemo<TableProps<HoldingRow>['columns']>(() => {
    const signed = (n: number, text: string) => (
      <span style={{ color: n >= 0 ? token.colorSuccess : token.colorError, fontVariantNumeric: 'tabular-nums' }}>{text}</span>
    );
    return [
      {
        title: 'Asset',
        dataIndex: 'ticker',
        key: 'ticker',
        fixed: 'left',
        sorter: (a, b) => a.ticker.localeCompare(b.ticker),
        render: (_: unknown, r: HoldingRow) => (
          <Flex align="center" gap={10}>
            <span className="sector-bar" style={{ background: SECTOR_COLORS[r.sector] }} />
            <div>
              <Typography.Text strong>{r.ticker}</Typography.Text>
              <br />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {r.name}
              </Typography.Text>
            </div>
          </Flex>
        ),
      },
      { title: 'Shares', dataIndex: 'shares', key: 'shares', align: 'right', sorter: (a, b) => a.shares - b.shares },
      { title: 'Price', dataIndex: 'price', key: 'price', align: 'right', sorter: (a, b) => a.price - b.price, render: (v: number) => money2(v) },
      {
        title: 'Today',
        dataIndex: 'dayChangePct',
        key: 'day',
        align: 'right',
        sorter: (a, b) => a.dayChangePct - b.dayChangePct,
        render: (v: number) => signed(v, pct(v)),
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        align: 'right',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.value - b.value,
        render: (v: number) => money(v),
      },
      {
        title: 'Return',
        dataIndex: 'gainPct',
        key: 'gainPct',
        align: 'right',
        sorter: (a, b) => a.gainPct - b.gainPct,
        render: (v: number) => signed(v, pct(v)),
      },
      {
        title: 'Weight',
        dataIndex: 'weight',
        key: 'weight',
        width: 160,
        sorter: (a, b) => a.weight - b.weight,
        render: (v: number) => <Progress percent={Number(v.toFixed(1))} size="small" showInfo format={(p?: number) => `${p}%`} />,
      },
    ];
  }, [token.colorSuccess, token.colorError]);

  return (
    <Card
      title="Holdings"
      styles={{ body: { padding: 0 } }}
      extra={
        <Flex gap={8} align="center">
          {filters.sector && (
            <Tag closable color="blue" onClose={() => setSector(null)}>
              {filters.sector}
            </Tag>
          )}
          <Input.Search
            allowClear
            placeholder="Search ticker or name"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
            aria-label="Search holdings"
          />
        </Flex>
      }
    >
      <Table<HoldingRow>
        rowKey="ticker"
        columns={columns}
        dataSource={visibleRows}
        pagination={false}
        size="middle"
        scroll={{ x: 760 }}
        locale={{ emptyText: `No holdings match “${filters.search}”` }}
      />
    </Card>
  );
});
