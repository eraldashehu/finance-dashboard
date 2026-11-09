import { memo } from 'react';
import { Card, Flex, Tag, Typography, theme } from 'antd';
import { usePortfolioData } from '../hooks/usePortfolio';
import { money2, shortDate } from '../lib/format';
import type { TransactionType } from '../model/types';

const TAG_COLOR: Record<TransactionType, string> = { Buy: 'blue', Sell: 'red', Dividend: 'green' };

export const ActivityCard = memo(function ActivityCard() {
  const { transactions } = usePortfolioData();
  const { token } = theme.useToken();

  return (
    <Card title="Recent activity">
      <Flex vertical>
        {transactions.map((t, i) => (
          <Flex
            key={t.id}
            align="center"
            gap={12}
            style={{ padding: '10px 0', borderTop: i ? `1px solid ${token.colorBorderSecondary}` : undefined }}
          >
            <Tag color={TAG_COLOR[t.type]} style={{ width: 72, textAlign: 'center', marginInlineEnd: 0 }}>
              {t.type}
            </Tag>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography.Text strong>{t.ticker}</Typography.Text>
              <br />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {shortDate(t.date)}
              </Typography.Text>
            </div>
            <Typography.Text strong style={{ color: t.type === 'Buy' ? undefined : token.colorSuccess, fontVariantNumeric: 'tabular-nums' }}>
              {t.type === 'Buy' ? '−' : '+'}
              {money2(t.amount)}
            </Typography.Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
});
