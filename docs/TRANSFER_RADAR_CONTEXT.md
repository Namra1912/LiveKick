# LiveKick — Transfer Radar Page: Comprehensive Context & Implementation Document

> **Status:** Phase 1 Complete (Chunks 1, 2, and 3 implemented).
> **Purpose:** Source of truth for the Transfer Radar feature. Use this file as context for AI prompts, code reviews, and future feature expansion.

---

## 1. Executive Summary & Tech Stack

LiveKick's **Transfer Radar** page (`/transfers`) is a real-time football transfer and rumor tracking index built with FotMob-inspired table aesthetics and dense, dark stadium UI design.

### Core Stack Rules
- **React 19 + Vite 8** (ES Modules, `"type": "module"`)
- **React Router v7** (`useNavigate`, `AppRouter.jsx`)
- **No Tailwind** — Plain CSS using CSS custom properties (`var(--token-name)`) from `src/styles/tokens.css`
- **lucide-react** for all UI iconography (no native emojis allowed)
- **Self-hosted Fonts via `@fontsource`** — `Big Shoulders Display` (headings), `Inter` (body), `JetBrains Mono` (fees/timestamps)
- **Client-Side Filter Architecture** — All filtering, sorting, and pagination run via React `useMemo` on mock data (`src/data/mockData.js`)

---

## 2. Design Tokens & Visual Architecture

All components consume tokens defined in `src/styles/tokens.css`.

### Key Design Tokens
```css
/* Surface Colors */
--color-base:             #080c11;   /* Page canvas background */
--color-surface:          #0d1520;   /* Standard card & row hover background */
--color-surface-elevated: #111820;   /* Popovers, pill backgrounds, avatar fallbacks */
--color-surface-hover:    #18222d;   /* Hover state for cards and menu items */

/* Border & Lines */
--color-border:           #1e2a35;   /* Standard container borders */
--color-border-dim:       #131c26;   /* Subtle divider lines */
--color-border-focus:     #00B370;   /* Accessibility focus ring color */

/* Typography Colors */
--color-primary:          #f1f5f9;   /* High-contrast primary text */
--color-secondary:        #94a3b8;   /* Muted secondary labels */
--color-faint:            #475569;   /* De-emphasized structural text */
--color-dimmer:           #334155;   /* Table arrow icons & dividers */

/* Brand & Accents */
--color-pitch-green:      #00B370;   /* Primary brand accent (Confirmed badges, Tier 1, active states) */
--color-gold:             #f59e0b;   /* Tier 2 rumor accent */
--color-category-transfers:#fb923c;   /* Subtitle orange accent */

/* Border Radii */
--radius-badge:  4px;      /* Monogram fallbacks & sharp tags */
--radius-card:   14px;     /* Outer containers & sidebar widgets */
--radius-pill:   9999px;   /* Filter pills & buttons */

/* Font Families */
--font-display: 'Big Shoulders Display', system-ui, sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', 'Courier New', monospace;
```

---

## 3. Implemented File & Folder Structure

```
frontend/
  src/
    components/
      shared/
        Crest.jsx + Crest.css         ← Canonical club logo & HSL monogram component
        Breadcrumb.jsx                ← Page header breadcrumb bar
      transfers/
        TierPill.jsx + TierPill.css   ← Credibility badge component (TIER 1/2/3)
        TransferCard.jsx + .css       ← 5-column table row component
        TransferFilters.jsx + .css    ← Tab row + Position pills + Custom sort popover
        TransferSidebar.jsx + .css    ← Right-panel sidebar (Filters card + Top Deals card)
    pages/
      Transfers.jsx + Transfers.css   ← Main route page controller & state management
    data/
      mockData.js                     ← Contains exported transfers mock data array
```

---

## 4. Current Component Specs & Architecture

### 4.1 `mockData.js` — Data Model
Exported array `export const transfers` contains **15 realistic mock items**.

