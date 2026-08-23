# LiveKick — Full Codebase & Feature Audit Context

> **Last Updated:** August 24, 2026  
> **Source of Truth:** Single comprehensive snapshot of the entire LiveKick application structure, components, data flows, routing, and auth state.

---

## 1. Tech Stack & Global Architecture

### Core Technologies
- **Framework:** React 19 (`react` ^19.0.0, `react-dom` ^19.0.0)
- **Routing:** React Router DOM v7 (`react-router-dom` ^7.1.5)
- **Build Tool / Dev Server:** Vite v6 (`vite` ^6.1.0)
- **Styling Strategy:** Vanilla CSS with a centralized token architecture (`tokens.css` imported into `index.css`). No TailwindCSS or CSS Utility frameworks.
- **Typography:** Self-hosted Google Fonts via `@fontsource` packages:
  - Display & Headings: `Big Shoulders Display` (700, 800, 900)
  - Body & UI: `Inter` (400, 500, 600, 700)
  - Scores, Timers & Mono Metrics: `JetBrains Mono` (400, 600, 700)
- **Icons:** `lucide-react` (^0.475.0). Native emojis are strictly banned per design rules.

### Global & Shared Systems
- **Design Tokens (`tokens.css`):** Defines strict CSS variables:
  - Surface Palette: `--color-base` (`#080c11`), `--color-surface` (`#0d1520`), `--color-surface-elevated` (`#111820`), `--color-border` (`#1e2a35`), `--color-surface-hover` (`rgba(255,255,255,0.04)`)
  - Accent Colors: Pitch Green `--color-pitch-green` (`#00B370`), Gold `--color-gold` (`#f59e0b`), Live Red `--color-live-red` (`#f87171`)
  - Text Hierarchy: `--color-primary` (`#f1f5f9`), `--color-secondary` (`#94a3b8`), `--color-faint` (`#475569`)
  - Radii & Shadows: `--radius-card` (14px), `--radius-pill` (9999px), `--radius-badge` (8px)
- **Shared Components:**
  - `Logo.jsx` / `Logo.css` (`src/components/shared/Logo.jsx`): Reusable brand emblem combining the cleat icon image and "LiveKick" display text. Supports size variants: `small`, `normal`, `large`, `xl`.
  - `Crest.jsx` / `Crest.css` (`src/components/shared/Crest.jsx`): Standardized team/league crest image renderer. Features automatic image fallback to a styled team-initials badge if the logo URL fails to load.
  - `Breadcrumb.jsx` / `Breadcrumb.css` (`src/components/shared/Breadcrumb.jsx`): Standardized top navigation path component.
- **Global Contexts:**
  - `AuthProvider` (`src/context/AuthContext.jsx`): Provides `isAuthenticated`, `user`, `login(email)`, and `logout()` across the entire app tree.
- **Global Smooth Scroll:** `useLenisScroll` hook (`src/hooks/useLenisScroll.js`) integrating Lenis smooth scrolling on container refs.

### Routing Map (`src/routes/AppRouter.jsx`)
All routes are enclosed within `<BrowserRouter>` and wrapped inside `<AuthProvider>`.

| Route Path | Component File | Accessibility | Description |
| :--- | :--- | :--- | :--- |
| `/` | `src/pages/HomeFeed.jsx` | Public | Live scores, match feed grouped by league, MOTD, Predictor, News |
| `/news` | `src/pages/News.jsx` | Public | Football news & editorial feed with category filtering & load-more |
| `/standings` | `src/pages/Standings.jsx` | Public | League tables with form guides, Top Scorers & Top Assists stats |
| `/transfers` | `src/pages/Transfers.jsx` | Public | Transfer Radar index with multi-filter sidebar & sorting |
| `/predictions` | `src/pages/PredictionsLeague.jsx` | **Gated** | Fan prediction leaderboards (redirects guests to `/login?redirect=/predictions`) |
| `/tactics` | `src/pages/TacticsLab.jsx` | Public | Tactical lineup builder stub |
| `/login` | `src/pages/Login.jsx` | Public | Full-bleed auth page (Login/Register/OTP, reads `?redirect=` param) |
| `/settings` | `src/pages/Settings.jsx` | Public | Account settings & preferences stub |
| `/matches/:id` | `src/pages/MatchDetail.jsx` | Public | Match detail stub (timeline, lineups, stats) |
| `/teams/:id` | `src/pages/TeamDetail.jsx` | Public | Team profile stub |

