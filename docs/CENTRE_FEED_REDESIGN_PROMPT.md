# LiveKick Transfer Radar — Centre Feed Redesign
## Full rewrite: TransferCard + TransferFilters → table-style premium layout

**Read `TRANSFER_RADAR_CONTEXT.md` before starting.**

**Files to modify:** `TransferCard.jsx`, `TransferCard.css`, `TransferFilters.jsx`, `TransferFilters.css`
**Files to NOT touch:** `mockData.js`, `TierPill.jsx`, `TierPill.css`, `Transfers.jsx`, `Transfers.css`

---

## The Problem with the Current UI

The current card-per-row layout with borders on every card looks "AI slop" — too many boxes, too much visual noise, no clear column structure. The fix is to move to a **table-style layout** inspired by how FotMob handles transfers: columns for From, To, Player, Fee, Tier, Date — clean rows instead of bordered cards.

---

## 1. REWRITE `TransferFilters.jsx` + `TransferFilters.css`

### New filter design: pill buttons + single sort dropdown

Replace the two `<select>` dropdowns entirely. Position filter becomes **clickable pill buttons**. Sort stays as a styled dropdown but built as a custom panel (not native `<select>`).

**Props (same as before):**
```js
{ activeTab, onTabChange, positionFilter, onPositionChange, sortBy, onSortChange }
```

**Tab row — unchanged, keep working logic**

**Position filter row — NEW: horizontal scrollable pill buttons:**

Replace the position `<select>` with this pill button row:
```
[ALL] [ST] [AM] [CM] [CDM] [LW] [RW] [LB] [RB] [CB] [GK]
```

Each is a `<button>` element:
- Default: `background: transparent`, `color: var(--color-secondary)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-pill)`, `padding: 4px 12px`, `font-size: 11px`, `font-weight: 600`, `letter-spacing: 0.04em`, `cursor: pointer`, `white-space: nowrap`
- Active (selected): `background: var(--color-pitch-green)`, `color: #000`, `border-color: var(--color-pitch-green)`, `font-weight: 700`
- Hover (non-active): `border-color: var(--color-secondary)`, `color: var(--color-primary)`
- Transition: `all 0.12s ease`

Pill row container:
```css
.tf-position-pills {
  display: flex;
  gap: var(--space-1);
  overflow-x: auto;
  scrollbar-width: none;  /* hide scrollbar */
  padding-bottom: 2px;    /* prevent clipping */
}
.tf-position-pills::-webkit-scrollbar { display: none; }
```

**Sort — custom dropdown panel (NOT native select):**

```jsx
// Internal state: const [sortOpen, setSortOpen] = useState(false)
// Ref for click-outside: const sortRef = useRef(null)
// useEffect to close on outside click

const SORT_OPTIONS = [
  { value: 'recency', label: 'Latest First' },
  { value: 'fee', label: 'Fee (High → Low)' },
  { value: 'league', label: 'League A–Z' },
];
```

Trigger button:
- Shows current sort label + ChevronDown icon
- `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-pill)`, `padding: 4px 12px`, `font-size: 11px`, `font-weight: 600`, `color: var(--color-primary)`, `cursor: pointer`
- Hover: `border-color: var(--color-pitch-green)`
- `display: flex; align-items: center; gap: 6px`

Dropdown panel (absolutely positioned):
```css
.tf-sort-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 160px;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-popover);
  z-index: 50;
  overflow: hidden;
}
.tf-sort-option {
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-secondary);
  cursor: pointer;
  transition: background 0.1s ease, color 0.1s ease;
}
.tf-sort-option:hover {
  background: var(--color-surface-hover);
  color: var(--color-primary);
}
.tf-sort-option--active {
  color: var(--color-pitch-green);
  font-weight: 600;
}
```

Wrapper for sort: `position: relative; display: inline-block`

**Full filter bar layout:**
```
[Tab row — full width, border-bottom]
[Position pills row ......................] [Sort dropdown — right-aligned]
```

Filter row container:
```css
.tf-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: var(--space-3);
}
.tf-filter-row__left {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.tf-filter-row__right {
  flex-shrink: 0;
}
```

---

## 2. REWRITE `TransferCard.jsx` + `TransferCard.css`

