# LiveKick — Product Requirements Document

**Status:** Living document — reflects what is actually built, then what's planned. Update this file directly; do not fork copies of it.

---

## 1. Vision

LiveKick is a real-time football companion for dedicated supporters — fast score scanning, live match telemetry, transfer intelligence, standings, and a gamified Fan Prediction League, built around a distinct dark "Night-Pitch" visual identity (see [`/DESIGN.md`](../DESIGN.md)).

It takes FotMob's information density and scan speed as a *baseline*, not a template, and differentiates on:

1. **Live Match Telemetry (Pressure Index)** — an attack-momentum bar per live match, something FotMob doesn't have.
2. **Gamified Fan Prediction League — Matchday Coins.** Virtual, zero real-world value currency. No XP bars, no fan levels, no RPG-style progression, no badges/streaks in v1 — these read as gambling-adjacent reward-schedule patterns and are a deliberate scope cut, not an oversight.
3. **Transfer Reliability Index** — Tier 1 (official/verified) → Tier 3 (rumor) credibility tagging on every transfer.
4. **Tactical Lineup Lab** — an interactive drag-and-drop XI formation builder, not a static graphic.

### Anti-pattern guarantees (product-level, not just visual)
- No real-money betting, odds ratios, or bookmaker integrations.
- No casino terminology ("Deposit", "Withdraw", "Stake", "Cashout", "Payout", "Bookie", "Odds").
- No emoji anywhere in shipped UI copy, notifications, or event timelines — including the coin symbol (custom SVG icon, never 🪙).
- No monetization in v1 — no ads, no subscriptions, no paid tiers. Revisit post-launch only.

---

## 2. Current implementation status (ground truth as of this doc)

**Phase: frontend prototype, mock data only.** There is no live backend integration yet. Read this section before assuming anything in §3–§6 is already built — most of it describes the target, not the current state.

| Area | Status |
|---|---|
| Frontend (React 19 + Vite, `/frontend`) | Built. All pages route and render against `frontend/src/data/mockData.js`; nothing calls a network API. |
| Backend (Express, `/backend`) | Skeleton only (`server.js`). Not wired to the frontend, no database connected, no auth, no live data sync. |
| Database | Not provisioned. See [`TRD.md`](TRD.md) §4 for the schema decision once a backend build starts. |
| Real-time (WebSocket/SSE) | Not implemented. Pressure Index and scores are static mock values. |
| Auth | Not implemented. `FollowedTeamsContext` persists favorited teams to `localStorage` only — there is no login, no user accounts, no JWT. |
| External data sourcing | Not implemented. See [`TRD.md`](TRD.md) §5 for the sourcing strategy to use once this starts. |

**Page-by-page status** (route → state):

| Route | Page | Status |
|---|---|---|
| `/` | Home Feed | Built — league-grouped match feed, date selector, Match of the Day, Predictor card, news list |
| `/news` | News & Editorial | Built — category filtering, article grid, load-more |
| `/standings` | Standings | Built — league selector, table with form guide, top scorers/assists |
| `/transfers` | Transfer Radar | Built — tiered transfer feed, multi-filter sidebar, sortable table |
| `/teams/:id` (+ tabs) | Team Profile | Built — Overview, Fixtures, Squad, Transfers tabs implemented; Stats tab is a placeholder |
| `/matches/:id` | Match Detail | Stub placeholder |
| `/players/:id`, `/coach/:id` | Player/Coach Profile | Stub placeholder |
| `/predictions` | Fan Prediction League | Stub placeholder |
| `/tactics` | Tactical Lineup Lab | Stub placeholder |
| `/login` | Login/Signup | Built — password + OTP UI, no real auth wired |
| `/settings` | Settings | Stub placeholder |

---

## 3. Target personas