---

## 2. Page-by-Page Inventory

### 1. Home Feed (`src/pages/HomeFeed.jsx`)
- **Overview:** Main dashboard landing page featuring a center feed for live and scheduled matches grouped by league, flanked by a right-hand stats & news panel.
- **Full Feature List:**
  - **Date Selector Ribbon (`DateSelector.jsx`):** Horizontal scrollable day picker (past days, "TODAY", future days). Selecting a date filters the match list.
  - **Match Day Live Filter:** Sidebar toggle button (`#match-day-live-btn`) that filters the home feed to display only live matches (`status === 'live'`).
  - **League Match Grouping (`LeagueGroup.jsx`):** Grouped match cards by league (Premier League, La Liga, Champions League, etc.) with league headers and matchday badges.
  - **Match Row Component (`MatchRow.jsx`):** Renders home/away team crests and names, retro black scoreboard digits (`digit`) for scores, live minute tags (`64'`), status badges (`LIVE`, `FT`, scheduled time), match odds (1 X 2 pills), and links to `/matches/:id`.
  - **Live Pressure Bar (`PressureBar.jsx`):** Interactive momentum/pressure visualizer bar displayed inside live match rows.
  - **Match of the Day Hero (`MatchOfTheDayCard.jsx`):** Highlighting the marquee match of the day with team crests, venue, kick-off countdown timer, and stadium glow styling.
  - **Fan Predictor Widget (`PredictorCard.jsx`):** Interactive voting card for predicting match outcomes (Home / Draw / Away). Integrates vote percentages and user Matchday Coins reward logic.
  - **Editorial News List (`NewsList.jsx`):** Compact right-panel widget listing top 3 latest editorial news articles with thumbnails and timestamps.
- **Sub-Components:** `DateSelector`, `LeagueGroup`, `MatchRow`, `PressureBar`, `MatchOfTheDayCard`, `PredictorCard`, `NewsList`, `SearchModal`.

### 2. Transfers Radar (`src/pages/Transfers.jsx`)
- **Overview:** Comprehensive transfer & rumor hub with real-time filtering, column sorting, and multi-criteria sidebar controls.
- **Full Feature List:**
  - **Header & Breadcrumbs:** Displays page title "Transfer Radar" and subtitle "TRANSFER & RUMOR INDEX".
  - **Transfer Tab Bar (`TransferFilters.jsx`):** Filter tabs for `ALL`, `TIER 1 CONFIRMED`, `DONE DEALS`, and `RUMORS`.
  - **Column Header Sort:** In-table interactive sorting headers for **FEE** (descending/ascending) and **DATE** (descending/ascending) with sort direction arrows.
  - **Transfer Card List (`TransferCard.jsx`):** Displays from/to team crests & names, player avatar + name, position badge, transfer fee pill (`FREE`, `LOAN`, `UNDISCLOSED`, or `€XXM`), tier badge (`TierPill.jsx` for Tier 1 / 2 / 3), rumor probability progress bar, transfer date, and journalist source link.
  - **Multi-Select Team/League Filter (`TeamLeagueSearch.jsx`):** Search input with instant autocomplete popover allowing users to select multiple teams and leagues as active removable chips (OR logic filtering).
  - **Dual-Handle Fee Range Slider (`FeeRangeSlider.jsx`):** Range slider filtering transfers from €0M to €150M+. Automatically clamps slider max when changing tabs.
  - **Timeframe Selector (`TimeframeSelect.jsx`):** Custom dropdown filtering transfers by `All Time`, `Past Week`, or `Past Month`.
  - **Position & Transfer Type Filter Pills:** Radio-style filter pills for position (GK, DEF, MID, FWD) and transfer type (Permanent, Loan, Free).
  - **Top Deals Panel:** Right-sidebar widget listing the top 3 highest-value confirmed transfer deals.
  - **Pagination & Reset:** "Load More Transfers" button (loads 8 at a time) and an Empty State with a "Reset filters" button.
- **Sub-Components:** `TransferFilters`, `TransferCard`, `TransferSidebar`, `TeamLeagueSearch`, `FeeRangeSlider`, `TimeframeSelect`, `TierPill`, `Breadcrumb`, `SearchModal`.

