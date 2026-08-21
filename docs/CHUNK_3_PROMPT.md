# LiveKick Transfer Radar — Chunk 3
## Two tasks: (A) Kill the green row flash, (B) Build the right panel sidebar

**Read `TRANSFER_RADAR_CONTEXT.md` before starting.**

---

## TASK A — Fix TransferCard.css (2 min job, do this first)

The confirmed rows are flashing green. Kill ALL of it. The feed must look like FotMob — dark, uniform rows. Status and tier are communicated ONLY through the tier pill and the small confirmed dot. Nothing else.

**In `TransferCard.css`, make these exact changes:**

Remove or zero out every green background on card rows:

```css
/* REPLACE the confirmed card rule with this — zero background, zero border tint */
.transfer-card--confirmed {
  border-left-color: var(--color-pitch-green);
}
.transfer-card--confirmed:hover {
  background: var(--color-surface);
  border-color: var(--color-border-dim);
  border-left-color: var(--color-pitch-green);
}
```

The confirmed dot next to player name — make it smaller and less glow:
```css
.transfer-card__confirmed-dot {
  width: 5px;
  height: 5px;
  min-width: 5px;
  border-radius: 50%;
  background: var(--color-pitch-green);
  display: inline-block;
  /* NO box-shadow, NO glow */
}
```

All tier cards — left border only shows on hover, not always:
```css
.transfer-card {
  border-left: 3px solid transparent; /* transparent always */
}
.transfer-card:hover {
  background: var(--color-surface);
  border-color: var(--color-border-dim);
}
.transfer-card--tier-1:hover { border-left-color: var(--color-pitch-green); }
.transfer-card--tier-2:hover { border-left-color: var(--color-gold); }
.transfer-card--tier-3:hover { border-left-color: var(--color-faint); }
```

Exception — confirmed cards ALWAYS show the green left border (not just on hover) because confirmed is a permanent state, not an interaction:
```css
.transfer-card--confirmed { border-left-color: var(--color-pitch-green); }
```

Result: rows look completely dark and uniform. Hover shows a subtle surface highlight + tier border. Confirmed always has the thin green left accent. That's all. No gradients, no glow, no green backgrounds.

Also remove the `transfer-card__avatar-fallback` green colour if it was set — it should use `var(--color-secondary)` text on `var(--color-surface-elevated)` background, nothing green.

Also in `TransferFilters.css` — the league filter pills moving to the sidebar means you can remove any league filter code from `TransferFilters` if it was added there. Position pills and sort dropdown stay.

---

## TASK B — Build the right panel sidebar

**CREATE these files:**
- `src/components/transfers/TransferSidebar.jsx`
- `src/components/transfers/TransferSidebar.css`

**MODIFY:**
- `src/pages/Transfers.jsx` — replace the `<aside>` placeholder content with `<TransferSidebar />`
- `src/data/mockData.js` — add `leagueFilter` and `timeframeFilter` state is handled in `Transfers.jsx`, not mockData

---

### Right panel layout — two sections, breathing room

```
┌─────────────────────────────┐
│                             │
│  FILTERS          (section) │
│  ─────────────────────      │
│  League                     │
│  [All][PL][La Liga]         │
│  [Serie A][BL][Ligue 1]     │
│                             │
│  Timeframe                  │
│  [Week][Month][All]         │
│                             │
│  ─────────────────────      │
│                             │
│  TOP DEALS        (section) │
│  ─────────────────────      │
│  1  Bellingham    €120M     │
│  2  D. Rice       £105M     │
│  3  V. Osimhen    €85M      │
│                             │
│  (whitespace — don't fill)  │
└─────────────────────────────┘
```

**Two sections. That's it. No more widgets. Rest of the panel is empty space.**

---

### TransferSidebar props

```jsx
// Props passed from Transfers.jsx:
{
  leagueFilter,       // String: 'all' | 'PL' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1'
  onLeagueChange,     // (league: String) => void
  timeframeFilter,    // String: 'week' | 'month' | 'all'
  onTimeframeChange,  // (tf: String) => void
  topDeals,           // Array: top 3 confirmed transfers sorted by fee (computed in Transfers.jsx)
}
```

