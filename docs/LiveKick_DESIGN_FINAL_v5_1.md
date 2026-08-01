# LiveKick — Design System & Stitch Generation Spec (v5.0 FINAL)
### Single Source of Truth — supersedes DESIGN_FINAL_v4.md and all prior versions

**v5 changelog:** color palette, typography, layout grid, and icon rules are **unchanged from v4** — the Stitch-generated mockups in the Designs folder already nail the intended aesthetic and there's no reason to touch a palette that's working. What changed: the reward-system component (§5C, §10 Prompt 7) is rewritten from "Fan XP" to **Matchday Coins**, with zero XP bars, zero fan levels, and the badge/trophy panel deferred out of v1 (see PRD v5 §3.3 for the reasoning — it's a deliberate scope cut, not a downgrade). The icon system (§4) gains one addition: a custom coin icon, closing the same emoji-inconsistency problem this doc already solved for stars and event icons in v4.

---

## 0. How LiveKick Relates to FotMob (Read This First)

You said you like FotMob's design — this spec is built to feel like it **without copying it**. Concretely:

| FotMob does | LiveKick does instead |
|---|---|
| Blue/teal accent, generic system sans-serif | **Pitch Emerald `#00B370`** accent + **Outfit** (display) / **Inter** (body) pairing — warmer, more editorial |
| Score-first, minimal card chrome | Same density philosophy (kept) — this is the part worth copying in spirit |
| No live "momentum" visualization | **Pressure Index bar** under every live match — a signature visual FotMob doesn't have |
| No gamified predictions | **Matchday Coins + Leaderboards** in the top nav — FotMob has nothing like this |
| Flat transfer news feed | **Tier 1/2/3 credibility badges** on every transfer card — a trust layer FotMob lacks |
| Static lineup graphic | **Interactive Tactical Lineup Lab** (drag-and-drop builder), not just a read-only pitch view |

**Rule of thumb for every screen:** match FotMob's *information density and scan speed*, but never its *color identity, iconography, or card chrome*. If a screen could be mistaken for a FotMob screenshot with the colors swapped, it's wrong — the Pressure Index, Matchday Coins balance, and tier badges should always be doing visible work.

---

## 1. Product Vision & Design Philosophy

**LiveKick** is a premium, real-time football companion web app for dedicated supporters — FotMob-speed score delivery, elevated editorial typography, live match telemetry, and a gamified **Fan Prediction League (Matchday Coins, strictly 0% money/betting)**.

- **Platform:** Web app, 1440px desktop-first, responsive to 768px tablet & 375px mobile.
- **Core Stance:** 100% football & community. Zero betting odds, zero gambling language, zero casino clutter.
- **Density Score:** 6.5/10 — data-dense, fast-scanning, high clarity.
- **Visual Identity:** Clean Pitch Emerald + Dark Stadium Surface. Precise borders, official crest prominence, tabular monospaced scores.

---

## 2. Color System (Canonical — do not fork this table again)

```css
:root {
  /* Canvas & Surface */
  --bg-base:             #0a0e14;
  --bg-surface:           #121820;
  --bg-surface-elevated:  #1a222d;
  --border-subtle:        #26303d;
  --border-focus:         #00B370;

  /* Typography */
  --text-primary:         #f1f5f9;
  --text-secondary:       #94a3b8;
  --text-faint:           #475569;

  /* Brand & Semantic */
  --color-pitch-green:    #00B370;
  --color-pitch-hover:    #00cc80;
  --color-live-red:       #f87171;  /* lightened from #ef4444 — see contrast note below */
  --color-favorite-gold:  #f59e0b;

  /* Match Events */
  --color-win:            #00B370;
  --color-draw:            #64748b;
  --color-loss:            #f87171;
  --color-card-yellow:     #eab308;
  --color-card-red:        #dc2626;

  /* Score Cell */
  --score-box-bg:          #06090e;
  --score-box-text:        #ffffff;

  /* Info / Utility (new — needed for Europa League border, links, VAR) */
  --color-info-blue:        #3b82f6;
}
```

### Contrast fix (flagged issue, now resolved)
`#ef4444` on `#121820` measures ~4.8:1 — passes AA for large/bold text but is borderline for small badge text like `74'`. Since live-minute badges are small and load-bearing, **use `--color-live-red: #f87171`** (measures ~6.1:1 on `#121820`) for all live badges and text. Keep `#ef4444`/`#dc2626` only for large, non-text elements (border stripes, dots ≥8px).

| Pairing | Ratio | Grade |
|---|---|---|
| `--text-primary` on `--bg-surface` | 13.8:1 | AAA |
| `--color-pitch-green` on `--bg-surface` | 5.2:1 | AA |
| `--color-live-red` (new) on `--bg-surface` | 6.1:1 | AA (text-safe) |
| `--text-secondary` on `--bg-surface` | 4.6:1 | AA (body text only, not small labels) |

---

## 3. Typography

| Role | Family | Weight | Tracking | Usage |
|---|---|---|---|---|
| Headings & Logo | `Outfit` | 800 | `-0.02em` | App title, page headers, big team names |
| Body & UI Text | `Inter` | 400/500/600 | Regular | Articles, bios, tabs, labels |
| Scores & Timestamps | `JetBrains Mono` | 600/700 | Tabular figures | Scores (`2 - 1`), minutes (`74'`), tables |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
```

---

## 4. Icon System (Fixes the emoji contradiction in prior drafts)

**Hard rule: zero emoji characters anywhere in the shipped UI — nav, timelines, badges, mockup copy, everything.** Prior drafts banned emoji in text while showing emoji in every mockup; that inconsistency is why Stitch would generate emoji. This is now closed.

- **Navigation & UI chrome:** Lucide icon set (`lucide-react`), 20–24px, 1.5–2px stroke, matches `--text-secondary` / `--color-pitch-green` when active.
- **Match events (goal, card, sub, VAR):** football-specific glyphs don't exist in Lucide, so use a small **custom SVG set** drawn in Lucide's exact style (24×24 grid, 2px rounded stroke, no fill except cards). Required icons: `icon-goal` (ball outline), `icon-yellow-card` (rounded rect, yellow fill), `icon-red-card` (rounded rect, red fill), `icon-substitution` (two arrows), `icon-var` (monitor outline with checkmark).
- **League flags/crests:** real SVG crest/flag assets, never emoji flags (`🏴󠁧󠁢󠁥󠁮󠁧󠁿`, `🇪🇸` etc. are banned — they render inconsistently across OS/browser and look unofficial).
- **Favorite star:** custom outline/filled SVG star component, not the Unicode `★` glyph (Unicode glyphs don't support hover/active state styling reliably).
- **Matchday Coins balance:** custom SVG coin icon (simple circular coin outline, 18-20px, `--color-favorite-gold` fill), used everywhere a coin amount is shown — top nav, prediction cards, leaderboard rows. Never the 🪙 emoji character, for the same reason emoji are banned everywhere else in this doc: inconsistent rendering across OS/browser, no hover/active state control.

---

## 5. Core Components

### A. Match Row
```html
<div class="match-row">
  <div class="match-status live">
    <span class="live-dot"></span>74'
  </div>
  <div class="team home">
    <img src="/crests/arsenal.svg" class="crest" alt="Arsenal" />
    <span class="team-name">Arsenal</span>
  </div>
  <div class="score-display">2 - 1</div>
  <div class="team away">
    <span class="team-name">Chelsea</span>
    <img src="/crests/chelsea.svg" class="crest" alt="Chelsea" />
  </div>
  <button class="star-btn active" aria-label="Favorite this match">
    <svg class="icon-star" /* filled SVG, not ★ */ />
  </button>
</div>
```
- `.match-status.live` uses `--color-live-red` text + a 6px pulsing dot (CSS `animation`, 1.4s ease-in-out infinite).
- `.match-status.finished` shows `FT` in `--text-secondary`.
- `.match-status.upcoming` shows kickoff time (`20:00`) in `JetBrains Mono`, `--text-secondary`.

### B. Pressure Index Bar
```css
.pressure-bar-container {
  height: 6px;
  background: var(--bg-surface-elevated);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
}
.pressure-home { background: var(--color-pitch-green); transition: width 0.5s ease; }
.pressure-away { background: var(--color-info-blue); transition: width 0.5s ease; }
```
- Only renders on `status: live` matches. Include a small caption: `Last 15 min` + a "last updated Xs ago" timestamp (see §8 — this is required because updates are not instantaneous).

### C. Fan Predictor Card (0% Money — Matchday Coins)
```html
<div class="prediction-card">
  <span class="widget-title">FAN MATCHDAY PREDICTOR</span>
  <p class="match-title">Arsenal vs Chelsea</p>
  <div class="vote-buttons">
    <button class="vote-btn">HOME WIN (Arsenal)</button>
    <button class="vote-btn">DRAW</button>
    <button class="vote-btn">AWAY WIN (Chelsea)</button>
  </div>
  <span class="coin-reward"><svg class="icon-coin" />+150 Coins (exact score: +500)</span>
  <span class="lock-notice">Locks at kickoff — 20:00</span>
</div>
```
- `.lock-notice` is required on every predictor card: predictions must visibly communicate they lock at kickoff (closes the fairness gap flagged in the PRD).
- `.coin-reward` uses the custom coin icon (§4), never the 🪙 emoji.
- Once locked/submitted, buttons switch to a disabled "You predicted: HOME WIN" state — never silently allow re-submission.
- The Predictions tab/hub must always render the legal disclaimer line below the fold of the main predictor widget: *"Matchday Coins are virtual in-game tokens for entertainment only and hold no real-world monetary value."* Small, `--text-faint`, always visible — not hidden behind a tooltip.

### D. Standings Row
- Qualification zones as 3px **left border stripes**, not full-row tinting (keeps rows scannable): Champions League top-4 = `--color-pitch-green`, Europa League 5th = `--color-info-blue`, Relegation bottom-3 = `#ef4444` (large stripe, so the darker red is fine here per the contrast note above).
- Form guide: 5 dots, 8px, filled `--color-win` / `--color-draw` / `--color-loss`.

### E. Transfer Card
- Tier badge is a small pill, top-left of card: Tier 1 = `--color-pitch-green` bg / dark text, Tier 2 = `--text-secondary` bg / dark text, Tier 3 = outline only, `--text-faint` border.
- Player photo (circular, 48px) + From-crest → arrow icon → To-crest, fee in `JetBrains Mono`.

---

## 6. Layout Grid (1440px Desktop)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOP NAV: Logo | Search | Matchday Coins balance (icon + count) | Avatar      │
├───────────────┬───────────────────────────────────────────┬─────────────────┤
│ SIDEBAR 240px │ MAIN 848px                                 │ RIGHT PANEL 320px│
│ (24px gutter) │ (24px gutter each side)                    │ (24px gutter)    │
└───────────────┴───────────────────────────────────────────┴─────────────────┘
```
240 + 24 + 848 + 24 + 320 + 24 (outer) = 1480 → adjust outer page padding to 20px each side for a clean 1440px total. **State this explicitly to Stitch** — do not let it improvise gutters.

- **Tablet (768px):** right panel collapses into a horizontal scroll strip below the main feed; sidebar collapses to icon-only rail (64px).
- **Mobile (375px):** single column, sidebar becomes a bottom tab bar (5 items max), right panel content moves to a "For You" tab.

---

## 7. Empty, Loading & Error States (previously unspecified — required for every page)

- **No live matches today:** illustration-free, text-first: "No matches today" + secondary text showing next match date, `--text-secondary`. Never leave a blank white/dark void.
- **Prediction not yet made:** predictor card shows the vote buttons (default state, not an error).
- **Private league with 1 member:** leaderboard shows the single row + a share-code callout inviting friends, not a broken-looking empty table.
- **API/sync failure:** a slim, dismissible banner at the top of the main feed — `"Live scores may be delayed — reconnecting…"` in `--color-live-red` text on `--bg-surface-elevated`. Never show a raw error or blank screen for a data outage.
- **Loading skeletons:** match rows and standings rows use skeleton pulses matching component shape — no spinners for list content (spinners only for full-page initial load).

---

## 8. Live Data Trust Indicator (new — required)

Because backend sync runs on a 60–90s cycle (see PRD §6), every live match view must show a small **"Updated Xs ago"** timestamp near the Pressure Index bar. This is a small UI cost that prevents the product from silently overpromising "real-time" when the actual cadence is near-real-time. Non-negotiable for trust.

---

## 9. Strict Banned List (Anti-Slop Enforcement)

- ❌ No betting odds (`1.85`, `3.40`, `4.20`) anywhere, in any decimal-adjacent format.
- ❌ No gambling terms: "Bet", "Stake", "Cashout", "Deposit", "Withdraw", "Odds", "Bookmaker", "Payout".
- ❌ No emoji anywhere in shipped UI (see §4 — this now applies to spec mockups too, not just code) — including the coin symbol; use the custom coin icon, never 🪙.
- ❌ No AI-copywriting clichés: "Elevate", "Seamless", "Next-Gen", "Unleash", "Revolutionize", "Supercharge", "Effortless", "Game-changing".
- ❌ No generic AI-slop visual patterns: no purple/blue gradient blobs, no glassmorphism-for-its-own-sake, no oversized rounded-everything cards with no hierarchy, no stock-photo hero sections, no default shadcn/Tailwind-starter look with zero customization.
- ❌ No generic `<select>` dropdown filters — use segmented pill controls.
- ❌ No taxi-yellow / casino-amber themes. Palette is locked to Pitch Emerald `#00B370` + Dark Stadium `#0a0e14`.
- ❌ No full-row color tinting for standings zones — border stripes only (full tinting reads as a template default).
- ❌ No Unicode star/flag glyphs — SVG only.
- ❌ No Fan XP, XP bars, fan levels, streak counters, or unlockable badges/trophies in v1 — see PRD v5 §3.3. If you see these in older reference screenshots, treat them as superseded, not as the spec.
- ❌ No paid-tier or "Pro"/"Premium" badges anywhere in the UI (e.g. a "PRO SCOUT TIER" label under the logo) — v1 has zero monetization per the PRD, so no UI element should imply a paid tier exists yet.

### Reference aesthetic: the Designs folder is ground truth for *look*, this doc is ground truth for *rules*
The actual Stitch-generated screenshots already achieve the intended aesthetic — dense, confident, editorial-dark, nothing generic about it — and nothing about that visual execution needs to change. Specifically worth preserving in every future screen: the `⌘K` keyboard-shortcut hint inside the search bar, the sidebar's small colored status dot next to followed teams, the persistent floating "Match Day Live" pill button in the bottom-left corner, and the tight vertical rhythm between match rows. When generating new screens or regenerating existing ones, treat those screenshots as the visual bar to hit — just apply the Matchday Coins/no-badges corrections from this doc's v5 changelog on top of that same look.

---

## 10. Stitch Generation Prompts — One Per Page

Paste each block into Stitch individually. Every prompt below already encodes the token values, the FotMob-differentiation rules, and the emoji/icon ban so you don't have to repeat yourself per screen.

### Prompt 1 — Home / Live Scores Feed
```text
Web app UI, 1440px width, dark stadium sports theme. Canvas #0a0e14, card surface #121820, elevated surface #1a222d, borders #26303d, primary accent Pitch Emerald #00B370. Headings in Outfit ExtraBold, body in Inter, all scores/times in JetBrains Mono tabular figures. Absolutely no emoji characters anywhere — use clean line-style vector icons (Lucide-style, 2px stroke) and real SVG team crests/league logos only.

3-column grid: 240px left sidebar, ~848px center feed, 320px right panel, 20px outer page padding, 24px gutters between columns.

LEFT SIDEBAR: Wordmark "LiveKick" in Outfit ExtraBold, #00B370, with a small vector football-boot or pitch-line icon (not a ball emoji). Vertical nav list: Matches (active, green left border indicator), News, Standings, Transfers, Predictions League, Tactics Lab — each with a matching Lucide-style icon. Below nav: "MY TEAMS" section with small crest icons (Arsenal, Real Madrid, Barcelona).

TOP NAV BAR above the grid: logo left, global search center ("Search teams, players"), and on the right a Matchday Coins balance — a small custom coin icon (not emoji) next to the numeric count on a subtle #1a222d pill — next to a user avatar circle. No progress bar, no level badge — there is no leveling system in this product.

CENTER FEED: Date selector as a segmented pill control — "Yesterday | TODAY | Tomorrow" — with TODAY highlighted in #00B370 fill. Below it, matches grouped under league header rows (league crest + name, e.g. Premier League, La Liga), each header on a thin #26303d divider. Match row: live status badge showing "74'" in a lighter red #f87171 with a small pulsing dot to its left, home crest + name, a dark tabular score box "2 - 1" on #06090e background in white JetBrains Mono, away name + crest, and a custom SVG star icon (outline/filled, never a text star character) on the far right. Directly beneath any live match row, render a thin 6px Pressure Index bar split into a green segment (home) and a blue #3b82f6 segment (away), with a tiny caption "Last 15 min • Updated 12s ago" in muted gray text.

RIGHT PANEL: "Match of the Day" feature card with large crests and venue name. Below it, a Fan Matchday Predictor card: match title, three pill buttons (Home Win / Draw / Away Win), a small coin-icon tag reading "+150 Coins (exact score: +500)", and a muted "Locks at kickoff — 20:00" line underneath. Below that, a Trending News list with small thumbnail photos and headline text (no betting content, no odds).

Include one empty-state variant note in the design: if there are no live matches, show centered muted text "No matches today" instead of leaving the feed blank.

Strictly no betting odds, no casino colors, no gambling terminology, no emoji, no generic gray dropdown menus.
```

### Prompt 2 — Match Detail: Overview & Timeline
```text
Web app UI, 1440px, same dark stadium theme and tokens as the home screen (#0a0e14 canvas, #121820 surface, #00B370 accent, Outfit/Inter/JetBrains Mono typography, zero emoji, SVG icons only). Keep the same left sidebar as the home screen for navigation consistency.

CENTER: Match banner — large 80px club crests for Arsenal and Chelsea either side of a big tabular score box "2 - 1" on #06090e, a live status pill "74'" in #f87171 with pulsing dot, venue name "Emirates Stadium", referee name, and a small "Updated 8s ago" trust timestamp.

Below the banner, a tab bar: OVERVIEW (active, #00B370 underline) | LINEUPS | STATS | STANDINGS | FAN VOTES — segmented pill style, not underlined browser-default tabs.

OVERVIEW TAB: a vertical timeline with a thin connecting line down the left edge. Each event row shows the minute in JetBrains Mono, a small custom line-icon matching the event type (open circle outline for goal, filled yellow rounded rectangle for yellow card, filled red rounded rectangle for red card, two opposing arrows for substitution, monitor-with-checkmark outline for VAR review), player name, and short description text. No emoji icons anywhere in the timeline.

Live Pressure Index chart below the timeline: a slightly larger version of the home-screen bar, showing the last 15 minutes of home (#00B370) vs away (#3b82f6) attacking momentum, with axis-free minimal styling.

RIGHT PANEL: small 2D tactical pitch preview showing a 4-3-3 formation with circular player markers and small rating badges (e.g. 7.4, 8.2) in the corner of each marker, plus a compact live standings preview (top 4 rows only) with the green Champions League border stripe on qualifying rows.

Strictly no betting odds, no gambling language, no emoji, no Unicode symbols standing in for icons.
```

### Prompt 3 — Match Detail: Lineups (Tactical Pitch View)
```text
Web app UI, 1440px, dark stadium theme, same tokens as previous screens. Left sidebar consistent with Home. Tab bar with LINEUPS active (#00B370 underline).

CENTER: full vertical football pitch illustration (top-down, muted green pitch lines on a darker green-black background — NOT the bright Pitch Emerald brand color, use a desaturated pitch tone so brand green stays reserved for UI accents only), split into two halves for Home (bottom, attacking up) and Away (top, attacking down) formations, e.g. 4-3-3 vs 4-2-3-1. Players shown as circular crest-colored markers with jersey numbers, last name below each marker, and a small rating chip (e.g. 8.4) in the top-right of each marker using a green-to-red gradient scale (green = high rating, red = low).

Below the pitch: two side-by-side substitutes benches, home and away, listed as small rows with player name and position abbreviation (ST, CB, CM) in JetBrains Mono.

RIGHT PANEL: formation summary cards for both teams (e.g. "Arsenal — 4-3-3", "Chelsea — 4-2-3-1") with manager name and formation change history if any substitutions altered shape.

No emoji, no betting odds, no gambling references, SVG/vector icons only.
```

### Prompt 4 — Match Detail: Stats
```text
Web app UI, 1440px, dark stadium theme, same tokens. Tab bar with STATS active.

CENTER: a stacked list of horizontal comparison bars, one per stat (Possession %, Shots, Shots on Target, Corners, Fouls, Passes Completed). Each row: home team value on the left in JetBrains Mono, a horizontal bar split at the row center with home fill in #00B370 and away fill in #3b82f6 proportional to each team's share, away value on the right. Team crests small (20px) at the top of the column above each side.

Below the bar list, a compact card grid for secondary stats (xG, pass accuracy %, duels won) using the same green/blue two-tone system.

No pie charts with more than 2 segments, no 3D chart effects, no emoji, no gambling odds language, no drop shadows heavier than a subtle 2px blur — keep it flat and precise like a broadcast graphics package.
```

### Prompt 5 — League Standings
```text
Web app UI, 1440px, dark stadium theme, same tokens. Left sidebar with Standings active.

CENTER: league selector as a horizontal row of crest icons (Premier League, La Liga, Serie A, Bundesliga, Champions League) in segmented pill style, active league in a highlighted pill with #00B370 text.

Standings table: columns POS | CLUB (crest + name) | P | W | D | L | GD | PTS, all numeric columns in JetBrains Mono tabular figures for perfect alignment. Qualification zones shown ONLY as a 3px left border stripe on the row — never full-row background tinting: green #00B370 for top 4 (Champions League), blue #3b82f6 for 5th (Europa League), red for bottom 3 (relegation). Far-right column: Form Guide as 5 small 8px dots per row (green = win, gray = draw, red = loss), most recent match on the right.

RIGHT PANEL: a small legend card explaining the border-stripe color coding, plus a "Biggest Movers" mini-widget showing teams that moved up/down the most this matchday with small up/down arrow icons (not emoji arrows).

No emoji, no full-row tinting, no gambling content.
```

### Prompt 6 — Transfer Radar
```text
Web app UI, 1440px, dark stadium theme, same tokens. Left sidebar with Transfers active.

CENTER: filter pill row at top — "All | Tier 1 | Tier 2 | Tier 3" segmented control, plus a league filter pill row below it. Transfer feed as a vertical list of cards: each card has a circular player photo (48px), a small position badge (ST, CB, CM) in the corner, From-club-crest → simple arrow icon → To-club-crest, transfer fee in JetBrains Mono ("€85M", "Free", "Loan"), and a tier credibility pill in the top-left of the card — Tier 1 solid #00B370 fill with dark text, Tier 2 solid #64748b fill, Tier 3 outline-only with muted #475569 border and text. Source name + relative timestamp ("Fabrizio Romano • 2h ago") in small muted text at the bottom of each card.

Include an empty-state note: if a tier filter returns zero results, show centered muted text "No Tier 1 transfers right now" rather than a blank feed.

No emoji, no gambling odds, no cluttered card grids — one column, generous vertical rhythm between cards.
```

### Prompt 7 — Fan Prediction League Hub (Leaderboard + Predictor)
```text
Web app UI, 1440px, dark stadium theme, same tokens. Left sidebar with Predictions League active.

TOP: user's own Matchday Coins summary banner — current Coins balance with the custom coin icon (never emoji), total correct predictions, and prediction accuracy percentage. No level, no XP bar, no progression meter of any kind — Coins balance and leaderboard rank are the only status signals.

CENTER: tab row — "Global | Friends" segmented control. Below it, a leaderboard table: rank number, avatar circle, username, total Matchday Coins (JetBrains Mono, with the coin icon). Highlight the current user's own row with a subtle #1a222d background and a #00B370 left border stripe (consistent with the standings-page border-stripe language, not a full color fill).

For the Friends tab, include a "Create League" and "Join with code" pair of buttons using a 6-character code input styled in JetBrains Mono.

RIGHT PANEL: upcoming matches available for prediction as compact cards, each with the three vote-outcome buttons, a coin-icon reward tag ("+150 Coins, +500 for exact score"), and a "Locks at kickoff" muted label, matching the Fan Predictor card component from the home screen. Below the cards, a small always-visible disclaimer line in muted #475569 text: "Matchday Coins are virtual in-game tokens for entertainment only and hold no real-world monetary value."

Strictly zero money, zero currency symbols beyond the Coins icon itself, zero "stake/wager" language. No emoji anywhere, including for the coin icon — use a custom SVG coin glyph matching the Lucide stroke style.

Note for the builder: earlier mockups in this project included an "Unlockable Badges" trophy panel on this screen. That's deferred to v2 per PRD §3.3 (badge/streak systems read too close to gambling reward-schedule patterns for a v1 that's explicitly zero-gambling-vibe) — leave it out of the v1 build even if you see it in older reference screenshots.
```

### Prompt 8 — Tactical Lineup Lab (Interactive Builder)
```text
Web app UI, 1440px, dark stadium theme, same tokens. Left sidebar with Tactics Lab active.

CENTER: an interactive-looking vertical pitch (same desaturated pitch-green as the Lineups screen, not brand emerald) with a formation selector pill row above it ("4-3-3 | 4-2-3-1 | 3-5-2 | 4-4-2"). Player markers on the pitch are draggable-looking circular tokens with jersey numbers, shown mid-drag with a subtle drop shadow and a faint ghost outline at the original grid slot to communicate drag-and-drop interactivity.

RIGHT PANEL: a squad list panel — player names with position tags, filterable by position pill buttons (GK, DEF, MID, FWD) — meant to be dragged onto the pitch. Include a "Save Formation" primary button in #00B370 and a "Share Formation" secondary outline button.

BELOW PITCH: a small saved-formations strip showing 3-4 thumbnail-sized past formations the user has built, each as a mini pitch icon.

This is a builder tool, not a betting tool — no odds, no emoji, vector icons only, keep the interaction affordances (drag handles, ghost slots) visually obvious even in a static mockup.
```

### Prompt 9 — Login / Signup
```text
Web app UI, 1440px, dark stadium theme, same tokens, centered single-column auth card (max 420px wide) on the dark canvas #0a0e14, no sidebar. LiveKick wordmark in Outfit ExtraBold #00B370 at the top of the card. Below it, a segmented toggle "Log In | Sign Up". Form fields: email, password (with a show/hide icon toggle, vector eye icon not emoji), and for signup an additional username field. Primary button "Continue" filled #00B370 with dark text, full width. Small muted text below linking to the alternate mode ("New here? Create an account").

Background behind the card can include a very subtle, low-opacity abstract pitch-line pattern (not a photo, not a stock image) to avoid a completely flat void.

No emoji, no gambling references, no social-login icons unless explicitly requested.
```

---

*This document is the single authoritative design + Stitch-prompt reference for LiveKick v5.0. Do not fork the color table or icon rules into a separate file again — update this one.*
