# LiveKick ⚽⚡

LiveKick is a premium, real-time football companion web app for dedicated supporters — delivering FotMob-speed score updates, elevated editorial typography, live match telemetry with signature Pressure Index visualization, and a gamified Fan Prediction League driven by Matchday Coins (strictly 0% money/betting).

> **Developer Note:** The `frontend/` and `backend/` packages are developed independently for now, with full backend integration starting in Phase 1.

## Project Structure

```
LiveKick/
├── docs/                                  # Specifications & Visual Assets
│   ├── LiveKick_PRD_FINAL_v5_1.md          # Master Product Requirements Document (v5.1)
│   ├── LiveKick_DESIGN_FINAL_v5_1.md       # Master Design System Specification (v5.1)
│   └── Designs/                           # 17 High-Fidelity UI Design Mockups (PNG)
├── frontend/                              # Vite + React Frontend Application
│   ├── src/
│   │   ├── components/                    # UI Component Libraries (layout, match, predictions, etc.)
│   │   ├── pages/                         # Route Page Components
│   │   ├── routes/                        # AppRouter (React Router v6)
│   │   ├── data/                          # mockData.js
│   │   └── styles/                        # Tailwind CSS & Night-Pitch Design Tokens
│   └── package.json
├── backend/                               # Node.js + Express API Backend Shell
│   ├── src/                               # API Layers (routes, controllers, models, etc.)
│   ├── server.js                          # Minimal Express Server Entrypoint
│   └── package.json
├── DESIGN.md                              # Semantic Design System Reference
└── README.md                              # Root Workspace Overview
```

## Getting Started

### Frontend Development Shell
```bash
cd frontend
npm run dev
```

### Backend API Shell
```bash
cd backend
npm run dev
```
