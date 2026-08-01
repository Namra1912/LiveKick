# LiveKick — Product Requirements Document (v5.0 FINAL)
### High-Performance Pure Football Web Application — Single Source of Truth

**Target Environment:** Full-Stack Web App (React + Vite + Tailwind CSS + Node/Express + PostgreSQL + JWT Auth)
**Design Standard:** FotMob-speed scanning, LiveKick-original visual identity — see companion file `LiveKick_DESIGN_FINAL_v5.md`.

This document supersedes `LiveKick_PRD_FINAL_v4.md`. v4 shipped with an unresolved three-way conflict between the project instructions (Matchday Coins, zero XP/leveling, zero emoji), the v4 PRD/Design docs themselves (Fan XP, levels, streak badges), and the actual Stitch-generated mockups (a mix of both). v5 closes that conflict with one canonical decision below, and **should not be forked again** without updating this file directly.

### v5 Changelog (what changed from v4 and why)
1. **Reward system decided: Matchday Coins.** All Fan XP / Fan Level / RPG-progression / streak-badge language is removed. Coins are the only currency, per the project's own strict anti-pattern list ("no XP bars, no RPG-style leveling"). See §3.3 (rewritten).
2. **Database swapped: MongoDB → PostgreSQL.** The builder already knows Postgres and not Mongo/Mongoose; the schema was already relationally shaped (Team ← Match ← Prediction ← User, all real foreign keys), so this is a net simplification, not a compromise. Schemas in §5 are rewritten as relational tables. Mongoose-specific syntax (`$inc`, sessions) is replaced with Postgres-equivalent atomic `UPDATE` patterns in §8.
3. **Data sourcing strategy formalized.** v4 assumed a single paid-capable provider. v5 documents the actual realistic stack for a free-tier, single/small-user build: an **unofficial FotMob data wrapper** as the primary rich source (matches, live-ish scores, stats, lineups, transfers, news), **football-data.org** as an official, ToS-safe fallback for core scores/standings if the unofficial source breaks, **RSS feeds** for editorial news, and **TheSportsDB + manually seeded data** for player/team profile depth. See new §4a.
4. Badge/trophy system is removed from v1 scope entirely (not just streak-based badges) to eliminate any remaining ambiguity — see §3.3.

---

## 1. Executive Summary & Vision

**LiveKick** is a high-speed football live-scores, telemetry, and community web app for dedicated supporters. It takes FotMob's scanning speed as a *baseline*, not a template, and differentiates on four pillars:

1. **Live Match Telemetry (Pressure Index):** real-time-feeling attack momentum bar per live match.
2. **Gamified Fan Prediction League (0% Money):** Matchday Coins (virtual, no real-world value), leaderboards. No XP, no levels, no badges in v1.
3. **Transfer Reliability Index:** news tiered Tier 1 (official/verified) → Tier 3 (rumor).
4. **Tactical Lineup Lab:** an actual interactive XI formation builder (not a static graphic — see §3.6 for the full spec that was missing from prior drafts).

### 🚫 Anti-Betting & Anti-Slop Guarantee
- ❌ No real-money betting, odds ratios (`1.85`, `3.40`), or bookmaker links/integrations.
- ❌ No casino terminology: "Deposit", "Withdraw", "Stake", "Cashout", "Payout", "Bookie", "Odds".
- ❌ No AI-slop design clichés: taxi-yellow, neon gradients, generic 3-column card clutter.
- ❌ No emoji anywhere in the shipped product (UI copy, notifications, or event timelines) — **including the coin symbol**: the coin balance uses a custom SVG icon (see design doc §4), never the 🪙 character.
- ❌ No Fan XP, XP bars, fan levels, or RPG-style progression of any kind.
- ❌ No streak badges, trophy unlocks, or achievement systems in v1 — Matchday Coins + leaderboard rank are the only progression signal.
- ❌ No rewarded-ad mechanic ("watch an ad for coins") and no ad system anywhere in the app.

