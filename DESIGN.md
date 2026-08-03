# LiveKick — Semantic Design System (`DESIGN.md`)
**Last synced against codebase: August 3, 2026**

> **This file is the single source of truth.** Every token named here exists,
> verbatim, in `frontend/src/styles/tokens.css`. If you change a value in one
> place, change it in the other. Nothing in this doc is aspirational — it
> describes what is actually implemented.

## Visual Atmosphere & Vibe
- **Theme**: "Night-Pitch Stadium Floodlight" — dark, atmospheric, high-performance football dashboard.
- **Density**: 7/10 (high data density, clean breathing room between cards).
- **Variance**: 8/10 (asymmetric cards, stat grids, retro scoreboard cells, tactics pitch).
- **Motion**: 7/10 (fast, tactile — `translateY(-1px)` lift on hover, `scale(0.98)` on click, animated live-pulse dot, row fade-in).
- **Banned outright**: pure `#000` (except the scoreboard digit cell), pure `#fff` text, purple/violet gradients, neon blue glows, unstyled default gray (`#ccc`/`#999`-style) placeholders, hotlinked third-party stock photography.

## Color Tokens
Defined in `tokens.css`. Use `var(--token-name)` everywhere — no hardcoded hex in component CSS files.

| Token | Value | Use |
|---|---|---|
| `--color-base` | `#080c11` | App canvas background |
| `--color-surface` | `#0d1520` | Card surfaces |
| `--color-surface-elevated` | `#111820` | Inner/elevated panels, badges, elevated hover bases |
| `--color-surface-hover` | `#18222d` | Hover state fill |
| `--color-header` | `#080c11` | Top nav bar background |
| `--color-border` | `#1e2a35` | Outer card border (bezel 1) |
| `--color-border-focus` | `#00B370` | Focus ring / active border |
| `--color-border-dim` | `#131c26` | Inner hairline (bezel 2) |
| `--color-primary` | `#f1f5f9` | Primary text (bone white, never pure white) |
| `--color-secondary` | `#94a3b8` | Secondary text |
| `--color-faint` | `#475569` | Placeholder / disabled text |
| `--color-dimmer` | `#334155` | Structural gray (kbd badges, dividers) |
| `--color-pitch-green` | `#00B370` | Brand accent, live/active state |
| `--color-pitch-hover` | `#00cc80` | Brand accent hover |
| `--color-pitch-bg` | `#071a11` | Brand accent on-fill text color |
| `--color-live-red` | `#f87171` | Live minute badge text, live pulse dot |
| `--color-live-red-bright` | `#ff4d4d` | Live dot bright core |
| `--color-gold` | `#f59e0b` | Reserved EXCLUSIVELY for Matchday Coins currency |
| `--color-star` | `#eab308` | Favorites toggle star accent |
| `--color-info-blue` | `#3b82f6` | Away-side pressure/stat accent (and fallback) |
| `--color-win` | `#00B370` | Home-side pressure accent / Form win indicator |
| `--color-draw` | `#64748b` | Form draw indicator |
| `--color-loss` | `#f87171` | Form loss indicator |
| `--color-scoreboard-bg` | `#050403` | Retro digit cell background (near-black) |
| `--color-scoreboard-digit` | `#f5b942` | Retro digit color (amber LED) |
| `--color-scoreboard-digit-dim` | `#8a6a2e` | Finished-match dimmed digit |
| `--color-scoreboard-border` | `#2a2210` | Retro digit cell border |
| `--color-scoreboard-glow` | `rgba(245, 185, 66, 0.35)` | Inset glow behind digits |

### Team Crest Fallback Gradient Tokens
Reserved exclusively for fallback crest shields when image assets fail or are loading:
- `--team-1-bg` through `--team-12-bg`: `linear-gradient(135deg, ...)` dark mode gradients.
- `--team-1-border` through `--team-12-border`: 1px dark accent borders.
- `--team-1-text` through `--team-12-text`: High-contrast initials text.

### League Badge Tokens
- `--league-pl-bg` / `--league-pl-border` / `--league-pl-text`: `#1e1528` / `#332244` / `#b8a4d4` (Premier League)
- `--league-laliga-bg` / `--league-laliga-border` / `--league-laliga-text`: `#281515` / `#442222` / `#d4a4a4` (La Liga)
- `--league-ucl-bg` / `--league-ucl-border` / `--league-ucl-text`: `#151f28` / `#223344` / `#a4c2d4` (Champions League)

