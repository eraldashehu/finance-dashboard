# LedgerLens

Investment portfolio dashboard with KPI cards, a performance chart, an allocation donut and a sortable holdings table.
Built with **React 18**, **TypeScript** and **Ant Design 5**.

**Live demo:** https://eraldashehu.github.io/finance-dashboard/

## Features

- **KPI cards** with Ant Design `Statistic`: value, return for the selected period, unrealised gain, positions.
- **Performance chart** drawn with SVG, no chart library: 1M / 3M / 6M / 1Y ranges, hover tooltip, responsive width.
- **Allocation donut** by sector. Click a slice or legend row to filter the table.
- **Holdings table** with Ant Design `Table`: sorting on every column, search, sector filter tag, weight bars.
- **Light and dark mode** through Ant Design's theme algorithms, remembered between visits.
- Charts use **Ant Design design tokens** for colors, so they follow the theme automatically.

> All figures are generated demo data, not real market prices or financial advice.

## Tech stack

- [React 18](https://react.dev) with function components and hooks
- [TypeScript](https://www.typescriptlang.org) in strict mode
- [Ant Design 5](https://ant.design) components and `@ant-design/icons`
- [Day.js](https://day.js.org) for dates
- [Vite](https://vitejs.dev) for development and builds

## Getting started

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/eraldashehu/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run typecheck # check types with tsc
npm run build     # type-check, then production build in dist/
npm run preview   # serve the build locally
```

## Architecture

```
src/
├── main.tsx
├── app/
│   ├── App.tsx                       # page layout
│   ├── AppProviders.tsx              # ThemeProvider, AntApp, PortfolioProvider
│   └── theme/ThemeContext.tsx        # light/dark context + ConfigProvider algorithm
├── shared/hooks/
│   ├── usePersistentState.ts         # useState saved to localStorage
│   └── useElementWidth.ts            # ResizeObserver + useRef
└── features/portfolio/
    ├── index.ts                      # public API of the feature
    ├── model/types.ts                # Holding, Sector, PricePoint, filters…
    ├── data/portfolio.ts             # demo holdings and transactions
    ├── lib/
    │   ├── calculations.ts           # pure functions: rows, totals, sectors, history
    │   └── format.ts                 # Intl currency and percent formatting
    ├── context/PortfolioContext.tsx  # filters reducer + derived data, two contexts
    ├── hooks/
    │   ├── usePortfolio.ts           # usePortfolioData, usePortfolioFilters
    │   └── useChartScale.ts          # memoized SVG scales and paths
    └── components/                   # KpiCards, PerformanceCard/Chart, AllocationCard, HoldingsTable, ActivityCard
```

### How data flows

1. `PortfolioProvider` keeps only the **filters** (range, sector, search) in a `useReducer`.
2. Everything else is **derived** with one `useMemo` per value: rows → totals → sectors, history → series → change, rows + filters → visible rows. Changing the search recalculates only the visible rows.
3. Derived data and filter actions are exposed through **two contexts** and read with the custom hooks `usePortfolioData()` and `usePortfolioFilters()`.
4. All math lives in `lib/calculations.ts` as **pure functions**, separate from React.

## React techniques used, and why

| Technique | Where | Why |
|---|---|---|
| Context + `useReducer` | `PortfolioContext.tsx` | Filters shared by the chart, donut, KPIs and table without prop drilling |
| Derived state with `useMemo` | `PortfolioContext.tsx` | Store the minimum, calculate the rest, and only recalculate what changed |
| Theme context | `ThemeContext.tsx` | Dark/light mode for the whole app via Ant Design `ConfigProvider` algorithms |
| Design tokens (`theme.useToken`) | Charts, table | Custom SVG uses the same colors as Ant Design in both themes |
| Custom hooks | `usePortfolioData`, `usePortfolioFilters`, `useChartScale`, `useElementWidth`, `usePersistentState` | Logic is reusable and components stay small |
| `useRef` + `ResizeObserver` | `useElementWidth.ts` | Chart width follows its container, not just the window |
| `useRef` (DOM) | `PerformanceChart.tsx` | Reads the SVG position for the hover tooltip |
| `useCallback` | Chart hover, theme toggle | Stable handlers |
| `React.memo` | All cards and the chart | Skip re-rendering when the parent renders for unrelated reasons |
| Typed `Table` columns | `HoldingsTable.tsx` | `TableProps<HoldingRow>['columns']`: sorters and renderers are type-checked |

## Deploy

**GitHub Pages (automatic):** this repository includes `.github/workflows/deploy.yml`. In the repository go to **Settings → Pages**, set **Source** to **GitHub Actions**, then push. The app is published at `https://eraldashehu.github.io/finance-dashboard/`.

**GitLab Pages (automatic):** this repository includes `.gitlab-ci.yml`. Push it to GitLab and the live address appears under **Deploy → Pages**.

## Author

**Eralda Shehu**, Frontend Developer
[LinkedIn](https://www.linkedin.com/in/eralda-shehu/) · [GitHub](https://github.com/eraldashehu)