### Monetization (decision, not omission)
v1 ships with **no monetization** — no ads, no subscription, no paid tiers. This is a deliberate scope decision so the MVP stays focused on the scores/telemetry/prediction core. Revisit post-launch (candidates: non-intrusive display ads on the news feed, or a cosmetic-only "Supporter" badge tier — neither implemented in v1).

---

## 2. Target Personas

- **The Obsessive Matchday Fan:** wants live scores in under 1 second, official crests, live minute indicators, instant red-card/goal awareness, and to know who's dominating a live match via Pressure Index without a TV open.
- **The Transfer & Tactics Enthusiast:** wants a Tier 1–3 credibility-tagged transfer feed and an interactive Tactics Lab to build starting XIs for upcoming derbies.
- **The Competitive Friend Group:** wants to guess match outcomes, earn Matchday Coins, and climb a friends leaderboard.

---

## 3. Core Feature Modules

### 3.1 Live Scores & Matchday Feed
- Desktop 3-column layout: 240px sidebar, ~848px main feed, 320px right panel (see design doc §6 for exact gutters).
- Date selector: `◄ Yesterday | TODAY (live badge) | Tomorrow ►` + calendar picker.
- League-grouped feed with official crests (Premier League, Champions League, La Liga, Serie A, Bundesliga).
- Match row: status badge (`74'` live pulsing / `FT` / kickoff time), 24px crests, tabular score box, favorite star toggle.
- **Timezone rule (previously undefined):** "Today" is computed in the **user's browser-local timezone**, not server/UTC time or the fixture's kickoff timezone. Store all match timestamps in UTC in the database; convert client-side only. A match kicking off at 23:30 UTC must correctly bucket into the viewer's local "today" or "tomorrow."

### 3.2 Real-Time Match Telemetry (Pressure Index)
- Pressure Index: attack momentum bar, home vs away, rendered under every live match row and expanded on the match detail page, windowed to the last 15 minutes.
- **Real-time delivery decision (previously undefined — this materially changes architecture):** the backend `node-cron` job polls external providers every 60–90s as before, but the **frontend must not itself poll on a separate timer**. Instead, the backend pushes updates to connected clients via **WebSocket (Socket.io) or Server-Sent Events** the moment a cron cycle detects a change. This caps end-to-end staleness at one cron interval (60–90s) instead of compounding it with a second frontend polling delay. Every live view displays a small "Updated Xs ago" indicator (see design doc §8) so staleness is honest rather than hidden.
- Match Detail Center: 80px crests, status, stadium metadata, referee, tabs (`OVERVIEW`, `LINEUPS`, `STATS`, `STANDINGS`).
- Overview Timeline: vertical, minute-by-minute, using the custom SVG event-icon set defined in the design doc (goal / yellow card / red card / substitution / VAR) — **no emoji**, correcting the inconsistency in prior drafts.

### 3.3 Gamified Fan Prediction League — Matchday Coins (Strictly 0% Real Money)
- Currency is **Matchday Coins** — a virtual, in-game-only token. Never called XP, points, or credits anywhere in copy, code, or schema field names.
- Predict Home Win / Draw / Away Win, optionally an exact scoreline.
- **Reward engine (canonical values):**
  - New signup: **+1,000 Coins** starter pack (one-time).
  - Daily login bonus: **+200 Coins**, auto-credited once per calendar day (server-side date check, not client-triggered).
  - Correct exact-score prediction: **+500 Coins**.
  - Correct match result (Win/Draw/Loss) without exact score: **+150 Coins**.
  - Wrong prediction: **-100 Coins**.
