# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tooling & Commands

- Install dependencies: `npm install`
- Start dev server (Vite, port 3000 by default): `npm run dev`
- Create production build: `npm run build`
- Preview production build locally: `npm run preview`

Environment:
- Runtime: Node.js + Vite + React (TypeScript).
- Local env file: `.env.local` (not committed). Set `GEMINI_API_KEY=...` here to match the README and Vite config.
- Vite exposes this key via `define` as `process.env.API_KEY` and `process.env.GEMINI_API_KEY` (see `vite.config.ts`).

Testing:
- There is currently **no** `test` npm script or test harness configured. Before introducing automated tests, add a test runner (e.g. Vitest/Jest) and wire it in `package.json`.

## High‑Level Architecture

This is a single‑page React application (Vite + TypeScript) for building and managing export quotes. The core architectural idea is:

- **Static in‑memory data** representing clients, products, quotes, shipments, and analytics lives in `constants.ts`.
- **Domain types** that describe this data and cross‑component contracts live in `types.ts`.
- **Business logic utilities** for calculations (volume/weight, shipping, margins) live in `utils.ts`.
- **UI composition and state orchestration** live primarily in `App.tsx`, which wires the navigation rail, sidebar, central quote workspace, and right‑hand details panel.
- **Feature pages** under `pages/` implement specialized views for Products, Logistics, Clients, and Reports, using the shared data and types.

### Entry Point & Shell

- `index.tsx` is the React entry point. It mounts `<App />` into `#root` using `ReactDOM.createRoot` and wraps it in `React.StrictMode`.
- `App.tsx` is the application shell and primary state owner:
  - Global UI state: `activeView` (current section), `isDarkMode`, `showDetailsPanel`, `showNotifications`.
  - Domain state: `selectedQuote` (partial `Quote`), `selectedClient`, and the toast queue.
  - It derives initial values from `INITIAL_QUOTE` and `CLIENTS.tech_corp` in `constants.ts`.
  - It passes down **callbacks** to children for navigation, quote/client selection, dark mode toggle, and toast display.
  - It renders three main horizontal regions:
    - Left `NavigationRail` (icon‑only nav, dark‑mode toggle, notifications, user menu).
    - Center content, which is either the quotes workspace (`DirectorySidebar` + `ChatInterface` + optional `DetailsPanel`) or a feature page from `pages/` depending on `activeView`.
    - Global `Toast` overlay for notifications.

### Data & Domain Layer

- `types.ts` defines the **domain model** and shared contracts:
  - Core entities: `Client`, `Product`, `QuoteItem`, `Quote`, `Shipment`, `Document`, and `Analytics`, plus supporting value types like `Dimensions`, `Incoterm`, `ShipmentStatus`, `ContainerType`, `MonthlyMetric`.
  - Navigation and filter enums: `ViewType`, `QuoteStatusFilter`.
  - Callback contracts like `AppCallbacks` for passing typed handlers between components.
  - Any change to core business concepts (e.g. adding new fields to quotes, shipments, or analytics) should start here so all components share a consistent shape.

- `constants.ts` contains the **seed data** and static lookups used by almost every view:
  - `CLIENTS`, `PRODUCTS`, `RECENT_QUOTES`, `DOCUMENTS` model the demo dataset.
  - `INITIAL_QUOTE` provides the base quote loaded into the main workspace.
  - `SHIPMENTS` powers the Logistics view.
  - `ANALYTICS` (KPI aggregates, top products/clients, monthly metrics) powers the Reports view.
  - `INCOTERM_INFO` centralizes explanatory text for Incoterms used in Logistics and quote calculations.

  Most features treat this as a stand‑in for a backend. When adding new demo entities or fields, update this file alongside `types.ts`.

- `utils.ts` centralizes **calculation logic** used across views:
  - `calculateCBM` and `CONTAINER_20FT_CBM` for volume/container math.
  - `calculateItemMetrics` to derive per‑line total volume, weight, and cost from a `Product` and quantity.
  - `calculateShipping` encapsulates Incoterm‑dependent freight pricing based on chargeable weight.
  - `getMarginColor` maps a numeric margin to CSS class tokens for UI styling.

  These utilities are the main place to evolve pricing, logistics, or margin rules without scattering formulas across components.

### Core UI Components

#### Navigation & Layout

- `components/NavigationRail.tsx` renders the left vertical navigation bar:
  - Uses `ViewType` to define navigation items (Quotes, Products, Logistics, Clients, Reports).
  - Calls `onNavigate(view)` to switch `App`'s `activeView`.
  - Manages its own local UI state for the user menu and notification dropdown, but delegates the boolean `showNotifications` flag to `App`.
  - Exposes a dark‑mode toggle via `onToggleDarkMode`; `App` toggles a `dark` class on `document.documentElement`.

- `components/DirectorySidebar.tsx` is the left content sidebar in **Quotes** view:
  - Shows a searchable, filterable list of quotes built from `INITIAL_QUOTE` + `RECENT_QUOTES`.
  - Maintains UI state for the search query, active status filter, and whether filter chips are visible.
  - Emits selection events:
    - `onSelectQuote(partialQuote)` updates `App`'s `selectedQuote`.
    - `onSelectClient(client)` informs `App` (and ultimately `DetailsPanel`) of the focused client, and triggers a toast.
    - `onCreateQuote()` triggers new‑quote creation in `App`.
  - Also surfaces a small "Export Metrics" card and a horizontal list of top clients for quick selection.