### 3. League Standings (`src/pages/Standings.jsx`)
- **Overview:** Complete league tables and top player statistics with URL search parameter persistence (`?league=slug`).
- **Full Feature List:**
  - **League Selector Pills (`LeagueSelector.jsx`):** Horizontal scrollable league selector (Premier League `pl`, La Liga `laliga`, Champions League `ucl`, Bundesliga `bundesliga`, Serie A `seriea`, Ligue 1 `ligue1`). Automatically validates and syncs with `?league=` URL param.
  - **Standings Table (`StandingsTable.jsx` / `StandingsRow.jsx`):** Detailed league table showing rank position, team crest & name, Played (P), Won (W), Drawn (D), Lost (L), Goals For (GF), Goals Against (GA), Goal Difference (GD), Points (PTS), and last 5 match form guide (colored dots W/D/L with tooltip scores). Rows link to `/teams/:id`.
  - **Top Scorers Widget (`TopScorersCard.jsx`):** Right-sidebar leaderboards showing top 5 goal scorers for the active league (rank, player avatar, player name, team crest + name, goal count).
  - **Top Assists Widget (`TopAssistsCard.jsx`):** Right-sidebar leaderboards showing top 5 assist leaders for the active league (rank, player avatar, player name, team crest + name, assist count).
- **Sub-Components:** `LeagueSelector`, `StandingsTable`, `StandingsRow`, `TopScorersCard`, `TopAssistsCard`, `SearchModal`.

### 4. News & Editorial (`src/pages/News.jsx`)
- **Overview:** Editorial hub featuring categorized football articles and news stories.
- **Full Feature List:**
  - **Breadcrumbs & Title:** Displays path `Home > News` and title "Football News & Editorial".
  - **Category Pills (`CategoryPills.jsx`):** Filter pills for `LATEST`, `TRANSFERS`, `MATCHES`, `TACTICS`, and `RUMOURS`.
  - **Article Grid (`ArticleCard.jsx`):** 2-column responsive grid displaying article cards with category badges, headlines, author names, read time, relative timestamps (`1h ago`), high-resolution imagery, and hover zoom effects.
  - **Pagination:** "Show More" button incrementing visible articles by 4. Shows "You're all caught up" when exhausted.
- **Sub-Components:** `CategoryPills`, `ArticleCard`, `Breadcrumb`, `SearchModal`.

### 5. Login / Signup Page (`src/pages/Login.jsx`)
- **Overview:** Full-bleed interactive authentication page supporting Password login, 6-digit OTP verification, and Register flows.
- **Full Feature List:**
  - **Full-Bleed Animated Background (`AuthBackground.jsx`):** Fixed viewport layer with a cursor-reactive pitch-green spotlight, 12 upward drifting ambient particles, a 7s breathing grid pulse, and diagonal floodlight streaks.
  - **Hero Zone (`AuthHero.jsx`):** Large `Logo` component, tagline *"Every match. Every moment."*, staggered entrance animation (fades up at t=40ms), and an idle glow pulse halo behind the boot icon.
  - **Glassmorphism Auth Card (`AuthCard.jsx`):** Backdrop blur surface (18px blur, 88% opacity) with scene-lit outer green glow and dynamic title/subtext header per step.
  - **LoginForm (`LoginForm.jsx`):** Password mode vs OTP Code segmented toggle. OTP mode features a 2-phase workflow: (1) Request code -> (2) Enter 6-digit OTP with a 30s resend countdown timer.
  - **RegisterForm (`RegisterForm.jsx`):** Multi-step registration flow: Form inputs -> OTP Email Verification -> Success state with animated checkmark.
  - **Shared OTP Input (`OtpInput.jsx`):** 6-digit auto-advancing input with backspace navigation, paste support, 3+3 scannability gap, dash placeholders, focus glow, shake + red-flash on error, and green glow on success (mock correct code: `123456`).
  - **Google OAuth Simulation (`GoogleButton.jsx`):** White Google sign-in button featuring the official 4-color G logo SVG and a toast notice simulation.
  - **Redirect Flow:** Reads `?redirect=` query param on load and redirects to that exact path upon successful authentication (with a 320ms post-success animation delay).
- **Sub-Components:** `AuthBackground`, `AuthHero`, `AuthCard`, `LoginForm`, `RegisterForm`, `OtpInput`, `GoogleButton`.

