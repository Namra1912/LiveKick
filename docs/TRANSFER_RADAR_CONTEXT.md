# LiveKick — Transfer Radar Page: Comprehensive Context & Implementation Document

> **Status:** Fully Implemented & Polished (Passes 1–9 Complete).
> **Purpose:** Canonical source of truth for the Transfer Radar feature (`/transfers`). Use this file as context for AI prompts, code reviews, and future feature expansion.

---

## 1. Executive Summary & Tech Stack

LiveKick's **Transfer Radar** page (`/transfers`) is a real-time football transfer and rumor tracking index built with FotMob-inspired table aesthetics and dense, dark stadium UI design.

### Core Stack & Architecture Rules
- **React 19 + Vite 8** (ES Modules, `"type": "module"`)
- **React Router v7** (`useNavigate`, `/teams/:id`, `/players/:id`)
- **No Tailwind** — Plain Vanilla CSS using tokens defined in `src/styles/tokens.css`
- **lucide-react** for all UI iconography
- **Self-hosted Fonts via `@fontsource`** — `Big Shoulders Display` (headings), `Inter` (body), `JetBrains Mono` (fees, timestamps, countdown numbers with `tabular-nums`)
- **Client-Side Filter Pipeline** — All filtering, in-table sorting, search debouncing, and pagination run via React `useMemo` & `useEffect` on mock data (`src/data/mockData.js`)

---

## 2. Design Tokens & Visual Architecture

All Transfer Radar components strictly consume tokens defined in `src/styles/tokens.css`.

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
--color-border-focus:     #00B370;   /* Focus ring color */

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
        Crest.jsx + Crest.css             ← Canonical club/league badge logo & HSL nameToHue monogram component
        Breadcrumb.jsx                    ← Page header breadcrumb bar
      transfers/
        TierPill.jsx + TierPill.css       ← Credibility badge component (TIER 1/2/3)
        TransferCard.jsx + .css           ← 5-column inert table row component with HSL player monogram
        TeamLeagueSearch.jsx + .css       ← Autocomplete team/league search with debouncing & chips
        FeeRangeSlider.jsx + .css         ← Dual-handle fee range slider (€0M - €150M+)
        TimeframeSelect.jsx + .css        ← Custom popover dropdown for timeframe filtering
        TransferSidebar.jsx + .css        ← Single sticky right panel (Filters + Top Deals + Countdown)
    pages/
      Transfers.jsx + Transfers.css       ← Main route page controller & state management pipeline
    data/
      mockData.js                         ← Mock dataset (transfers array, leagues array, TRANSFER_WINDOW_DEADLINE)
