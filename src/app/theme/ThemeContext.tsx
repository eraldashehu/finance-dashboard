import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { usePersistentState } from '../../shared/hooks/usePersistentState';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isMode = (v: unknown): v is ThemeMode => v === 'light' || v === 'dark';

/** Light / dark mode for the whole app, applied through Ant Design's theme algorithms. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = usePersistentState<ThemeMode>('ledgerlens:theme', 'light', isMode);
  const toggle = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), [setMode]);
  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={{ algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside <ThemeProvider>');
  return ctx;
}
