# LiveKick — Architecture

**Status:** Living document, reflects the codebase as it actually exists. When the codebase changes shape, update this file in the same change — don't let it drift like the docs it replaced (see the note at the bottom).

---

## 1. High-level shape

```
LiveKick/
├── frontend/          React 19 + Vite SPA — everything the user sees today
├── backend/           Express skeleton — not yet wired to the frontend
├── docs/               This document set + reference mockups (docs/Designs/)
├── DESIGN.md            Root-level design system source of truth
└── README.md
```

The app is currently **frontend-only in practice**: every page renders against `frontend/src/data/mockData.js`. The `backend/` folder exists as a starting skeleton (`server.js`, Express) but nothing in the frontend calls it yet — see [`TRD.md`](TRD.md) §4 for the backend build plan.

Deployed at `livekick-zeta.vercel.app` (frontend only, via Vercel).

---

## 2. Frontend structure

```
frontend/src/
├── assets/              Brand logos, hero art
├── components/
│   ├── auth/            AuthBackground, AuthCard, AuthHero, LoginForm, RegisterForm, OtpInput, GoogleButton
│   ├── feed/             DateSelector, LeagueGroup, MatchRow, PressureBar
│   ├── icons/             CoinIcon, StarIcon (custom SVG — no emoji, per DESIGN.md)
│   ├── layout/           AppLayout (shell), Sidebar, TopNav
│   ├── news/              ArticleCard, CategoryPills, HeroArticle
│   ├── panels/            MatchOfTheDayCard, NewsList, PredictorCard
│   ├── search/            SearchModal (⌘K global search)
│   ├── shared/            Breadcrumb, Crest, Flag, Logo — reused across every page
│   ├── standings/         LeagueSelector, StandingsRow, StandingsTable, TopAssistsCard, TopScorersCard
│   ├── team-profile/     AboutSection, FixtureDifficultyCard, FixturesTab, SquadTab, StadiumInfoCard,
│   │                     StartingXI, TeamForm, TeamNews, TeamNewsTab, TopPerformers, TransfersTab
│   └── transfers/        FeeRangeSlider, TeamLeagueSearch, TierPill, TimeframeSelect, TransferCard,
│                         TransferFeed, TransferFilters, TransferSidebar
├── context/
│   └── FollowedTeamsContext.jsx   The only global state: followed teams, persisted to localStorage
├── data/
│   └── mockData.js       Single source of all app data today — see TRD.md §2 for shapes
├── hooks/
│   └── useLenisScroll.js  Element-scoped smooth scroll (Lenis), applied per-container, never to window
├── pages/                 One component per route — see §3
├── routes/
│   └── AppRouter.jsx      All route definitions, wraps the tree in FollowedTeamsProvider
├── styles/
│   ├── tokens.css         Design tokens — the single source of truth for color/spacing/radius/shadow
│   └── StubPage.css       Shared "coming soon" empty-state card used by every stub page
├── utils/
│   └── matchHelpers.jsx
├── App.jsx
├── index.css              Global reset, base styles, shared utility classes (imports tokens.css)
└── main.jsx                Entry point; imports self-hosted fonts, mounts <App/>
```

There is **no global state library** (no Redux/Zustand) and, currently, **no auth context** — `FollowedTeamsContext` is the only cross-app state, backed by `localStorage`. The Login page's UI is fully built but not wired to any real session/auth state yet (see [`PRD.md`](PRD.md) §2).

## 3. Routing map

Defined in `frontend/src/routes/AppRouter.jsx`, eager-loaded (no code-splitting):

| Path | Component | Notes |
|---|---|---|
| `/` | `HomeFeed` | |
| `/news` | `News` | |
| `/standings` | `Standings` | Reads `?league=<slug>` |
| `/transfers` | `Transfers` | |
| `/predictions` | `PredictionsLeague` | Stub |
| `/tactics` | `TacticsLab` | Stub |
| `/login` | `Login` | |
| `/settings` | `Settings` | Stub |
| `/matches/:id` | `MatchDetail` | Stub |
| `/teams/:id`, `/teams/:id/:tab` | `TeamDetail` | Tabs: overview, fixtures, squad, transfers, stats (stub), news |
| `/players/:id`, `/coach/:id` | `PlayerDetail` | Stub |

## 4. Design system enforcement

Every component CSS file consumes `var(--token-name)` from `frontend/src/styles/tokens.css` — no hardcoded hex/spacing/radius values. The full token contract, color palette, typography rules, and the current "restrained, no-AI-slop" motion/elevation discipline live in [`/DESIGN.md`](../DESIGN.md); that file is the single design source of truth and must stay in sync with `tokens.css` whenever either changes.

Shared primitives every page should reuse rather than reinvent:
- **Card**: the double-bezel treatment (outer border + inset shadow + outer shadow) — never redefine a card's background/border/radius locally.
- **`Crest`** (`components/shared/Crest.jsx`): team/league badge with automatic fallback to an initials monogram on image-load failure. Every team/league image in the app goes through this component.
- **`StubPage.css`**: the shared "coming soon" card for placeholder routes (Settings, Tactics Lab, Predictions League, Match Detail, Player Detail).

## 5. Backend (current state)

`backend/server.js` — an Express skeleton, not connected to the frontend, no database provisioned, no routes consumed by any page. See [`TRD.md`](TRD.md) §4 for the intended build-out (PostgreSQL, JWT auth, scheduled external-data sync, WebSocket/SSE live push) and §6 for a realistic build order.

## 6. Known open issues

Carried forward from prior audit passes — not yet re-verified against the current codebase, so treat as "reported" rather than "confirmed live":
- Team Profile's Fixture Difficulty / Upcoming Fixtures widgets have been reported to show the same opponent twice in a "next 3" list with duplicate timestamps — likely one root cause in whatever selects upcoming fixtures; worth a single investigation covering both widgets rather than patching each separately.
- `PredictorCard` reads `currentUser.matchdayCoins` directly from mock data rather than from any real session state — harmless today since there's no real auth yet, but flag this when wiring real auth so it doesn't silently keep reading the mock user.
- The notification bell in `TopNav` has no click handler/dropdown wired.

## 7. Where the old docs went

This file, along with [`PRD.md`](PRD.md) and [`TRD.md`](TRD.md), replaces several previous overlapping documents (a full app-context snapshot, a v5 PRD describing a stack that didn't match what was actually implemented, a competing design spec with different tokens than the real `tokens.css`, and several page-specific handoff notes). Their useful content was folded in here; they were removed to stop the doc set drifting out of sync with itself. If you're an AI assistant picking up this project cold: `README.md` → `DESIGN.md` → this file → `PRD.md` → `TRD.md` is the complete, current context in that order.