- `components/DetailsPanel.tsx` is the right‑hand panel for **Logistics snapshot & documents** in Quotes view:
  - Inputs: `selectedClient`, `selectedQuote`, and callbacks `onClose`, `onShowToast`.
  - Uses `useMemo` to derive `totalWeight`, `totalVolume`, and `creditUsed` from `selectedQuote` and `selectedClient`.
  - Renders:
    - Client profile and credit usage bar.
    - Shipment specs derived from the current quote items.
    - A simple document list using `DOCUMENTS`, with simulated generate/download/preview flows.
    - A "Pro Tip" card that reacts to the current quote's Incoterm.

- `components/Toast.tsx` is a generic toast notification system:
  - `Toast` receives a list of `ToastMessage`s from `App` and renders them in a fixed bottom‑right stack.
  - Each `ToastItem` auto‑dismisses after `duration` (default 3s) and can be closed manually.
  - `App` is the only owner of the toast array; all other components ask `App` to display messages via `onShowToast`.

#### Quote Workspace (ChatInterface)

- `components/ChatInterface.tsx` is the **central quote builder** and contains most of the business behavior:
  - Inputs: `selectedQuote` (as a partial `Quote` from `App`), and callbacks `onShowToast` and `onSelectClient`.
  - Local state: the working `quote` object, product search and picker UI state, Incoterm selection, simulation/loading flags, and WhatsApp sharing state.
  - On mount or when `selectedQuote` changes, it merges the incoming partial quote into `INITIAL_QUOTE` to create a consistent `Quote` structure.
  - A `useEffect` watches `quote.items` and `quote.incoterm` and recomputes:
    - Item metrics (total weight, volume, cost) via `calculateItemMetrics`.
    - Financials: `subtotal`, `shippingCost` (via `calculateShipping`), `insuranceCost`, `tax`, `total`.
    - Profitability: `margin` (used to drive the "Margin Shield" UI and `getMarginColor`).
    - Container utilization against `CONTAINER_20FT_CBM`.
  - Provides line‑item operations:
    - Add product (from `PRODUCTS` with search and HS code matching).
    - Increment/decrement quantity and cascade total recalculation.
    - Remove items with corresponding toasts.
  - Surfaces logistics context:
    - Container utilization progress bar ("Container Tetris").
    - Dynamic display of freight and insurance costs depending on Incoterm.
  - Sharing and simulation hooks:
    - `simulateAIAssist()` currently simulates an AI hint via a timeout and toast, but is the natural place to add real Gemini API calls using the configured env vars.
    - `handleWhatsAppShare()` builds a formatted quote summary and opens the WhatsApp share URL in a new tab.

### Feature Pages

Each file under `pages/` implements the content portion for one `ViewType` when `App.activeView` is set accordingly.

- `pages/ProductsPage.tsx` — **Product catalog management**:
  - Uses `PRODUCTS` as initial state and supports add/edit/delete operations via a modal form.
  - Maintains search and "grid vs table" view mode.
  - Computes and displays per‑product margins based on `unitPrice` vs `costPrice` with visual thresholds.
  - Emits toasts on create/update/delete through `onShowToast`.

- `pages/LogisticsPage.tsx` — **Shipments & container planning**:
  - Uses `SHIPMENTS` and `INCOTERM_INFO` to:
    - Render a filterable list of shipments with status‑specific chips and basic tracking action.
    - Provide a container calculator that recommends a container (20ft/40ft/40ft HQ) based on entered weight/volume and shows utilization.
    - Render an Incoterms guide that expands per code to show seller vs buyer responsibilities.

- `pages/ClientsPage.tsx` — **Client management & profile view**:
  - Starts from `CLIENTS` (excluding the internal `me` entry) and allows adding & editing clients via a modal.
  - Supports search and status filters (`all`/`active`/`pending`/`inactive`).
  - When a client is selected, shows a detailed profile card with stats (quotes count, credit limit, preferred Incoterm, status) and a simple credit utilization panel.
  - Uses `RECENT_QUOTES` to render per‑client quote history and quick stats.
  - Uses `onNavigate('quotes')` to deep‑link back into the main quotes workspace from the history section.

- `pages/ReportsPage.tsx` — **Aggregated analytics**:
  - Uses `ANALYTICS` to drive KPI cards, a revenue trend bar chart, quote funnel, product performance table, and client performance/health visualizations.
  - Implements tabs for overview, product, and client analytics and a simple time‑range toggle that currently affects only the UI, not the dataset.
  - Exposes export actions that currently just raise success toasts via `onShowToast`.

## Working With & Extending the App

- **Changing business rules** (pricing, freight, margins, container thresholds): update `utils.ts` first, then adjust any dependent UI expectations in `ChatInterface` and `LogisticsPage`.
- **Modifying domain data** (adding new Incoterms, clients, shipments, or analytics): update `types.ts` and `constants.ts`, then update the consuming components in `pages/` and `components/` that display or filter those fields.
- **Adding a new primary view** (e.g. a Settings page):
  - Extend `ViewType` in `types.ts`.
  - Add a nav entry in `NavigationRail.tsx`.
  - Teach `App.renderMainContent` to render your new page component when `activeView` matches.

This structure keeps most business logic in a small set of shared files (`types.ts`, `constants.ts`, `utils.ts`, `ChatInterface.tsx`), with the rest of the UI composed of relatively thin, feature‑focused components and pages.