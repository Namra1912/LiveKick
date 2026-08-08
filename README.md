# LiveKick ⚽⚡

LiveKick is a premium, real-time football companion web application for dedicated supporters — delivering instant score updates, elevated editorial typography, live match telemetry with signature Pressure Index visualization, functional search, smooth element-scoped scrolling, and a gamified Fan Prediction League driven by Matchday Coins (strictly 0% money/betting).

---

## 🚀 Key Completed Features (Home Feed Milestone)

### 📊 Home Feed & Match Center (`HomeFeed.jsx`)
- **Multi-League Scoreboard**: Displays matches grouped by top European leagues (*Premier League, La Liga, Champions League, Bundesliga, Serie A*).
- **Local Timezone Formatting**: All kickoff times and lock timers automatically format to the viewer's local clock using browser `toLocaleTimeString` and dynamic date resolution (*Today, Tomorrow, Weekday*).
- **Date Selector & Calendar Popover**: Interactive segmented date control (*Yesterday, Today, Tomorrow*) + custom calendar picker popover anchoring to local midnight.
- **Live Match Mode**: Dedicated live filter view with dynamic count badge, real-time status indicators, and clean fallback empty state.
- **Persistent Favorites**: One-click match favoriting with persistent `localStorage` synchronization.

### ⚡ Telemetry & Live Pressure Index (`PressureBar.jsx`)
- **Refined Color Collision Engine**: Intelligent 4-step color collision resolution algorithm (*Away Secondary → Home Secondary → Both Secondary → Pitch Fallback*) ensuring real team identity is preserved when primary club colors clash.
- **Visual Pressure Distribution**: Segmented 8px track visualizing home vs. away match dominance.

### 🎯 Feature Panels & Right Sidebar
- **Match of the Day Card (`MatchOfTheDayCard.jsx`)**: Large-format featured match card with dynamic local kickoff timing and team crests.
- **Fan Predictor Widget (`PredictorCard.jsx`)**: Interactive fan prediction card with Matchday Coin stakes, live fan lean distribution bar, and lock timer.
- **Trending News Panel (`NewsList.jsx`)**: Clickable news items and *"View All"* button with full keyboard accessibility (`Tab`, `Enter`, `Space`) navigating to `/news`.

### 🔍 Global Search Modal (`SearchModal.jsx`)
- **Keyboard Shortcut (`Ctrl+K` / `Cmd+K`)**: Opens search modal overlay anywhere in the app.
- **Instant Filtering**: Real-time searching across teams and leagues.
- **Full Keyboard Navigation**: Navigate results with `Up`/`Down` arrow keys, select with `Enter`, close with `Escape`.

### 🎨 Design System & Motion Architecture
- **Canonical Crest Component (`Crest.jsx`)**: Standardized team badge component supporting transparent PNGs and deterministic HSL monogram fallbacks.
- **Element-Scoped Smooth Scroll (`useLenisScroll.js`)**: Independent `lenis` smooth scroll instances attached specifically to three internal scroll containers (`.sidebar__scroll`, `.home-feed__center`, `.home-feed__right`) while preserving fixed-shell layout integrity.
- **Mount-Once Entrance Motion**: CSS `@keyframes hf-enter` entrance animation using `--ease-out-strong` easing curve, guaranteed to run strictly once on initial page mount.
- **Design Tokens**: Standardized radii (`--radius-card`, `--radius-badge`, `--radius-pill`), spacing tokens, and double-bezel visual depth styling.

---

## 📁 Project Structure

```
LiveKick/
├── docs/                                  # PRD, Design System Specifications & UI Wireframes
├── frontend/                              # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── feed/                      # DateSelector, LeagueGroup, MatchRow, PressureBar
│   │   │   ├── layout/                    # AppLayout, Sidebar, TopNav
│   │   │   ├── panels/                    # MatchOfTheDayCard, PredictorCard, NewsList
│   │   │   ├── search/                    # SearchModal
│   │   │   └── shared/                    # Crest component
│   │   ├── data/                          # Mock match, team, league & news datasets
│   │   ├── hooks/                         # useLenisScroll (element-scoped smooth scroll)
│   │   ├── pages/                         # HomeFeed page component
│   │   ├── routes/                        # AppRouter (React Router v6)
│   │   └── styles/                        # CSS design tokens & global stylesheets
│   ├── package.json
│   └── vite.config.js
├── backend/                               # Node.js + Express API Backend Shell
│   ├── server.js                          # Express Entrypoint
│   └── package.json
└── README.md                              # Root Repository Documentation
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide React (Icons)
- **Smooth Scroll**: Lenis (`lenis`)
- **Styling**: Vanilla CSS with CSS Custom Properties (Tokens) & BEM Methodology
- **Backend Shell**: Node.js, Express

---

## 💻 Getting Started

### 1. Frontend Application
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Application Shell
```bash
cd backend
npm install
npm run dev
```

---

## 📌 Development Roadmap

- [x] **Phase 1: Home Feed & Match Center** *(Completed)*
  - Scoreboard & league grouping
  - Telemetry & Pressure Index
  - Search Modal & Keyboard Navigation
  - Smooth Scrolling & Layout Polish
- [ ] **Phase 2: Full News & Editorial Page**
- [ ] **Phase 3: League Standings & Team Pages**
- [ ] **Phase 4: Fan Predictions & Coins System**
- [ ] **Phase 5: Real-time Backend API Integration**
