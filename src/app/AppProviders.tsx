import { App as AntApp } from 'antd';
import type { ReactNode } from 'react';
import { PortfolioProvider } from '../features/portfolio';
import { ThemeProvider } from './theme/ThemeContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AntApp>
        <PortfolioProvider>{children}</PortfolioProvider>
      </AntApp>
    </ThemeProvider>
  );
}