```

---

## 4. Component Specifications & Implementation Details

### 4.1 `mockData.js` — Data Model & Constants
- Exported array `export const transfers` contains **15 realistic mock items**.
- Exported array `export const leagues` contains **6 major leagues** with official badge URLs.
- Exported constant `export const TRANSFER_WINDOW_DEADLINE = '2026-09-01T23:59:59Z'`.

```javascript
{
  id: 1,
  player: 'Kylian Mbappé',
  playerPhoto: null,            // Falsy value triggers deterministic HSL monogram; img onError pipeline ready for API
  position: 'ST',               // "ST" | "AM" | "CM" | "CDM" | "LW" | "RW" | "LB" | "RB" | "CB" | "GK"
  age: 26,
  fromTeam: teamObject,         // Team object ({ id, name, shortName, logoUrl, crestUrl })
  toTeam: teamObject | null,    // Null if destination is unknown
  fee: 'FREE',                  // "€85M" | "£105M" | "FREE" | "LOAN" | "UNDISCLOSED"
  transferType: 'free',         // "permanent" | "loan" | "free"
  tier: 1,                      // 1 | 2 | 3
  status: 'confirmed',          // "confirmed" | "rumor" | "negotiating" | "loan"
  league: 'La Liga',            // "Premier League" | "La Liga" | "Serie A" | "Bundesliga" | "Ligue 1"
  timestamp: '2h ago',          // Relative time string
  transferDate: '2025-07-01',   // ISO date string
  sourceName: 'Fabrizio Romano' // Journalist or media source
}
```

---

### 4.2 FotMob Inert Row & Navigation (`TransferCard.jsx`)
Renders each transfer item as a **5-column FotMob-style CSS Grid row**:

```css
grid-template-columns: 220px 1fr 80px 64px 72px;
```

- **Row Navigation Rule (FotMob Parity)**: The outer `.transfer-card` container is **inert** (`cursor: default`, no wrapper click handler or hover chevron). Only named entities are clickable links:
  - Team Crest/Name (`fromTeam` / `toTeam`) → `/teams/:id`
  - Player Avatar/Name → `/players/:id`
- **Col 1 (Clubs — 220px)**: `fromTeam` crest (22px) + shortName → ArrowRight icon (10px) → `toTeam` crest (22px) + shortName.
- **Col 2 (Player — 1fr)**:
  - 38px player avatar circle with position badge overlay (`.transfer-card__position-badge`) in bottom-right corner.
  - **Deterministic HSL Monogram**: Uses `nameToHue(player.name)` from `Crest.jsx` to render a unique stadium-tinted background (`hsl(hue, 42%, 22%)`), border (`hsl(hue, 42%, 32%)`), and text color (`hsl(hue, 75%, 85%)`) for every player.
  - Player name (clickable to `/players/:id`). If `status === 'confirmed'`, displays a 5px glowing green dot (`.transfer-card__confirmed-dot`).
  - Subtext: `{position} · {age}`.
- **Col 3 (Fee — 80px, Right-Aligned)**: Monospace font (`var(--font-mono)`). Green for `FREE`/`LOAN`, dim for `UNDISCLOSED`.
- **Col 4 (Tier — 64px, Centered)**: `<TierPill tier={tier} />` (`TIER 1`, `TIER 2`, `TIER 3`).
- **Col 5 (Date — 72px, Right-Aligned)**: Relative timestamp string in `--color-faint`.
- **Hover & Tier Accents**: Row background highlights with `--color-surface` and reveals a 3px tier-colored left border (T1: green, T2: gold, T3: faint). Confirmed deals show permanent green left border.

---

### 4.3 Center Feed & In-Table Sorting (`Transfers.jsx`)
- **Feed Header**: Contains 4 top-level category tabs (`ALL TRANSFERS`, `TIER 1`, `DONE DEALS`, `RUMORS`).
- **In-Table Column Header Sorting**:
  - `FEE` and `DATE` table headers are clickable sort buttons with directional chevron glyphs (`ChevronDown`/`ChevronUp`) and neutral default icons (`ArrowUpDown`).
  - **Mutually Exclusive State**: Single state `sortKey` (`'date'` | `'fee'`) ensures only one column header is active at a time.

---

### 4.4 Sticky Filter Panel Sidebar (`TransferSidebar.jsx`)
Located in `<aside className="transfers__right">` with `position: sticky; top: var(--space-4)`:

1. **Panel Header**:
   - Title `FILTERS` with an active filter counter badge (`N active`) and a `Reset` button when any filter is active.
2. **Team & League Autocomplete Search (`TeamLeagueSearch.jsx`)**:
   - ~200ms query debouncing.
   - Keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`, `.tls-option--highlighted`).
   - Renders real league crest badges via `Crest` component (`logoUrl`).
   - Additive multi-select chips with crest + name + `✕` remove button.
3. **Fee Range Slider (`FeeRangeSlider.jsx`)**:
   - Dual-handle range slider (`€0M` to `€150M+`).
   - **Tab Clamping**: Handles automatically clamp into valid bounds on tab changes (`activeTab`) to prevent zero-result states.
4. **Timeframe Dropdown (`TimeframeSelect.jsx`)**:
   - Custom popover dropdown: `Anytime`, `Past 24 Hours`, `Past 7 Days`, `Past 30 Days`.
5. **Secondary Filters Disclosure**:
   - Collapsible section (`More filters` / `Fewer filters`) containing `Position` pills and `Transfer Type` pills (`Permanent`, `Loan`, `Free`).
6. **Top Deals Widget**:
   - Integrated section showing top 3 confirmed deals sorted by fee.
   - **Design Rationale**: Kept intentionally global (independent of feed filters) to act as a fixed reference point.
7. **Transfer Window Countdown Widget**:
   - Real-time countdown timer displaying `DAYS : HRS : MINS : SECS` until `TRANSFER_WINDOW_DEADLINE`.
   - Uses `font-variant-numeric: tabular-nums` to prevent horizontal width shifting as seconds tick.

---

### 4.5 Filter & Pagination Pipeline (`Transfers.jsx`)
- All filter changes (`activeTab`, `selectedTeamLeagues`, `feeRange`, `timeframeFilter`, `positionFilter`, `transferTypeFilter`, `sortKey/sortDir`, `handleResetFilters`) automatically reset `visibleCount` to `8`.
- "Load More Transfers" button increments `visibleCount` by 8 until all items are loaded, where "You're all caught up" is displayed.

---

## 5. Future Improvement Roadmap

1. **Backend API Integration**: Replace mock dataset with Express/MongoDB transfer feeds and real player photo URLs.
2. **Transfer Probability Meter**: For rumors, add a visual 0-100% progress gauge based on Tier rating and recency.
3. **Interactive Player Profile Modal**: Slide-over drawer detailing player appearance stats, market value history, and deal add-ons.
4. **Mobile Responsive Card View**: Convert table rows into compact stacked cards for viewports under `<640px`.