### New design: table-style row with column structure

The feed container in `Transfers.jsx` renders a column-header row ONCE at the top, then a list of `<TransferCard>` rows. Each row aligns to the same column widths using CSS grid.

**IMPORTANT: `Transfers.jsx` needs one small addition — add the column header row above the feed. Add this JSX inside the `<div className="transfers__feed">` before the `.map()`:**

```jsx
{/* Column headers */}
<div className="transfer-feed__header">
  <span className="transfer-feed__col transfer-feed__col--clubs">FROM → TO</span>
  <span className="transfer-feed__col transfer-feed__col--player">PLAYER</span>
  <span className="transfer-feed__col transfer-feed__col--fee">FEE</span>
  <span className="transfer-feed__col transfer-feed__col--tier">TIER</span>
  <span className="transfer-feed__col transfer-feed__col--date">DATE</span>
</div>
```

Add to `Transfers.css`:
```css
.transfer-feed__header {
  display: grid;
  grid-template-columns: 220px 1fr 80px 64px 72px;
  gap: var(--space-3);
  padding: 0 var(--space-4) var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border-dim);
}
.transfer-feed__col {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-faint);
}
.transfer-feed__col--clubs { } /* left-aligned */
.transfer-feed__col--player { }
.transfer-feed__col--fee { text-align: right; }
.transfer-feed__col--tier { text-align: center; }
.transfer-feed__col--date { text-align: right; }
```

### TransferCard row — grid layout matching headers

```css
.transfer-card {
  display: grid;
  grid-template-columns: 220px 1fr 80px 64px 72px;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-card);
  border: 1px solid transparent;   /* transparent by default */
  border-left: 3px solid transparent;
  transition: background 0.12s ease, border-color 0.12s ease;
  cursor: default;
  min-height: 0;
}
.transfer-card:hover {
  background: var(--color-surface);
  border-color: var(--color-border-dim);
  border-left-color: inherit;
}

/* Tier accent — left border only, shows on hover always */
.transfer-card--tier-1 { border-left-color: var(--color-pitch-green); }
.transfer-card--tier-2 { border-left-color: var(--color-gold); }
.transfer-card--tier-3 { border-left-color: var(--color-faint); }

/* Confirmed row — subtle green background tint always visible */
.transfer-card--confirmed {
  background: rgba(0, 179, 112, 0.04);
  border-color: rgba(0, 179, 112, 0.12);
  border-left-color: var(--color-pitch-green);
}
.transfer-card--confirmed:hover {
  background: rgba(0, 179, 112, 0.08);
  border-color: rgba(0, 179, 112, 0.2);
}

/* Tier 3 — slightly dimmer */
.transfer-card--tier-3 .transfer-card__player-name {
  color: var(--color-secondary);
}
```

### Column 1: Clubs (220px)

```jsx
<div className="transfer-card__clubs">
  {/* From club */}
  <div
    className="transfer-card__club"
    onClick={e => { e.stopPropagation(); navigate('/teams/' + item.fromTeam?.id); }}
  >
    <Crest team={item.fromTeam} size={22} />
    <span className="transfer-card__club-name">{item.fromTeam?.shortName ?? '?'}</span>
  </div>

  <ArrowRight size={10} className="transfer-card__arrow" />

  {/* To club */}
  {item.toTeam ? (
    <div
      className="transfer-card__club"
      onClick={e => { e.stopPropagation(); navigate('/teams/' + item.toTeam?.id); }}
    >
      <Crest team={item.toTeam} size={22} />
      <span className="transfer-card__club-name">{item.toTeam?.shortName ?? '?'}</span>
    </div>
  ) : (
    <div className="transfer-card__club transfer-card__club--unknown">
      <div className="transfer-card__unknown-crest">?</div>
      <span className="transfer-card__club-name">Unknown</span>
    </div>
  )}
</div>
```

```css
.transfer-card__clubs {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}
.transfer-card__club {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  min-width: 0;
  flex-shrink: 1;
}
.transfer-card__club:hover .transfer-card__club-name {
  color: var(--color-pitch-green);
}
.transfer-card__club-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 54px;
  transition: color 0.12s ease;
}
.transfer-card__arrow {
  color: var(--color-dimmer);
  flex-shrink: 0;
}
.transfer-card__unknown-crest {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 50%;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-faint);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}
```

