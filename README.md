<div align="center">

# LiveKick ⚽⚡

### High-Performance Real-Time Football Companion & Analytics Platform

A production-grade, full-stack football platform engineered for real-time match tracking, dynamic live telemetry, transfer intelligence, standings analysis, and a gamified Fan Prediction League driven by Matchday Coins.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-livekick--zeta.vercel.app-00B370?style=for-the-badge&logo=vercel&logoColor=white)](https://livekick-zeta.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](frontend/package.json)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](frontend/package.json)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](backend/package.json)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](backend/package.json)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](backend/package.json)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

> **LiveKick** is engineered from the ground up to outperform traditional match apps in visual aesthetic, motion fluidness, and server efficiency. It implements a decoupled caching architecture that insulates external sports APIs behind an Express/MongoDB pipeline with atomic wallet transactions and custom Lenis smooth-scrolling instances.

---

## ⚡ Project at a Glance

| Feature / Architecture Metric | Details |
|---|---|
| **Supported Leagues** | Premier League, La Liga, UEFA Champions League, Bundesliga, Serie A |
| **Design System** | Custom "Night-Pitch" dark theme (`#080c11` base, stadium glows, retro scoreboards) |
| **Smooth Scrolling** | Element-scoped `lenis` smooth scroll with `ResizeObserver` content height tracking |
| **Authentication Flow** | Full-bleed interactive canvas with OTP 6-digit verification & Google OAuth |
| **Rate-Limit Shielding** | Express caching pipeline with `node-cron` syncs (`lastSynced` client header) |
| **Wallet Settlement** | Race-condition free atomic `$inc` MongoDB transactions for predictions |

---

## 📚 Table of Contents

- [Key Features](#-key-features)
- [Design Architecture](#-design-architecture)
- [System Architecture](#-system-architecture)
- [Folder Structure](#-folder-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Roadmap & Milestones](#-roadmap--milestones)
- [License](#-license)

---

## 🚀 Key Features

### 📊 1. Multi-League Home Feed & Match Center
- **Dynamic League Groups**: Categorized schedules across European top tiers with collapsible accordion groups.
- **Local Timezone Resolution**: Automated kickoff timestamp formatting converting UTC server schedules into local 12-hour/24-hour clocks.
- **Date Selector & Calendar Popover**: Segmented quick-toggles (*Yesterday, Today, Tomorrow*) + custom calendar date picker.
- **Matchday Live Mode**: One-click live filter isolating active matches with animated status indicators.

### ⚡ 2. Telemetry & Live Pressure Index
- **Refined Color Collision Engine**: 4-step dynamic color resolution (*Away Secondary → Home Secondary → Both Secondary → Pitch Fallback*) ensuring true club identity during jersey clashes.
- **Match Dominance Visualizer**: 8px segmented track tracking minute-by-minute home vs. away dominance.

### 🎯 3. Transfer Radar & Intel Hub
- **Tiered Rumor Tracking**: Classified transfer reliability pills (*Tier 1 Official / Tier 2 Credible / Tier 3 Speculation*).
- **Interactive Fee Slider**: Dual-range financial filter with timeframe selectors (*Current Window, Summer 2026*).

### 🏆 4. Standings & Form Analytics
- **Live Table Computation**: Points, goal difference, games played, and 5-match recent form guide (`W/D/L` pills).
- **Direct Navigation**: Seamless routing to team profile and match detail pages.

### 🔐 5. Full-Bleed Authentication & OTP Flow
- **Full-Viewport Animated Background**: Cursor-reactive pitch-green floodlight spotlight, ambient particle drift, and breathing grid overlay.
- **6-Digit OTP Verification**: Auto-advancing inputs, backspace navigation, paste support, scannability grouping (3+3), and error shake animation (`@keyframes otpShake`).
- **Glassmorphism Card Shell**: `backdrop-filter: blur(18px)` surface with dynamic header resolution and Google OAuth integration.

---

## 🎨 Design Architecture: The "Night-Pitch" System

LiveKick enforces a strict visual design tokens system stored in `tokens.css`:

- **Base Canvas**: `#080c11` (Deep Stadium Slate)
- **Elevated Surfaces**: `#111820` / `#0d1520`
- **Primary Accent**: `#00B370` (Signature Pitch Green)
- **Currency Accent**: `#f59e0b` (Matchday Coins Gold)
- **Typography**: 
  - `'Big Shoulders Display'` (Upper-case match scores, titles, crest monograms)
  - `'Inter'` (Clean UI body copy and field labels)
  - `'JetBrains Mono'` (Timers, live minutes, odds, retro scoreboard digits)

---

## 📁 Folder Structure

```
LiveKick/
├── docs/                                  # Architectural Specs, Context & PRDs
│   ├── LIVEKICK_APP_CONTEXT.md
│   └── TRANSFER_RADAR_CONTEXT.md
├── frontend/                              # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── assets/                        # Brand logos, crests & media assets
│   │   ├── components/
│   │   │   ├── auth/                      # AuthBackground, AuthHero, AuthCard, OtpInput, GoogleButton
│   │   │   ├── feed/                      # DateSelector, LeagueGroup, MatchRow, PressureBar
│   │   │   ├── layout/                    # AppLayout, Sidebar, TopNav
│   │   │   ├── news/                      # NewsList, NewsCategoryBadge
│   │   │   ├── panels/                    # MatchOfTheDayCard, PredictorCard
│   │   │   ├── search/                    # SearchModal
│   │   │   ├── shared/                    # Logo, Crest, Breadcrumb
│   │   │   ├── standings/                 # StandingsTable, FormPill
│   │   │   └── transfers/                 # TransferCard, TierPill, FeeRangeSlider, TransferFilters
│   │   ├── data/                          # Mock match, team, league & news datasets
│   │   ├── hooks/                         # useLenisScroll (element-scoped smooth scroll)
│   │   ├── pages/                         # HomeFeed, News, Standings, Transfers, Login, Settings
│   │   ├── routes/                        # AppRouter (React Router v6)
│   │   └── styles/                        # tokens.css & global stylesheets
│   ├── package.json
│   └── vite.config.js
├── backend/                               # Express.js Caching Gateway & API
│   ├── server.js                          # Express Server Entrypoint
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, React Router v6, Lucide React
- **Smooth Scroll**: Lenis (`lenis@1.3.26`) with explicit `contentRef` ResizeObserver tracking
- **Styling**: Vanilla CSS, Custom CSS Variables, Glassmorphism, CSS Keyframe Motion
- **Backend & Caching**: Node.js, Express.js, MongoDB (Mongoose), `node-cron`

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start local development server
npm run dev
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start Express server
npm run dev
```

---

## 📌 Roadmap & Production Milestones

- [x] **Milestone 1: Home Feed & Match Center**
- [x] **Milestone 2: News & Editorial Hub**
- [x] **Milestone 3: League Standings & Form Analytics**
- [x] **Milestone 4: Transfer Radar & Fee Intelligence**
- [x] **Milestone 5: Full-Bleed Auth Page & OTP Verification**
- [ ] **Milestone 6: Guest State & Auth Context Wiring** *(In Progress)*
- [ ] **Milestone 7: Express API Caching Pipeline & Cron Scheduler**
- [ ] **Milestone 8: Socket.io Live Score Telemetry & Atomic Wallet Settlement**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