- Leaderboards: Global (all-time total Coins) and Private Friends (6-character join code). Regional leaderboard is a v2 stretch goal, not required for v1.
- **No badges, trophies, or streak mechanics in v1.** This is a deliberate scope cut, not an oversight — badge/achievement systems and login-streak mechanics resemble reward-schedule patterns common in gambling-adjacent apps, which conflicts with this product's explicit zero-gambling-vibe stance. Revisit post-launch only as a clearly-optional, non-monetary cosmetic layer if desired.
- **Legal disclaimer (required, not optional):** the Predictions tab must always display: *"Matchday Coins are virtual in-game tokens for entertainment only and hold no real-world monetary value."*
- **Prediction lock rule (closes a real fairness gap):** `POST /api/predictions` and any edit endpoint MUST reject the request once `match.status !== 'upcoming'`. A prediction is immutable and unsubmittable once a match goes live. This must be enforced server-side, not just hidden in the UI, since a client-side-only lock is trivially bypassed.
- No ad system anywhere in the product, and no "watch an ad for coins" mechanic of any kind.

### 3.4 Transfer Radar & Rumor Reliability Index
- Tier 1 (Official / verified top-tier journalist), Tier 2 (reputable outlets — BBC, The Athletic, Sky Sports), Tier 3 (rumor/speculation).
- Card: player photo, position badge, From-crest → To-crest, fee (`€85M` / `Free` / `Loan`), source + timestamp.

### 3.5 League Standings & Form Guide
- Columns: `POS | CLUB | P | W | D | L | GD | PTS`.
- Qualification border stripes (3px, left edge only — never full-row tint, see design doc §9): Champions League top 4 = green, Europa League 5th = blue, relegation bottom 3 = red.
- Form guide: last 5 results as colored dots.
- **Computation decision (previously undefined):** standings are **computed server-side from the cached Match collection** on each sync cycle and written to a dedicated `Standings` collection (see §5.6), not queried live from the external API on every request. This avoids hammering the external API's rate limit on a high-traffic page.

### 3.6 Tactical Lineup Lab (previously a headline feature with zero spec — now defined)
- Interactive formation builder: user picks a formation template (4-3-3, 4-2-3-1, 3-5-2, 4-4-2), drags players from a squad list onto pitch slots.
- Data model needs a `Formation` schema (see §5.7) storing the user, chosen formation string, an array of `{playerId, x, y}` slot assignments, and a name/label.
- Users can save multiple formations, and share a read-only view via a generated link (`/formations/:id`) — no auth required to view a shared formation, matching the friendly-sharing tone of the rest of the product.
- Out of scope for v1: real player data licensing for every league (start with a generic/placeholder squad list per team, or the actual match-day lineup already ingested via the Match schema, to avoid a licensing dependency blocking launch).

---

## 4. Technical Stack & Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL DATA SOURCES                          │
│  Unofficial FotMob wrapper   football-data.org   RSS (BBC Sport)      │
│  (primary — matches, stats,  (fallback — official,  (news feed)       │
│   lineups, transfers, news)   ToS-safe, delayed)                      │
│                              TheSportsDB + seed data (player/team)    │
└───────────┬───────────────────────┬──────────────────┬───────────────┘
            │ behind one internal MatchProvider abstraction (§4a)       │
            ▼                       ▼                  ▼
┌────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND                       │
│  node-cron jobs | JWT middleware | WebSocket/SSE push    │
│  (push to clients on every detected match-state change)  │
└───────────┬────────────────────────────┬───────────────┘
            │                            │
            ▼                            ▼
