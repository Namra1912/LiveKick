# LiveKick — Technical Requirements Document

**Status:** Living document. §1–§2 describe what's actually implemented today; §3 onward describe technical requirements for the backend work that hasn't started yet. See [`ARCHITECTURE.md`](ARCHITECTURE.md) for how the current frontend is structured, and [`PRD.md`](PRD.md) for product scope.

---

## 1. Current tech stack (implemented)

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | React 19 + Vite | `frontend/` |
| Styling | Vanilla CSS + a centralized token system (`tokens.css`) | No Tailwind, no CSS-in-JS. See [`DESIGN.md`](../DESIGN.md) for the full token contract. |
| Routing | React Router v7 | `frontend/src/routes/AppRouter.jsx`, all routes eager-loaded |
| Icons | `lucide-react` | No emoji anywhere in shipped UI |
| Fonts | Self-hosted via `@fontsource` (Big Shoulders Display, Inter, JetBrains Mono) | Imported once in `main.jsx`; never a Google Fonts `<link>` at runtime in the shipped app |
| Smooth scroll | `lenis`, applied per-container via `useLenisScroll` | Never attached to `window`/`document` |
| Local persistence | `localStorage` directly (favorited teams/matches, sidebar accordion state) | No Redux/Zustand — plain component state + one Context (`FollowedTeamsContext`) is enough at this scale |
| Backend | Node.js + Express (`backend/server.js`) | Skeleton only, not connected to the frontend |
| Data | `frontend/src/data/mockData.js` | Single mock file backing every page — see §2 |
| Deployment | Vercel (frontend) | `livekick-zeta.vercel.app` |
| Lint | `oxlint` | `npm run lint` in `frontend/` |

## 2. Current data layer (mock)

All frontend data comes from `frontend/src/data/mockData.js`. Representative shapes:

- `teams`: `{ id, name, shortName, league, country, logoUrl, crestUrl, primaryColor, secondaryColor }`
- `leagues`: `{ id, name, slug, matchday, country, logoUrl }`
- `matches`: `{ id, homeTeam, awayTeam, homeScore, awayScore, status: 'live'|'finished'|'upcoming', minute, matchDateUtc, league, matchday, pressureHome, pressureAway, lastSynced }`
- `transfers`: `{ id, player, position, fromTeam, toTeam, fee, tier: 1|2|3, status: 'confirmed'|'rumor', transferType, transferDate, timestamp, source, sourceUrl }`
- `news`: `{ id, headline, title, category, source, author, timeAgo, imageUrl }`
- `topScorers`, `topAssists`: keyed by league name
- `currentUser`: mock signed-in user with `matchdayCoins`, `favoriteTeamIds`

Known data-shape quirks worth knowing before writing code against this file:
- Team objects carry both `logoUrl` and `crestUrl` pointing at the same image — `Crest.jsx` resolves via `logoUrl ?? crestUrl`.
- `teams[].league` is a full string (`"Premier League"`); `leagues[].slug` is a short code (`"pl"`). Anything joining the two needs an explicit lookup — see `leaguesByName` in `HomeFeed.jsx` for the existing pattern.
- Match objects embed `homeTeam`/`awayTeam`; transfer objects embed `fromTeam`/`toTeam` (nullable — a transfer can be to/from an unlisted club).

---

## 3. Non-functional requirements (current, applies today)

- **Accessibility:** every interactive element is a real `<button>`/`<a href>`/`<input>`+`<label>`, never a `div`/`span` with an `onClick`. Icon-only controls get `aria-label`. The global `:focus-visible` ring in `index.css` must never be removed from an interactive element. Text contrast targets AA (4.5:1 body, 3:1 at 24px+/bold).
- **Responsiveness:** desktop (1440px design target) down to phone (375px) must never clip, overflow, or require horizontal scroll on primary content — a horizontally-scrolling data table (Standings, Squad) is the one accepted exception, matching the existing pattern.
- **Motion:** one shared easing/duration system, not per-component values. Nothing animates without a stated reason (state change, feedback, spatial continuity) — decoration with no functional purpose gets cut. See [`DESIGN.md`](../DESIGN.md) for the canonical motion tokens.
- **No hardcoded design values:** colors, spacing, radius, and shadows come from `tokens.css`. A new component defining its own card background/border/radius instead of reusing the shared card pattern is a defect, not a stylistic choice.

---

## 4. Backend technical requirements (once implementation starts)

Not yet built — this section is the spec to build against, not a description of current state.

### 4.1 Stack decision
| Layer | Choice | Rationale |
|---|---|---|
| Backend framework | Node.js + Express | Matches the existing `backend/` skeleton; async-friendly for rate-limited external syncs |
| Database | PostgreSQL + an ORM (Prisma or Knex) | The data is inherently relational (Team ← Match ← Prediction ← User, all real foreign keys) — pick this over Mongo/Mongoose even though the current `backend/server.js` stub was scaffolded against MongoDB; that scaffold has not been built out and this is the intended direction going forward. |
| Real-time transport | Socket.io or native SSE | Server pushes live match-state changes to connected clients; the frontend must never run its own polling timer on top of this |
| Auth | JWT short-lived access token (15 min) + httpOnly refresh cookie, rotated on use | See §4.3 |
| Scheduled jobs | `node-cron` | Live sync every 60–90s; transfer/news sync 1–2×/day |

### 4.2 External data sourcing
No single free API covers live scores, deep stats, player profiles, news, and transfers at once. Put every source behind one internal `MatchProvider`/`NewsProvider` interface so the sync layer can be swapped without touching the frontend or DB schema:

| Need | Primary | Fallback | Notes |
|---|---|---|---|
| Live-ish scores, stats, lineups | Unofficial FotMob API wrapper | football-data.org free tier | Unofficial wrapper is reverse-engineered, unsanctioned, no uptime guarantee — acceptable for personal/low-traffic use only, revisit before any commercial/public-scale deployment |
| Standings | football-data.org free tier | Computed server-side from cached match data either way | Keep this on the official source even if FotMob is primary for scores |
| News | RSS (e.g. BBC Sport football feed) | FotMob wrapper's news endpoint | Headline + short excerpt + source link only — never reproduce full article bodies |
| Transfers + tier classification | RSS/FotMob transfer feed + a rule-based source classifier | Manually seeded sample data | Tiering is a heuristic on source name, not a licensed credibility API |
| Player/team profile depth | TheSportsDB free tier | Manually seeded data | football-data.org's free tier excludes squad/player-level data entirely |

**Before writing the cron job:** football-data.org's free tier caps around 10 requests/minute and doesn't cover every league. Tracking 5+ leagues at a 60–90s cadence will hit that ceiling — decide explicitly between (a) a paid tier for the leagues actually launched with, or (b) launching with 1–2 leagues and expanding once budget is confirmed.

### 4.3 Security spec
- **Password hashing:** bcrypt (cost factor 12) or argon2id — pick one and record the choice in the backend README once implemented.
- **CSRF:** `SameSite=Strict` on the refresh cookie, plus a custom header requirement (e.g. `X-Requested-With`) on state-changing requests — httpOnly alone stops XSS token theft but does nothing against CSRF by itself.
- **Rate limiting:** `/api/auth/login` and `/api/auth/signup` limited (e.g. `express-rate-limit`, 5 attempts/15min/IP).
- **JWT:** short-lived access token, refresh token rotated on each use with reuse detection (catches stolen-token replay).
- **Input validation:** all POST/PUT bodies validated server-side (Zod or Joi) before hitting the database — never rely on frontend validation alone.

### 4.4 Data model (target — PostgreSQL)
Core tables: `teams`, `users` (with `matchday_coins`, `last_login_bonus_date` for the once-daily bonus, no `fan_xp`/`fan_level`/`badges` columns per the product's anti-pattern rule), `user_favorite_teams` (join table), `matches`, `fan_predictions` (with `locked_at` enforced server-side), `predictor_leagues` + `predictor_league_members` (join code system), `standings` (recomputed per sync, not live-queried), `formations` + `formation_slots`, `transfers`.

Coins/counter updates must be a single atomic `UPDATE` inside a transaction — never "read balance into app code, add, write back," which loses updates under concurrent settlement jobs:

```sql
BEGIN;
UPDATE users
SET matchday_coins = matchday_coins + $coinsEarned,
    total_predictions = total_predictions + 1,
    correct_predictions = correct_predictions + CASE WHEN $isCorrect THEN 1 ELSE 0 END
WHERE id = $userId;
COMMIT;
```

### 4.5 API surface (target)
`POST /api/auth/signup|login|refresh|logout`, `GET /api/matches` (`?date=&league=`), `GET /api/matches/:id`, `GET /api/standings/:league`, `GET /api/transfers` (`?tier=&league=`), `GET|POST|DELETE /api/users/me/favorites[/:teamId]`, `POST /api/predictions` (rejects if `match.status !== 'upcoming'`), `GET /api/predictions/me`, `GET /api/leaderboard/global`, `POST /api/leagues/predictor`, `POST /api/leagues/predictor/join/:code`, `GET|POST /api/formations[/me]`, `GET /api/formations/:id` (public, no auth), `WS /ws/matches` (public upgrade, live push).

---

## 5. Build order and learning sequence (for the solo builder)

Written so this section alone is enough context for picking up backend work without re-deriving the plan.

1. **Frontend shell first, no backend** — already done (see §1–2).
2. **Minimal real backend** — `teams`/`matches` tables seeded by hand (skip external sourcing initially), one real `GET /api/matches`, swap the frontend's mock import for a real `fetch`+`useEffect` call. Deploy this bare-bones version immediately rather than waiting.
3. **Real auth** — signup/login, protected routes, JWT stored client-side.
4. **Favorites** — first authenticated write, replaces the current `localStorage`-only `FollowedTeamsContext`.
5. **Standings**, computed server-side from seeded data.
6. **Transfer Radar**, wired to real (seeded, then RSS-sourced) data.
7. **Real external data** (§4.2) — swap seeded data for the FotMob wrapper / football-data.org sync, now that the DB→API→frontend loop is already proven.
8. **Matchday Coins prediction engine** — lock-at-kickoff rule, atomic Postgres updates (§4.4). Build only once the reward values in `PRD.md` §4.3 are final — they're canonical, don't re-litigate mid-build.
9. **WebSocket/SSE live push** for Pressure Index — last, since it depends on everything above already working via simple refresh.

**Known-hard parts, budget real time for these:** WebSocket/SSE reconnect and staleness handling; JWT refresh rotation with reuse detection; atomic Postgres updates under concurrent settlement (understand *why* naive read-then-write loses updates, not just copy the pattern); external data-source rate limits and the unofficial-wrapper stability risk; timezone bucketing for "today" (classic off-by-one-day bug source); drag-and-drop coordinate math in the Tactics Lab; standings tiebreaker logic (goal difference, head-to-head — fiddlier than "sort by points").