- **The Obsessive Matchday Fan** — wants live scores in under a second, official crests, live-minute indicators, instant goal/red-card awareness, and Pressure Index to know who's dominating without a TV open.
- **The Transfer & Tactics Enthusiast** — wants a Tier 1–3 credibility-tagged transfer feed and an interactive Tactics Lab.
- **The Competitive Friend Group** — wants to guess match outcomes, earn Matchday Coins, and climb a friends leaderboard.

---

## 4. Core feature modules (target spec)

### 4.1 Live Scores & Matchday Feed — *built (mock data)*
- Date selector: Yesterday / Today / Tomorrow + calendar picker.
- League-grouped feed with official crests across Premier League, La Liga, Champions League, Bundesliga, Serie A.
- "Today" must be computed in the viewer's browser-local timezone. Store timestamps in UTC; convert client-side only.

### 4.2 Live Match Telemetry (Pressure Index) — *built (mock data), not real-time*
- Attack-momentum bar, home vs away, windowed to the last 15 minutes, shown under every live match row.
- **Once a real backend exists:** the sync job polls external providers on a schedule and pushes updates to connected clients via WebSocket/SSE — the frontend must not run its own polling timer. Every live view should show an honest "Updated Xs ago" indicator rather than implying true real-time when it isn't.

### 4.3 Gamified Fan Prediction League — Matchday Coins — *not built (stub page)*
- Currency is Matchday Coins only — never called XP, points, or credits in copy, code, or schema.
- Predict Home Win / Draw / Away Win, optionally an exact scoreline.
- Reward values (canonical once implemented): signup +1,000 (one-time), daily login +200 (server-side date check, once/day), correct exact score +500, correct result without exact score +150, wrong prediction −100.
- Leaderboards: Global (all-time Coins) and Private Friends (6-character join code).
- No badges, trophies, or streak mechanics in v1 — see anti-pattern guarantees in §1.
- Required disclaimer copy on the Predictions tab: *"Matchday Coins are virtual in-game tokens for entertainment only and hold no real-world monetary value."*
- **Prediction lock rule:** any submit/edit endpoint must reject once `match.status !== 'upcoming'`, enforced server-side (a client-only lock is trivially bypassed).

### 4.4 Transfer Radar & Rumor Reliability Index — *built (mock data)*
- Tier 1 (official/verified), Tier 2 (reputable outlets), Tier 3 (rumor/speculation).
- Card: player photo, position badge, From-crest → To-crest, fee (`€85M` / `Free` / `Loan`), source + timestamp.

### 4.5 League Standings & Form Guide — *built (mock data)*
- Columns: `POS | CLUB | P | W | D | L | GD | PTS`. Qualification zones marked with a 3px left border stripe, never a full-row tint.
- Form guide: last 5 results as colored pills.
- **Once a real backend exists:** standings should be computed server-side from cached match data on each sync and stored, not queried live from an external API on every request.

### 4.6 Tactical Lineup Lab — *not built (stub page)*
- Formation templates (4-3-3, 4-2-3-1, 3-5-2, 4-4-2); drag players from a squad list onto pitch slots.
- Users can save multiple formations and share a read-only view via a generated link (`/formations/:id`, no auth required to view).
- Out of scope for v1: real licensed player data per league — start with placeholder/mock squads or already-ingested match-day lineups.

---

## 5. Definition of done, once backend work starts

This is a realistic build order, not a sprint plan — see [`TRD.md`](TRD.md) §6 for the accompanying learning/build sequence.

1. **Core scores engine** — real backend + database, scheduled sync job, WebSocket/SSE push layer, JWT auth with the security spec in [`TRD.md`](TRD.md) §3.
2. **Telemetry, standings & predictions** — Pressure Index off real data, server-computed standings, Matchday Coins engine with server-side lock-at-kickoff, leaderboards.
3. **Tactics Lab & polish** — formation save/share, empty/loading/error states across every page, a full accessibility pass.

Do not consider any phase "done" until the corresponding row in §2's status table is updated to match — that table is the actual source of truth for what's shipped, this section is only the plan.
