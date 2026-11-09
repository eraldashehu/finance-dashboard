import { Button, Col, Flex, Layout, Row, Tooltip, Typography, theme } from 'antd';
import { MoonOutlined, RiseOutlined, SunOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ActivityCard, AllocationCard, HoldingsTable, KpiCards, PerformanceCard } from '../features/portfolio';
import { useThemeMode } from './theme/ThemeContext';

export default function App() {
  const { mode, toggle } = useThemeMode();
  const { token } = theme.useToken();

  return (
    <Layout className="app-layout" style={{ background: token.colorBgLayout }}>
      <Layout.Header className="app-header" style={{ background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Flex align="center" justify="space-between" gap={12}>
          <Flex align="center" gap={12}>
            <span className="logo" style={{ background: token.colorPrimary }} aria-hidden="true">
              <RiseOutlined />
            </span>
            <div>
              <Typography.Title level={5} style={{ margin: 0 }}>
                LedgerLens
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Demo portfolio · sample data
              </Typography.Text>
            </div>
          </Flex>
          <Flex align="center" gap={12}>
            <Typography.Text type="secondary" className="updated">
              Updated {dayjs().format('D MMM YYYY')}
            </Typography.Text>
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <Button shape="circle" icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />} onClick={toggle} aria-label="Switch color theme" />
            </Tooltip>
          </Flex>
        </Flex>
      </Layout.Header>

      <Layout.Content className="app-content">
        <Flex vertical gap={16}>
          <KpiCards />
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <PerformanceCard />
            </Col>
            <Col xs={24} xl={8}>
              <AllocationCard />
            </Col>
            <Col xs={24} xl={16}>
              <HoldingsTable />
            </Col>
            <Col xs={24} xl={8}>
              <ActivityCard />
            </Col>
          </Row>
        </Flex>
        <Typography.Paragraph type="secondary" className="foot">
          Built with React, TypeScript and Ant Design · All figures are generated demo data, not financial advice.
        </Typography.Paragraph>
      </Layout.Content>
    </Layout>
  );
}