```javascript
{
  id: 1,
  player: 'Kylian Mbappé',
  playerPhoto: 'https://ui-avatars.com/api/?name=Kylian+Mbappé&background=0d1520&color=00B370&size=128&bold=true&format=svg',
  position: 'ST',               // "ST" | "AM" | "CM" | "CDM" | "LW" | "RW" | "LB" | "RB" | "CB" | "GK"
  age: 26,
  fromTeam: teamObject,         // Full team object from teams array ({ id, name, shortName, logoUrl, crestUrl })
  toTeam: teamObject | null,    // Null if destination is unknown
  fee: 'FREE',                  // "€85M" | "£105M" | "FREE" | "LOAN" | "UNDISCLOSED"
  transferType: 'free',         // "permanent" | "loan" | "free"
  tier: 1,                      // 1 | 2 | 3 only
  status: 'confirmed',          // "confirmed" | "rumor" | "negotiating" | "loan"
  league: 'La Liga',            // "Premier League" | "La Liga" | "Serie A" | "Bundesliga" | "Ligue 1"
  timestamp: '2h ago',          // Relative time string
  transferDate: '2025-07-01',   // ISO date string
  sourceName: 'Fabrizio Romano' // Media outlet / journalist
}
```

---

### 4.2 `TransferFilters.jsx` — Filter & Control Bar
Includes:
1. **Tabs Row (Top)**:
   - Tabs: `ALL TRANSFERS` (`'all'`), `TIER 1` (`'tier1'`), `DONE DEALS` (`'done'`), `RUMORS` (`'rumors'`).
   - Active Tab: `--color-pitch-green` text with 2px bottom border.
2. **Position Pills Row (Bottom Left)**:
   - Horizontal scrollable pill buttons: `ALL`, `ST`, `AM`, `CM`, `CDM`, `LW`, `RW`, `LB`, `RB`, `CB`, `GK`.
   - Selected state: solid pitch green background (`#00B370`) with `#000` text.
3. **Sort Dropdown Panel (Bottom Right)**:
   - Custom floating popover panel (NOT native `<select>`).
   - Options: `Latest First` (`'recency'`), `Fee (High → Low)` (`'fee'`), `League A–Z` (`'league'`).
   - Dismisses automatically when clicking outside via React `useRef` + `useEffect`.

---

### 4.3 `TransferCard.jsx` — Table Row Component
Renders each transfer item as a **5-column FotMob-style CSS Grid row**:

```css
grid-template-columns: 220px 1fr 80px 64px 72px;
```

- **Col 1 (Clubs — 220px)**: `fromTeam` logo (22px) + shortName → ArrowRight icon (10px) → `toTeam` logo (22px) + shortName. Clickable to `/teams/:id`.
- **Col 2 (Player — 1fr)**:
  - 38px player avatar circle with an absolute-positioned position badge overlay (`.transfer-card__position-badge`) in the bottom-right corner.
  - Player name (clickable to `/players/:id`). If `status === 'confirmed'`, displays a 5px glowing green dot (`.transfer-card__confirmed-dot`).
  - Subtext: `{position} · {age}`.
- **Col 3 (Fee — 80px, Right-Aligned)**: Monospace font (`var(--font-mono)`). Green for `FREE`/`LOAN`, dim italic for `UNDISCLOSED`.
- **Col 4 (Tier — 64px, Centered)**: `<TierPill tier={tier} />` (`TIER 1`, `TIER 2`, `TIER 3`).
- **Col 5 (Date — 72px, Right-Aligned)**: Relative timestamp string in `--color-faint`.

#### Row States & Hover Behaviors:
- **Default State**: Dark uniform row with transparent left border.
- **Hover State**: Highlights with `--color-surface` background and reveals a 3px tier-colored left border (T1: green, T2: gold, T3: faint).
- **Confirmed State**: Permanently displays a 3px green left accent border (`--color-pitch-green`).

---

### 4.4 `TransferSidebar.jsx` — Right Panel Sidebar
Located in `<aside className="transfers__right">` (hides on mobile/tablet `<1024px`):