## Team Primary Color System (Pressure Index Accent)
`PressureBar` uses a dedicated per-team `primaryColor` hex field defined on each team object in `mockData.js` for authentic club visual identity. This system is distinct from the `--team-N-bg` crest-fallback tokens:

- **Data Source**: Defined in `mockData.js` per team (`primaryColor` / `secondaryColor`).
- **Curated Palette Rationale**: Colors are hand-calibrated for visual distinction across matchups rather than literal raw kit hexes (e.g., Arsenal crimson `#D6293C` vs Liverpool ruby `#C81E4A`; Chelsea ultramarine `#1D4FA6` vs Man City cobalt `#3f8be1ff`; BVB vivid ochre `#D4A017`; Real Madrid bronze/champagne `#edeae6ff`).
- **Collision Detection & Fallback**: Before rendering, `PressureBar.jsx` calculates perceptual color distance (`DELTA_E_THRESHOLD = 120`, `DELTA_HUE_THRESHOLD = 35°`). If home and away colors are visually indistinguishable (e.g. two similar red or navy clubs), the bar automatically falls back to canonical `--color-win` (`#00B370`) and `--color-info-blue` (`#3b82f6`).

## Typography
Self-hosted via `@fontsource` (no external CDN — see Asset Rules below).

- **Display / Headings** (`--font-display`): `'Big Shoulders Display', system-ui, sans-serif` — condensed, bold, used **uppercase** with `letter-spacing: -0.01em` for section titles, matchup names, and the MOTD headline. Weights used: 700, 800, 900.
- **Body** (`--font-body`): `'Inter', system-ui, sans-serif` — standard tracking, `line-height: 1.5`. Weights used: 400, 500, 600, 700.
- **Scores, timers, odds, coins** (`--font-mono`): `'JetBrains Mono', 'Courier New', monospace` — every live minute, kickoff time, matchday coin count, and the scoreboard digit cell. Weights used: 400, 600, 700.

Rule of thumb: if a number needs to look like data, it's mono. If a word needs to look like a headline, it's Big Shoulders Display uppercase. Everything else is Inter.

## Spacing Scale
| Token | Value | Use |
|---|---|---|
| `--space-1` | `4px` | Micro gaps, tight padding |
| `--space-2` | `8px` | Inner element padding, badge gaps |
| `--space-3` | `12px` | Card header padding, small container padding |
| `--space-4` | `16px` | Standard card padding, row gaps |
| `--space-5` | `20px` | Outer section margins, panel padding |
| `--space-6` | `24px` | Large container padding, hero margins |

## Radius & Bezel
| Token | Value | Use |
|---|---|---|
| `--radius-badge` | `4px` | Tier 1: Scoreboard digits, kickoff slots, minute badges, pressure bar track |
| `--radius-card` | `14px` | Tier 3: Double-bezel cards & containers |
| `--radius-pill` | `9999px` | Tier 2: Interactive pill buttons & filters ONLY |

**Double-bezel card** (league groups, MOTD card, predictor card): an outer 1px `--color-border` ring plus an inset 1px `--color-border-dim` ring, giving cards a "cased" look instead of a flat single outline. Implemented as a two-layer `box-shadow`:
```css
box-shadow:
  var(--shadow-inset),
  var(--shadow-card);
border: 1px solid var(--color-border);
```

## Shadows & Elevation
| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.35)` | Small card elevation, pressure track drop |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.45)` | Hover state elevation |
| `--shadow-card` | `0 6px 16px rgba(0, 0, 0, 0.5)` | Base card drop shadow |
| `--shadow-popover` | `0 16px 40px rgba(0, 0, 0, 0.65)` | Search modal / dropdown elevation |
| `--shadow-inset` | `inset 2px 2px 6px rgba(0,0,0,0.7), inset -1px -1px 0px rgba(255,255,255,0.07)` | Inner bezel drop + rim highlight |
| `--shadow-inset-hover` | `inset 2px 2px 7px rgba(0,0,0,0.8), inset -1px -1px 0px rgba(255,255,255,0.12)` | Hover state inner bezel |
| `--glow-live` | `0 0 14px rgba(248, 113, 113, 0.55), 0 0 4px rgba(248, 113, 113, 0.7)` | Live red pulse bloom |
| `--glow-live-subtle` | `0 0 10px rgba(248, 113, 113, 0.4)` | Live status subtle bloom |
| `--texture-scanline` | `repeating-linear-gradient(0deg, rgba(0,0,0,0.22) ...)` | 3% broadcast CRT overlay |