### 6. Stub Pages (Phase 1 Placeholders)
- **Match Detail (`src/pages/MatchDetail.jsx`):** Route `/matches/:id`. Displays match teams, scores, and status from `mockData.js`. Stub message: *"Full match detail (timeline, lineups, stats) coming in Phase 1."*
- **Team Detail (`src/pages/TeamDetail.jsx`):** Route `/teams/:id`. Displays team name from `mockData.js`. Stub message: *"Full team profile coming in Phase 1."*
- **Predictions League (`src/pages/PredictionsLeague.jsx`):** Route `/predictions`. Gated route for guests. Stub message: *"Global and Friends leaderboards, Matchday Coins history coming in Phase 1."*
- **Tactics Lab (`src/pages/TacticsLab.jsx`):** Route `/tactics`. Stub message: *"Interactive pitch builder with drag-and-drop formations coming in Phase 1."*
- **Settings (`src/pages/Settings.jsx`):** Route `/settings`. Stub message: *"Account settings and preferences coming in Phase 1."*

---

## 3. Shared UI Systems

### Top Navigation (`src/components/layout/TopNav.jsx` / `TopNav.css`)
- **Brand Logo:** Renders `<Logo size="normal" />` inside a fixed 240px block aligning perfectly with the sidebar border.
- **Global Search Button:** Centered search button (`#global-search-btn`) with placeholder text and `⌘K` keyboard shortcut badge. Triggers `SearchModal`.
- **Authenticated State:**
  - Coin Balance Pill (`.topnav__coin-pill`): Renders coin SVG icon and formatted coin count (`1,250`).
  - Notification Bell (`#notification-bell`): Bell icon with an active unread red dot (`.topnav__notif-dot`).
  - User Avatar Button (`#user-avatar-btn`): Displays user's avatar image generated via `ui-avatars.com` (or initial fallback). Clicking it fires `logout()` (dev shortcut until full dropdown pass).
- **Guest State:**
  - Ghost Sign In Button (`#topnav-signin-btn`): Transparent background, `1px solid --color-border`, `--color-secondary` text, hover pitch-green border & surface-hover fill. Clicking navigates to `/login?redirect=<encoded_current_path>`.
  - Hides coin balance, notification bell, and avatar circle entirely.

### Left Sidebar (`src/components/layout/Sidebar.jsx` / `Sidebar.css`)
- **Fixed Width & Regions:** Fixed 240px left sidebar divided into three functional regions:
  1. **Region 1 — Fixed Main Nav:**
     - Links: `Matches` (`/`), `News` (`/news`), `Standings` (`/standings`), `Transfers` (`/transfers`), `Predictions League` (`/predictions` — gated with a Lock icon for guests), `Tactics Lab` (`/tactics`).
  2. **Region 2 — Scrollable Accordions:**
     - **My Teams Accordion:**
       - *Authenticated:* Displays favorited team rows (team crest, team name, live match dot indicator if team is playing, remove button) + "Add Team" button launching a portal popover picker (`PickerPopover`).
       - *Guest:* Displays a dashed locked-state prompt (`.sidebar__teams-locked-prompt`) with a Lock icon and text *"Sign in to follow your teams"*, linking to `/login?redirect=<current_path>`.
     - **My Leagues Accordion:** Displays favorited league rows (league logo, name, active highlight if matching current standings URL, remove button) + "Add League" button launching `PickerPopover`.
  3. **Region 3 — Fixed Bottom:**
     - `Settings` link (`/settings`).
     - `Match Day Live` toggle button (`#match-day-live-btn`) with pulsing live dot (rendered when on Home Feed `/`).

### Overlays & Modals
- **Global Search Modal (`src/components/search/SearchModal.jsx`):**
  - Triggered via `⌘K` or search button click.
  - Features an auto-focus search input, backdrop blur overlay, and keyboard navigation (Up / Down / Enter / Escape).
  - Searches leagues (navigates to `/standings?league=<slug>`) and teams (navigates to `/teams/<id>`). Locks body scroll while open.
- **Portal Popover Picker (`PickerPopover` inside `Sidebar.jsx`):**
  - Floating portal popover for picking teams/leagues to add to sidebar favorites.
  - Positioned relative to the trigger button using `getBoundingClientRect()`. Includes internal search input, item list, and backdrop click handler.

---

## 4. Data Layer & Schemas

### Primary Mock File (`src/data/mockData.js`)
All application data is served from this single file (~90KB). Main exported datasets:

1. **`teams` (96 items):**  
   - Schema: `{ id, name, shortName, league, country, logoUrl, crestUrl, primaryColor, secondaryColor }`.  
   - Covers teams across Premier League, La Liga, Bundesliga, Serie A, and Champions League.