┌────────────────────────┐  ┌────────────────────────────┐
│   POSTGRESQL DB        │  │   REACT (VITE) FRONTEND     │
│ Match/Standing/User/   │◄─┤ Tailwind CSS | Custom SVG    │
│ Prediction/Transfer/   │  │ icon set | JetBrains Mono /  │
│ Team/Formation tables  │  │ Outfit | WebSocket client    │
└────────────────────────┘  └────────────────────────────┘
```

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Fast builds, utility-first styling. |
| Real-time transport | Socket.io (or native SSE for a lighter footprint) | Closes the "real-time" credibility gap — see §3.2. |
| Typography | Outfit / Inter / JetBrains Mono | Per design doc. |
| Backend | Node.js + Express | Async API handling for rate-limited external syncs. |
| Database | **PostgreSQL** (+ an ORM such as Prisma or Knex) | Changed from MongoDB in v4 — the data is inherently relational (Team ← Match ← Prediction ← User all real foreign keys), and matches the builder's existing SQL knowledge, avoiding a second new database concept on top of everything else being learned. |
| Auth | JWT access token (short-lived) + httpOnly refresh cookie | See §6 for the full security spec. |
| Scheduled jobs | `node-cron` | Live sync (60–90s), transfer/news sync (1–2x/day). |

### 4a. Data Sourcing Strategy (new in v5 — previously assumed a single provider)
No single free API covers live scores, deep stats, player profiles, news, and transfers all at once. v5 formalizes a hybrid strategy, with every source sitting behind one internal `MatchProvider`/`NewsProvider` interface so the sync layer can be swapped without touching the frontend or DB schema:

| Data need | Primary source | Fallback / supplement | Notes |
|---|---|---|---|
| Live-ish scores, stats, lineups, shotmaps | Unofficial FotMob API wrapper (Node-compatible) | football-data.org free tier | FotMob wrapper is reverse-engineered and unofficial — not sanctioned by FotMob, no uptime/stability guarantee, and technically against their ToS. Acceptable for a personal/non-commercial, low-traffic build; do not rely on it for any commercial or public-scale version without revisiting. |
| Standings | football-data.org free tier (official, stable) | Computed server-side from cached Match data either way | Keep this on the official source even if FotMob is primary for scores — standings need to stay reliable. |
| News (editorial feed) | RSS (e.g. BBC Sport football feed) | FotMob wrapper's news endpoint if available | Display headline + short excerpt + source link only — never reproduce full article bodies. |
| Transfers + Tier 1/2/3 credibility | RSS/FotMob transfer feed + a simple rule-based source classifier | Manually seeded sample data for demo purposes | Tiering is a heuristic on source name (e.g. confirmed-by-named-top-tier-journalist → Tier 1, major outlet → Tier 2, everything else → Tier 3), not a licensed credibility API — none exists free. |
| Player/team profile depth | TheSportsDB free tier | Manually seeded data for your own favorite teams/players | Free-tier football-data.org excludes squad/player-level data entirely; this gap is expected and already implicitly acknowledged by the PRD's own placeholder-squad note in §3.6. |

**Free-tier reality check:** football-data.org's free tier is ~10 requests/minute across ~12 competitions, delayed (not truly live) data, no player/lineup depth. This is a non-issue for request volume at personal/small-friend-group scale (the cron job polls on its own schedule regardless of user count — see §3.2), but it does mean the "Updated Xs ago" trust indicator (§8/design doc §8) should read in minutes, not seconds, if you rely on it instead of the FotMob wrapper. Pick one primary explicitly before writing the cron job — do not leave this undecided.

### API budget reality check
If using football-data.org as primary or fallback: it caps around 10 requests/minute and doesn't cover every league on the free plan. Tracking 5+ leagues at a 60–90s cadence **will** hit that ceiling. Before Phase 1 sign-off, pick one explicitly:
(a) upgrade to a paid tier for the leagues you actually launch with, or
(b) launch with 1–2 leagues (e.g. Premier League + Champions League) and expand once budget is confirmed.
Do not leave this undecided — it blocks the cron job design.

---

## 5. Database Schema (PostgreSQL) — gaps closed, rewritten from Mongoose

Rewritten as relational tables. Foreign keys are explicit now instead of Mongoose `ref` strings — this is the main practical benefit of the Postgres move, since the relationships were always this shape anyway.

### 5.1 `teams` (previously missing, referenced by matches/users/transfers)
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| external_id | text, unique, indexed | ID from whichever data source ingested it |
| name | text, not null | |
| short_name | text | |
| crest_url | text, not null | |
| league | text, not null | |
| country | text | |

### 5.2 `users`
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| name | text, not null | |
| email | text, unique, not null | |
| password_hash | text, not null | bcrypt, see §6 |
| matchday_coins | integer, default 1000 | starter pack credited on insert |
| last_login_bonus_date | date, nullable | server-side check — only one +200 credit per calendar day |
| total_predictions | integer, default 0 | |
| correct_predictions | integer, default 0 | |
| created_at | timestamptz, default now() | |

No `fan_xp`, `fan_level`, `current_streak`, `best_streak`, or `badges` columns — removed per §3.3.

### 5.3 `user_favorite_teams` (join table, previously implicit)
| Column | Type | Notes |
|---|---|---|
| user_id | integer, FK → users.id | |
| team_id | integer, FK → teams.id | |
| — | primary key (user_id, team_id) | |

### 5.4 `matches`
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| external_id | text, unique, indexed | |
| home_team_id | integer, FK → teams.id | |
| away_team_id | integer, FK → teams.id | |
| home_score | integer, default 0 | |
| away_score | integer, default 0 | |
| status | text, check in ('upcoming','live','finished') | |
| minute | integer, default 0 | |
| pressure_home | integer, default 50 | |
| pressure_away | integer, default 50 | |
| match_date_utc | timestamptz, not null | always UTC — see §3.1 timezone rule |
| league | text, not null | |
| venue | text | |
| referee | text | |
| last_synced | timestamptz, default now() | |

### 5.5 `fan_predictions`
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| user_id | integer, FK → users.id, indexed | |
| match_id | integer, FK → matches.id | |
| private_league_id | integer, FK → predictor_leagues.id, nullable | |
| predicted_outcome | text, check in ('home','draw','away') | |
| predicted_exact_home | integer, nullable | |
| predicted_exact_away | integer, nullable | |
| locked_at | timestamptz, not null | set = match kickoff time at submission; enforced server-side |
| coins_awarded | integer, default 0 | +500 exact / +150 result / -100 wrong, see §3.3 |
| status | text, check in ('pending','correct','incorrect'), default 'pending' | |
| created_at | timestamptz, default now() | |

### 5.6 `predictor_leagues` (previously missing, referenced but never defined)
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| name | text, not null | |
| owner_id | integer, FK → users.id, not null | |
| join_code | text, unique, not null | 6-char, uppercase alphanumeric |
| created_at | timestamptz, default now() | |

### 5.7 `predictor_league_members` (join table)
| Column | Type | Notes |
|---|---|---|
| league_id | integer, FK → predictor_leagues.id | |
| user_id | integer, FK → users.id | |
| — | primary key (league_id, user_id) | |

### 5.8 `standings` (previously missing despite a dedicated module/endpoint)
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| league | text, not null, indexed | |
| season | text, not null | |
| computed_at | timestamptz, default now() | |
| team_id | integer, FK → teams.id | |
| position | integer | |
| played | integer | won | integer | drawn | integer | lost | integer |
| goal_difference | integer | |
| points | integer | |
| form | text[] | last 5 results, e.g. `{'W','D','L','W','W'}`, most recent last |

One row per team per league per season, recomputed on each sync cycle — not queried live from the external API on every request.

### 5.9 `formations` (required for Tactics Lab, §3.6)
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| user_id | integer, FK → users.id, not null | |
| label | text, not null | |
| formation_template | text, check in ('4-3-3','4-2-3-1','3-5-2','4-4-2') | |
| is_shared | boolean, default false | enables `/formations/:id` public view |
| created_at | timestamptz, default now() | |

### 5.10 `formation_slots` (child table — replaces Mongoose's embedded `slots` array)
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| formation_id | integer, FK → formations.id | |
| player_name | text | |
| position | text | GK / DEF / MID / FWD |
| x | numeric(4,3) | normalized 0-1 pitch coordinate |
| y | numeric(4,3) | normalized 0-1 pitch coordinate |

### 5.11 `transfers`
| Column | Type | Notes |
|---|---|---|
| id | serial, PK | |
| external_id | text, unique, indexed | |
| player | text, not null | |
| position | text | |
| from_team_id | integer, FK → teams.id | |
| to_team_id | integer, FK → teams.id | |
| transfer_type | text, check in ('permanent','loan','free') | |
| fee | text | e.g. `€85M`, `Free`, `Loan` |
| tier | integer, check in (1,2,3), default 3 | see §4a for the source-name classifier logic |
| source_name | text | |
| transfer_date | date | |
| league | text | |

---

## 6. Security Specification (previously hand-waved — now explicit)

- **Password hashing:** bcrypt, cost factor 12 (or argon2id if available in the deployment environment) — pick one and document it in the codebase README, not just here.
- **CSRF:** httpOnly refresh cookies stop XSS token theft but do **nothing against CSRF on their own.** Set `SameSite=Strict` on the refresh cookie, and additionally require a custom header (e.g. `X-Requested-With`) on state-changing requests as a lightweight CSRF check, since `SameSite=Strict` alone can be a UX tradeoff on some flows.
- **Rate limiting:** `/api/auth/login` and `/api/auth/signup` must be rate-limited (e.g. `express-rate-limit`, 5 attempts/15min per IP) to prevent credential stuffing — unspecified in prior drafts.
- **JWT:** short-lived access token (15 min), rotated via refresh cookie; refresh tokens rotated on each use (detect reuse to catch stolen-token replay).
- **Input validation:** all POST/PUT bodies validated server-side (e.g. Zod or Joi) before hitting the database — do not rely on frontend validation alone.

---

## 7. API Endpoints

| Method | Endpoint | Protection | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public + rate-limited | Register new fan account |
| `POST` | `/api/auth/login` | Public + rate-limited | Authenticate, set httpOnly refresh cookie |
| `POST` | `/api/auth/refresh` | Cookie | Issue new short-lived access JWT |
| `POST` | `/api/auth/logout` | Cookie | Clear refresh cookie |
| `GET` | `/api/matches` | Public | Cached match list, `?date=YYYY-MM-DD&league=` |
| `GET` | `/api/matches/:id` | Public | Match detail, lineups, timeline, telemetry |
| `GET` | `/api/standings/:league` | Public | Pre-computed standings table (from `standings` table, §5.8) |
| `GET` | `/api/transfers` | Public | Transfer feed, `?tier=1` / `?league=` |
| `GET` | `/api/users/me/favorites` | JWT | Fetch favorited teams |
| `POST` | `/api/users/me/favorites/:teamId` | JWT | Star a team |
| `DELETE` | `/api/users/me/favorites/:teamId` | JWT | Unstar a team |
| `POST` | `/api/predictions` | JWT | Submit prediction — **rejected if match.status ≠ 'upcoming'** |
| `GET` | `/api/predictions/me` | JWT | Prediction history & Coins earned |
| `GET` | `/api/leaderboard/global` | Public | Global Matchday Coins leaderboard |
| `POST` | `/api/leagues/predictor` | JWT | Create private predictor league |
| `POST` | `/api/leagues/predictor/join/:code` | JWT | Join via 6-char code |
| `GET` | `/api/formations/me` | JWT | User's saved Tactics Lab formations |
| `POST` | `/api/formations` | JWT | Save a new formation |
| `GET` | `/api/formations/:id` | Public | View a shared formation (no auth) |
| `WS` | `/ws/matches` | Public (upgrade) | WebSocket channel pushing live match state changes |

---

## 8. Race Condition Prevention & Atomic Operations

Settling predictions at full-time via a naive read-modify-write causes lost updates if multiple cron/settlement jobs overlap. All Coins/counter changes must use an atomic, single-statement `UPDATE` inside a transaction — never "read balance into app code, add, write back":

```sql
BEGIN;