---

### Section 1: Filters card

Outer card:
```css
.ts-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-dim);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

Section heading (used for both "FILTERS" label and filter group labels):
```css
.ts-section-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-faint);
}
```

Filter group (League or Timeframe):
```css
.ts-filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.ts-filter-group__label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-secondary);
}
```

Pill buttons (same style as position pills in the feed):
```css
.ts-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.ts-pill {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all 0.12s ease;
  white-space: nowrap;
  line-height: 1.4;
}
.ts-pill:hover {
  border-color: var(--color-secondary);
  color: var(--color-primary);
}
.ts-pill--active {
  background: var(--color-pitch-green);
  border-color: var(--color-pitch-green);
  color: #000;
  font-weight: 700;
}
```

League options:
```js
const LEAGUES = [
  { value: 'all', label: 'All' },
  { value: 'PL', label: 'PL' },
  { value: 'La Liga', label: 'La Liga' },
  { value: 'Serie A', label: 'Serie A' },
  { value: 'Bundesliga', label: 'BL' },
  { value: 'Ligue 1', label: 'L1' },
];
```

Timeframe options:
```js
const TIMEFRAMES = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];
```

Full filter card JSX:
```jsx
<div className="ts-card">
  <span className="ts-section-label">Filters</span>

  <div className="ts-filter-group">
    <span className="ts-filter-group__label">League</span>
    <div className="ts-pills">
      {LEAGUES.map(l => (
        <button
          key={l.value}
          type="button"
          className={`ts-pill${leagueFilter === l.value ? ' ts-pill--active' : ''}`}
          onClick={() => onLeagueChange(l.value)}
        >
          {l.label}
        </button>
      ))}
    </div>
  </div>

  <div className="ts-filter-group">
    <span className="ts-filter-group__label">Timeframe</span>
    <div className="ts-pills">
      {TIMEFRAMES.map(t => (
        <button
          key={t.value}
          type="button"
          className={`ts-pill${timeframeFilter === t.value ? ' ts-pill--active' : ''}`}
          onClick={() => onTimeframeChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
</div>
```

---

### Section 2: Top Deals widget

```jsx
<div className="ts-card">
  <span className="ts-section-label">Top Deals</span>
  <div className="ts-top-deals">
    {topDeals.map((deal, i) => (
      <div key={deal.id} className="ts-deal-row">
        <span className={`ts-deal-rank${i === 0 ? ' ts-deal-rank--1' : ''}`}>
          {i + 1}
        </span>
        <div className="ts-deal-info">
          <span className="ts-deal-name">{deal.player}</span>
          <span className="ts-deal-clubs">
            {deal.fromTeam?.shortName} → {deal.toTeam?.shortName}
          </span>
        </div>
        <span className="ts-deal-fee">{deal.fee}</span>
      </div>
    ))}
    {topDeals.length === 0 && (
      <span className="ts-empty">No confirmed deals yet</span>
    )}
  </div>
</div>
```

```css
.ts-top-deals {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.ts-deal-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.ts-deal-rank {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-faint);
  min-width: 14px;
  text-align: center;
}
.ts-deal-rank--1 {
  color: var(--color-pitch-green);
}
.ts-deal-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ts-deal-name {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ts-deal-clubs {
  font-size: 10px;
  color: var(--color-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ts-deal-fee {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
  flex-shrink: 0;
}
.ts-empty {
  font-size: 11px;
  color: var(--color-faint);
}
```

---

### Full TransferSidebar.jsx

```jsx
import './TransferSidebar.css';

const LEAGUES = [
  { value: 'all', label: 'All' },
  { value: 'PL', label: 'PL' },
  { value: 'La Liga', label: 'La Liga' },
  { value: 'Serie A', label: 'Serie A' },
  { value: 'Bundesliga', label: 'BL' },
  { value: 'Ligue 1', label: 'L1' },
];

const TIMEFRAMES = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export default function TransferSidebar({
  leagueFilter, onLeagueChange,
  timeframeFilter, onTimeframeChange,
  topDeals,
}) {
  return (
    <div className="transfer-sidebar">
      {/* Filters card */}
      <div className="ts-card"> ... </div>

      {/* Top deals card */}
      <div className="ts-card"> ... </div>
    </div>
  );
}
```

```css
.transfer-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  /* rest of space below the two cards = empty — intentional */
}
```

---

### Transfers.jsx — add new state + pass to sidebar

**Add to existing state in Transfers.jsx:**
```js
const [leagueFilter, setLeagueFilter] = useState('all');
const [timeframeFilter, setTimeframeFilter] = useState('all');
```

**Add league + timeframe to the `filtered` useMemo:**
```js
// Inside the useMemo, after existing filters:
if (leagueFilter !== 'all') {
  result = result.filter(t => t.league === leagueFilter);
}
if (timeframeFilter === 'week') {
  // For mock data: filter items where timestamp includes 'h ago' or '1d ago'
  result = result.filter(t => {
    const ts = t.timestamp ?? '';
    return ts.includes('h ago') || ts === '1d ago';
  });
}
if (timeframeFilter === 'month') {
  // For mock data: exclude anything '30d ago' or more
  result = result.filter(t => {
    const ts = t.timestamp ?? '';
    const days = parseInt(ts);
    if (ts.includes('h ago')) return true;
    if (ts.includes('d ago') && days <= 30) return true;
    return false;
  });
}
```

**Add `leagueFilter` and `timeframeFilter` to the `useMemo` dependency array.**

**Compute topDeals for sidebar:**
```js
const topDeals = useMemo(() => {
  const parseFee = (fee) => {
    if (!fee || fee === 'FREE' || fee === 'LOAN' || fee === 'UNDISCLOSED') return -1;
    return parseFloat(fee.replace(/[^0-9.]/g, '')) || -1;
  };
  return [...transfers]
    .filter(t => t.status === 'confirmed')
    .sort((a, b) => parseFee(b.fee) - parseFee(a.fee))
    .slice(0, 3);
}, []); // static — doesn't change with filters
```

**Replace the `<aside>` in JSX:**
```jsx
<aside className="transfers__right" aria-label="Transfer filters and stats">
  <TransferSidebar
    leagueFilter={leagueFilter}
    onLeagueChange={(l) => { setLeagueFilter(l); setVisibleCount(8); }}
    timeframeFilter={timeframeFilter}
    onTimeframeChange={(t) => { setTimeframeFilter(t); setVisibleCount(8); }}
    topDeals={topDeals}
  />
</aside>
```

**Add import at top of Transfers.jsx:**
```js
import TransferSidebar from '../components/transfers/TransferSidebar';
```

---

## Deliverable checklist:
- [ ] Task A: confirmed rows have ZERO green background — completely dark like other rows
- [ ] Task A: left border is transparent always, shows on hover (tier-coloured), confirmed always shows green left border
- [ ] Task A: confirmed dot is 5px, no glow/box-shadow
- [ ] Task A: avatar fallback has NO green — secondary text on surface-elevated background
- [ ] Task B: `TransferSidebar.jsx` renders two cards — Filters and Top Deals
- [ ] Task B: League pill buttons filter the feed (connected via Transfers.jsx state)
- [ ] Task B: Timeframe pill buttons filter the feed
- [ ] Task B: Top Deals shows top 3 confirmed transfers sorted by fee (highest first)
- [ ] Task B: Rank #1 is green, ranks 2 and 3 are faint colour
- [ ] Task B: Right panel has only these two cards — nothing else, empty space below is intentional
- [ ] Task B: Both new state values (`leagueFilter`, `timeframeFilter`) added to `useMemo` dependency array
- [ ] No native `<select>` in the sidebar — pill buttons only
- [ ] No Tailwind, no hardcoded hex, no emoji
- [ ] Build passes cleanly