2. **`leagues` (6 items):**  
   - Schema: `{ id, name, slug, matchday, country, logoUrl }`.  
   - Slugs: `pl`, `laliga`, `ucl`, `bundesliga`, `seriea`, `ligue1`.
3. **`matches` (24 items):**  
   - Schema: `{ id, homeTeam, awayTeam, homeScore, awayScore, status ('live'|'finished'|'scheduled'), minute, timestamp, league, matchday, pressureStats, odds }`.
4. **`transfers` (35 items):**  
   - Schema: `{ id, player, position, fromTeam, toTeam, fee, tier (1|2|3), status ('confirmed'|'rumour'), transferType, transferDate, timestamp, rumourProbability, source, sourceUrl }`.
5. **`news` (12 items):**  
   - Schema: `{ id, headline, title, category ('LATEST'|'TRANSFERS'|'MATCHES'|'TACTICS'|'RUMOURS'), source, author, readTime, timeAgo, imageUrl }`.
6. **`topScorers` & `topAssists`:** League statistics keyed by league name.
7. **`currentUser`:** `{ id: 1, name: "Namra", email: "namra@example.com", matchdayCoins: 2450, favoriteTeamIds: [1..12] }`.
8. **`predictorMatches` & `coinRewardRules`:** Fan prediction game data and reward point configurations.
9. **`globalLeaderboard` & `savedFormations`:** Leaderboard ranks and tactical pitch slot positions.

### Data Shape Discrepancies & Observations
- **Dual Crest Fields:** Team objects contain both `logoUrl` and `crestUrl` pointing to the same image. `Crest.jsx` handles this via `logoUrl ?? crestUrl`.
- **League Referencing:** In `teams`, `league` is a full string (e.g. `"Premier League"`). In `leagues`, `slug` is used (`"pl"`). `Standings.jsx` maps these via `LEAGUE_BY_SLUG`.
- **Match vs. Transfer Teams:** Match objects store embedded `homeTeam` / `awayTeam` objects, whereas transfer objects store `fromTeam` / `toTeam` objects (which can be `null` for free agents).

---

## 5. Auth State & Protection Architecture

### `AuthContext` Implementation (`src/context/AuthContext.jsx`)
- **State:**
  - `isAuthenticated`: Boolean (defaults to `false` on fresh load / app start).
  - `user`: Object `{ name: 'Namra', email, matchdayCoins: 1250 }` or `null`.
- **Methods:**
  - `login(email)`: Sets `user` with provided email, sets `isAuthenticated = true`.
  - `logout()`: Resets `user = null`, `isAuthenticated = false`, removes `livekick_user` localStorage item.
- **Consumption:**
  - Wrapped around the entire app in `AppRouter.jsx`.
  - Consumed by `TopNav.jsx` (switches guest Sign In button vs authenticated avatar/coins), `Sidebar.jsx` (gates My Teams & Predictions League), and `Login.jsx` (triggers `login()` on authentication).

### Gated Actions & Redirect Flow
- **Gated Triggers:**
  - Predictions League nav item in Sidebar.
  - My Teams locked prompt in Sidebar.
  - TopNav Sign In button.
- **Redirect Mechanism:**
  - Gated triggers construct the target URL as `/login?redirect=${encodeURIComponent(currentPath)}`.
  - `Login.jsx` reads `searchParams.get('redirect')`, performs authentication, and navigates back to the decoded redirect path after a 320ms success animation.

---

## 6. Known Bugs & Inconsistencies (Audit Findings)

1. **Predictor Card Coin Balance Discrepancy:** `HomeFeed.jsx` passes `userBalance={currentUser.matchdayCoins}` directly from `mockData.js` instead of reading `user?.matchdayCoins` from `AuthContext`. As a result, the Predictor widget displays `2,450` coins even in guest mode.
2. **Notification Bell Unwired:** The notification bell in `TopNav` is hidden for guests, but when visible for logged-in users, clicking it has no handler or dropdown panel attached.
3. **Avatar Click Logout Shortcut:** Clicking the user avatar in `TopNav` directly logs the user out without showing an account dropdown menu (profile menu pass is deferred).
4. **Auth State Reset on Refresh:** `AuthContext` defaults `isAuthenticated` to `false` on browser reload (mock in-memory auth behavior).