### Column 2: Player (flex 1)

```jsx
<div
  className="transfer-card__player"
  onClick={() => navigate('/players/' + item.id)}
>
  <PlayerAvatar photo={item.playerPhoto} name={item.player} position={item.position} />
  <div className="transfer-card__player-info">
    <span className="transfer-card__player-name">
      {item.player}
      {item.status === 'confirmed' && (
        <span className="transfer-card__confirmed-dot" title="Confirmed" />
      )}
    </span>
    <span className="transfer-card__player-meta">{item.position} · {item.age}</span>
  </div>
</div>
```

`PlayerAvatar` component — photo with position badge overlay:
```jsx
function PlayerAvatar({ photo, name, position }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  return (
    <div className="transfer-card__avatar-wrap">
      {photo && !failed ? (
        <img
          src={photo}
          alt={name}
          className="transfer-card__avatar"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <div className="transfer-card__avatar-fallback">{initials}</div>
      )}
      <span className="transfer-card__position-badge">{position}</span>
    </div>
  );
}
```

```css
.transfer-card__player {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  min-width: 0;
}
.transfer-card__player:hover .transfer-card__player-name {
  color: var(--color-pitch-green);
}

/* Avatar wrapper — relative for badge overlay */
.transfer-card__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.transfer-card__avatar {
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  background: var(--color-surface-elevated);
}
.transfer-card__avatar-fallback {
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  border-radius: 50%;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
}

/* Position badge — bottom-right corner of avatar */
.transfer-card__position-badge {
  position: absolute;
  bottom: -2px;
  right: -4px;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-size: 8px;
  font-weight: 800;
  font-family: var(--font-body);
  color: var(--color-secondary);
  padding: 1px 3px;
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
}

.transfer-card__player-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.transfer-card__player-name {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.12s ease;
}
.transfer-card__confirmed-dot {
  width: 6px;
  height: 6px;
  min-width: 6px;
  border-radius: 50%;
  background: var(--color-pitch-green);
  display: inline-block;
  box-shadow: 0 0 4px rgba(0, 179, 112, 0.6);
}
.transfer-card__player-meta {
  font-size: 11px;
  color: var(--color-faint);
  white-space: nowrap;
}
```

### Column 3: Fee (80px, right-aligned)

```jsx
<div className="transfer-card__fee-col">
  <span className={getFeeClass(item.fee)}>{item.fee}</span>
</div>
```

```js
function getFeeClass(fee) {
  const f = fee?.toLowerCase() ?? '';
  if (f === 'free' || f === 'loan') return 'transfer-card__fee transfer-card__fee--green';
  if (f === 'undisclosed') return 'transfer-card__fee transfer-card__fee--dim';
  return 'transfer-card__fee';
}
```

```css
.transfer-card__fee-col {
  text-align: right;
}
.transfer-card__fee {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}
.transfer-card__fee--green {
  color: var(--color-pitch-green);
  font-weight: 700;
}
.transfer-card__fee--dim {
  color: var(--color-faint);
  font-style: italic;
  font-family: var(--font-body);
  font-size: 11px;
}
```

### Column 4: Tier (64px, centered)

```jsx
<div className="transfer-card__tier-col">
  <TierPill tier={item.tier} />
</div>
```

```css
.transfer-card__tier-col {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Column 5: Date (72px, right-aligned)

```jsx
<div className="transfer-card__date-col">
  <span className="transfer-card__date">{item.timestamp}</span>