## Retro Scoreboard Digit
The score cell is the single highest-leverage "premium" detail on the page — it should look like a physical stadium scoreboard, not a text label.
- Background: `--color-scoreboard-bg` (near-black, `#050403`)
- Digit color: `--color-scoreboard-digit` (amber `#f5b942`), dimmed to `--color-scoreboard-digit-dim` (`#8a6a2e`) when `match.status === 'finished'`
- Font: `--font-mono`, 700 weight
- Effect: `text-shadow: 0 0 8px var(--color-scoreboard-glow)` + `box-shadow: inset 0 0 10px rgba(0,0,0,0.6)`
- Radius: `--radius-badge` (4px)

## Team Badges
Real team crest images (`team.crestUrl` hosted on raw.githubusercontent.com) rendered with `object-fit: contain`. When loaded, the badge box strips background/border. When loading or on image error, it gracefully falls back to two-letter initials on `--team-N-bg` desaturated dark-mode shield gradients.

## Asset Rules
- **No hotlinked stock photography.** Backgrounds (e.g. the MOTD card) use CSS gradients/SVG patterns that live in the codebase.
- **No external font CDN at runtime.** Fonts are installed as npm packages (`@fontsource/*`) and imported in `main.jsx`.
- Real team crest URLs and avatars are hosted on static CDNs with graceful fallback handling.

## Component Styling Specs
1. **Double-Bezel Cards** — see above. Applies to `.league-group`, `.motd-card`, `.predictor-card`.
2. **Retro Scoreboard Digit** — see above. Applies to `.score-box`.
3. **Segmented Pills & Tactile Buttons** (date selector, predictor Home/Draw/Away) — `background: var(--color-surface-elevated)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-card)`. Active state uses `--color-pitch-green` fill with `--color-pitch-bg` text. `:active { transform: scale(0.98); }`.
4. **Favorite indicator** — starred rows get a `border-left: 3px solid var(--color-gold)` accent rather than only relying on the star icon fill.
5. **Pressure Index Bar** — thin 8px accent track with `--radius-badge` (4px, near-sharp) and a 2px seam gap (`var(--color-base)`) between segments. Team `shortName` + percentage stats (`ARS 63%` / `37% MCI`) are positioned in a slim label row directly above the bar, leaving the track completely clean.

## Hardcoded Hex Audit Summary
- **Component & Page CSS Files**: **0 hardcoded hex codes found across all `.css` files** under `frontend/src/components` and `frontend/src/pages`. 100% of styles consume `var(--token-name)`.
- **Deliberate Code Exceptions**:
  - `mockData.js`: Team `primaryColor` & `secondaryColor` hex fields (passed dynamically as inline styles to `PressureBar`).
  - `CoinIcon.jsx`: Custom SVG vector gradient/fill hexes (`#f59e0b`, `#d97706`, `#fbbf24`).
  - `Sidebar.jsx`: Fallback color map matching `--team-N-bg` tokens.
  - `PressureBar.jsx`: Default fallback constants (`FALLBACK_HOME = '#00B370'`, `FALLBACK_AWAY = '#3b82f6'`).

## LiveKick Visual Screen Catalog (`docs/Designs/`) & Implementation Status
Reference screens — the Home Feed mock is the current implementation target; the rest are north-star references for future pages:
- **Home Feed** (`LiveKick — Home Feed.png`, `LiveKick — Mobile Home Feed.png`) ✅ Implemented
  - *Implementation Status Notes*:
    - **Date Selector**: Currently UI/state-driven (switching Yesterday/Today/Tomorrow updates local active state, but backend match data filtering by date is pending API integration).
    - **Global Search**: Phase 0 stub modal (`SearchModal.jsx` opens via shortcut `/` or topnav click, but full search index and query filtering logic are not yet wired).
- **Match Detail & Lineups**, **Tactical Lineup Lab**, **Prediction League**, **Transfer Radar**, **Team & Player Profiles**, **Standings & News**, **Auth & Search** — not yet built; apply every rule in this doc when building them so the app doesn't drift again.