UPDATE users
SET matchday_coins = matchday_coins + $coinsEarned,
    total_predictions = total_predictions + 1,
    correct_predictions = correct_predictions + CASE WHEN $isCorrect THEN 1 ELSE 0 END
WHERE id = $userId;

COMMIT;
```

Doing the increment (`matchday_coins + $coinsEarned`) inside the `UPDATE` statement itself — rather than reading the current balance in application code, adding to it, and writing the result back — is what makes this safe under concurrent settlement jobs. If you're using an ORM (Prisma/Knex), make sure whatever query builder you use compiles down to this same atomic-increment pattern rather than a separate read-then-write.

---

## 9. Definition of Done & Roadmap

### Phase 1: Core Scores Engine (Weeks 1–2)
- [ ] Decide external API/data-source scope before writing the cron job (§4a data sourcing strategy + API budget check).
- [ ] Express backend + PostgreSQL, `teams`/`matches` tables seeded.
- [ ] `node-cron` sync (60–90s) + WebSocket/SSE push layer to clients (§3.2 — not frontend polling).
- [ ] 1440px 3-column layout matching the design doc grid exactly (§6 of design doc).
- [ ] Match row component with "Updated Xs ago" trust indicator.
- [ ] JWT auth flow with the full security spec from §6 (bcrypt, rate limiting, SameSite cookies).

### Phase 2: Telemetry, Standings & Predictions (Weeks 3–4)
- [ ] Pressure Index bar (live matches only).
- [ ] Standings computed server-side into the `standings` table (§5.8), not live-queried.
- [ ] Matchday Coins prediction engine with server-side lock-at-kickoff enforcement (§3.3).
- [ ] Legal disclaimer copy present on the Predictions tab (§3.3) — not optional, ship with it from day one.
- [ ] Global & Private Friends leaderboards with join codes.
- [ ] Transfer Radar with Tier 1/2/3 tags.

### Phase 3: Tactics Lab & Polish (Weeks 5–6) — new phase, previously unscheduled
- [ ] `formations` + `formation_slots` tables + save/share endpoints (§5.9–5.10).
- [ ] Drag-and-drop formation builder UI matching design doc Prompt 8.
- [ ] Shared read-only formation view (`/formations/:id`, no auth).
- [ ] Empty/loading/error states implemented across every page (design doc §7) — not just the happy path.
- [ ] Full accessibility pass against the contrast table in design doc §2.

---

## 10. Tech Stack & Learning Roadmap (for the builder — and for handing this doc to any AI)

This section exists so this single file is self-contained: anyone (including an AI assistant with no other context) can read it and understand exactly what LiveKick is, what it's built with, why each piece was chosen, and in what order a solo learner should tackle it.

### 10.1 Full tech stack, with what each piece is for
| Layer | Choice | What it's for |
|---|---|---|
| Frontend framework | React (Vite) | Component-based UI, fast dev server |
| Styling | Tailwind CSS | Utility-first styling matching the design tokens in the companion Design doc |
| Routing | React Router | Multi-page navigation (Home, Match Detail, Standings, Transfers, Predictions, Tactics Lab, Profile) |
| State management | React state + Context API | Local component state (`useState`) plus one global Context for auth/current-user state; no Redux needed at this scale |
| Data fetching | `fetch` + `useEffect` (and a small custom hook for repeated GET calls) | Talking to the Express backend |
| Icons | `lucide-react` + a small custom SVG set | Zero-emoji icon policy — see Design doc §4 |
| Charts (Pressure Index, stats bars) | Simple custom SVG/CSS bars, or `recharts` if preferred | No 3D or multi-segment pie charts, per Design doc §9 |
| Real-time transport | Socket.io (or native SSE) | Server pushes live match-state changes to connected clients — see §3.2 |
| Backend framework | Node.js + Express | REST API, cron scheduling, WebSocket/SSE server |
| Database | PostgreSQL | Relational fit for this schema — see §5 and v5 changelog item 2 |
| ORM / query layer | Prisma or Knex (either is fine; Prisma has more guardrails, Knex is closer to raw SQL) | Talking to Postgres from Node |
| Auth | JWT (short-lived access token) + httpOnly refresh cookie, rotated on use | See §6 |
| Scheduled jobs | `node-cron` | Polling external data sources on a timer — see §3.2 and §4a |
| External data | Unofficial FotMob wrapper (primary) + football-data.org (fallback) + RSS (news) + TheSportsDB/seed data (players) | See §4a — no single free source covers everything |
| Deployment | Vercel (frontend) + Railway or Render (backend + Postgres) | Deploy early and often, not just at the end |

### 10.2 Concept learning order (what to learn, and in what order, before/while building each piece)
This assumes React fundamentals (JSX, components, props, `useState`) are already done.

1. **`useEffect`** — data fetching, dependency arrays, cleanup functions. Needed before any real API calls.
2. **`fetch` + async/await in React** — loading/error/success state handling. Build one small standalone project combining this with `useEffect` before touching LiveKick's real data.
3. **Multi-component architecture** — lifting state up, component composition, avoiding excess prop-drilling.
4. **React Router** — pages, dynamic params (`/formations/:id`, `/matches/:id`), protected routes.
5. **Context API** — just enough to hold current-user/auth state globally, avoiding prop-drilling it through every component.
6. **Node.js + Express** — routing, middleware, request/response cycle, error handling.
7. **PostgreSQL + an ORM (Prisma/Knex)** — schema design, CRUD, joins (the relational shape in §5 is the direct payoff of learning this well).
8. **JWT auth end-to-end** — access/refresh tokens, httpOnly cookies, rotation, reuse detection. Budget real time here — it's the most commonly underestimated topic.
9. **WebSockets/SSE** — server push, client reconnect/backoff handling. Tackle this last among core concepts; it depends on everything above already working.
10. **Deployment** — Vercel + Railway/Render + a hosted Postgres instance. Do this early on a trivial version of the app, not at the very end.

### 10.3 Build order (interleaving frontend momentum with backend course progress)
1. **Frontend shell first, no backend at all:** Home Feed, Match Row, Standings, Match Detail, Transfer Radar, Predictions UI — all against hardcoded mock JSON. Add React Router across these pages. Zero backend risk, pure layout/component practice.
2. **Tactics Lab** can be built any time after step 1 — it's almost entirely frontend drag-and-drop state, with a thin save endpoint added later.
3. **Minimal real backend:** `teams`/`matches` tables, seeded by hand (skip external data sourcing initially), one real `GET /api/matches` endpoint, swap frontend mock data for a real `fetch` + `useEffect` call. Deploy this bare-bones version immediately.
4. **Real auth:** signup/login, protected routes, JWT stored client-side.
5. **Favorites** (star a team) — simplest authenticated write, good first end-to-end "requires login" feature.
6. **Standings**, computed server-side from your seeded data.
7. **Transfer Radar**, wired to real (seeded, then RSS-sourced) data.
8. **Wire in real external data** (§4a) — swap seeded data for the FotMob wrapper / football-data.org sync, now that the DB→API→frontend loop is already proven.
9. **Matchday Coins prediction engine** — lock-at-kickoff rule, atomic Postgres updates (§8). Build this only once the Coins reward values in §3.3 are the ones actually implemented — they're canonical now, don't re-litigate them mid-build.
10. **WebSocket/SSE live push** for the Pressure Index — last among core features, since it's the hardest piece and should build on everything else already working via simple refresh.

### 10.4 Known-hard parts (do not underestimate)
- WebSocket/SSE reconnect and staleness handling.
- JWT refresh rotation with reuse detection.
- Atomic Postgres updates under concurrent settlement jobs (§8) — understanding *why* a naive read-then-write loses updates, not just copying the `UPDATE` pattern.
- External data-source rate limits and the unofficial-FotMob-wrapper stability risk (§4a) — plan for it breaking occasionally.
- Timezone bucketing for "today" (§3.1) — deceptively simple-sounding, a classic off-by-one-day bug source.
- Drag-and-drop coordinate math in the Tactics Lab (normalized x/y slots, snapping, mobile touch support).
- Standings tiebreaker logic (goal difference, head-to-head) — fiddlier than "sort by points."

---

*This document is the master engineering and product specification for LiveKick v5.0. Update this file directly — do not fork it again.*