</div>
```

```css
.transfer-card__date-col { text-align: right; }
.transfer-card__date {
  font-size: 11px;
  color: var(--color-faint);
  white-space: nowrap;
}
```

---

### Full TransferCard JSX structure

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Crest from '../shared/Crest';
import TierPill from './TierPill';
import './TransferCard.css';

function PlayerAvatar({ photo, name, position }) { /* as above */ }
function getFeeClass(fee) { /* as above */ }

export default function TransferCard({ item }) {
  const navigate = useNavigate();
  const isConfirmed = item.status === 'confirmed';
  const tier = Math.min(Math.max(item.tier, 1), 3);

  const cardClass = [
    'transfer-card',
    `transfer-card--tier-${tier}`,
    isConfirmed ? 'transfer-card--confirmed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      {/* Col 1: Clubs */}
      <div className="transfer-card__clubs"> ... </div>

      {/* Col 2: Player */}
      <div className="transfer-card__player" onClick={() => navigate('/players/' + item.id)}>
        <PlayerAvatar photo={item.playerPhoto} name={item.player} position={item.position} />
        <div className="transfer-card__player-info">
          <span className="transfer-card__player-name">
            {item.player}
            {isConfirmed && <span className="transfer-card__confirmed-dot" />}
          </span>
          <span className="transfer-card__player-meta">{item.position} · {item.age}</span>
        </div>
      </div>

      {/* Col 3: Fee */}
      <div className="transfer-card__fee-col">
        <span className={getFeeClass(item.fee)}>{item.fee}</span>
      </div>

      {/* Col 4: Tier */}
      <div className="transfer-card__tier-col">
        <TierPill tier={tier} />
      </div>

      {/* Col 5: Date */}
      <div className="transfer-card__date-col">
        <span className="transfer-card__date">{item.timestamp}</span>
      </div>
    </div>
  );
}
```

---

## Player photo URL fix

In `mockData.js`, the `playerPhoto` URLs use `ui-avatars.com` which generates real images. If they're failing, it's likely because the URL has unencoded spaces. Make sure ALL player photo URLs use `+` for spaces, not raw spaces or `%20`:

```js
// CORRECT:
playerPhoto: 'https://ui-avatars.com/api/?name=Jude+Bellingham&background=0d1520&color=00B370&size=128&bold=true&format=svg'

// WRONG (will fail):
playerPhoto: 'https://ui-avatars.com/api/?name=Jude Bellingham&background=0d1520&color=00B370&size=128&bold=true&format=svg'
```

Go through every item in `transfers` array in `mockData.js` and ensure all player name spaces are `+` encoded. This is the ONLY change allowed to `mockData.js`.

---

## Small addition needed in `Transfers.jsx`

Inside the `transfers__feed` div, add the column header row BEFORE the `.map()`:

```jsx
<div className="transfers__feed">
  {/* Column header */}
  <div className="transfer-feed__header">
    <span className="transfer-feed__col">FROM → TO</span>
    <span className="transfer-feed__col">PLAYER</span>
    <span className="transfer-feed__col transfer-feed__col--right">FEE</span>
    <span className="transfer-feed__col transfer-feed__col--center">TIER</span>
    <span className="transfer-feed__col transfer-feed__col--right">DATE</span>
  </div>

  {visibleItems.map(item => (
    <TransferCard key={item.id} item={item} />
  ))}
</div>
```

Add to `Transfers.css`:
```css
.transfers__feed {
  display: flex;
  flex-direction: column;
  gap: 0;           /* rows touch each other, no gap — like a table */
}
.transfer-feed__header {
  display: grid;
  grid-template-columns: 220px 1fr 80px 64px 72px;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border-dim);
  margin-bottom: var(--space-1);
}
.transfer-feed__col {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-faint);
}
.transfer-feed__col--right { text-align: right; }
.transfer-feed__col--center { text-align: center; }
```

---

## Deliverable checklist:
- [ ] Position filter is pill buttons, not a select dropdown — active pill is green with black text
- [ ] Sort is a custom dropdown panel (dark surface, not native select)
- [ ] Sort closes when clicking outside (useRef + useEffect click-outside handler)
- [ ] TransferCard uses CSS grid with 5 columns matching the header
- [ ] Player has 38px avatar + position badge in bottom-right corner
- [ ] Player photo: all ui-avatars URLs in mockData use `+` for spaces
- [ ] Confirmed rows have subtle green background tint (rgba, not solid)
- [ ] Confirmed rows show a small green dot next to player name
- [ ] Tier 3 rows have dimmer player name color
- [ ] Club short names show next to logos in clubs column
- [ ] Fee uses monospace font (`--font-mono`)
- [ ] Column headers align with card grid columns (same `grid-template-columns`)
- [ ] No native `<select>` anywhere in the filter bar
- [ ] No console errors when `item.toTeam` is null
- [ ] `gap: 0` on `.transfers__feed` — rows touch, no card gaps