1. **Filters Card (`.ts-card`)**:
   - **League Filter Pills**: `All`, `PL`, `La Liga`, `Serie A`, `BL`, `L1`.
   - **Timeframe Filter Pills**: `This Week`, `This Month`, `All Time`.
   - Selected pill gets solid `--color-pitch-green` fill.
2. **Top Deals Widget (`.ts-card`)**:
   - Displays top 3 confirmed transfers sorted numerically by fee.
   - Shows rank number (`#1` highlighted in green), player name, transfer flow (`from → to`), and fee in monospace.

---

### 4.5 `Transfers.jsx` — Main Page Controller
- **State Managed**:
  - `activeTab` (`'all' | 'tier1' | 'done' | 'rumors'`)
  - `positionFilter` (`'all' | 'ST' | ...`)
  - `sortBy` (`'recency' | 'fee' | 'league'`)
  - `leagueFilter` (`'all' | 'PL' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1'`)
  - `timeframeFilter` (`'week' | 'month' | 'all'`)
  - `visibleCount` (initial 8 items, increments by 8 on "Load More")
  - `isSearchOpen` (controls `SearchModal` via `Cmd/Ctrl + K`)
- **Filtering Pipeline (`useMemo`)**:
  - Filters transfers sequentially across active tab, position pill, sidebar league, and sidebar timeframe.
  - Sorts by numeric fee parsing (converting `€85M` / `£105M` strings into numbers) or alphabetical league name.
- **Pagination**: Displays 8 items per page. Triggers "Load More Transfers" button or displays "You're all caught up" when exhausted.

---

## 13. Current State & Opportunities for Improvement

While the core Transfer Radar is fully functional, styled, and responsive, there are several key areas where the page can be enhanced further. Below are structured improvement topics for future prompt generation:

### A. UX & Filtering Enhancements
1. **Transfer Search Bar**: Add an in-page search input inside `TransferFilters` to instantly filter transfers by player name, team name, or source journalist.
2. **Transfer Type Filter**: Add a pill or toggle for `Permanent` vs `Loan` vs `Free Agent`.
3. **Filter Reset / Clear All Button**: When multiple filters (Position + League + Timeframe + Tab) are applied, show a clear "Reset Filters" pill showing active filter count.
4. **Market Value / Fee Range Slider**: Allow users to filter deals by fee brackets (e.g. `< €20M`, `€20M - €60M`, `€60M+`).

### B. Visual & Information Architecture Improvements
1. **Source Credibility & Media Badges**: Display source publication logos/chips (e.g. Fabrizio Romano, Sky Sports, The Athletic) with verification ticks on hover.
2. **Transfer Probability Meter / Rumor Gauge**: For unconfirmed rumors, add a visual 0-100% progress bar or credibility gauge based on Tier rating and recency.
3. **Interactive Transfer Detail Modal / Drawer**: Clicking a row opens a slide-over panel showing:
   - Full player profile stats (appearances, goals, market value trend).
   - Deal breakdown (agent fee, contract duration, add-ons).
   - Timeline of news articles linked to the transfer.
4. **Mobile Responsive Card Fallback**: On smaller mobile screens (`<640px`), convert table rows into compact cards so grid columns don't truncate text.

### C. Motion & Polish
1. **Framer Motion Row Transitions**: Add layout animations when switching tabs or applying filters so items re-order smoothly instead of snapping.
2. **Live Feed Sync Indicator**: Add a subtle "Live Syncing" pulse dot in the header showing when data was last updated (e.g., "Updated 42s ago").
3. **Stat Summary Header Cards**: Add 3 micro-metric cards above the table (e.g., Total Spend This Window, Highest Fee, Total Confirmed Deals).

---

> **Note for AI Prompt Generators:** Refer to Section 2 for token names, Section 3 for file paths, and Section 4 for current component signatures when drafting code modifications for LiveKick Transfer Radar.
