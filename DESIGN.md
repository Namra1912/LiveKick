# LiveKick — Semantic Design System (`DESIGN.md`)

## Visual Atmosphere & Vibe
- **Theme**: "Night-Pitch Stadium Floodlight" — Dark, atmospheric, high-performance football dashboard.
- **Density**: 7/10 (High data density with clean breathing room between double-bezel cards).
- **Variance**: 8/10 (Asymmetric cards, stat grids, transfer radars, and interactive tactics pitch).
- **Motion**: 7/10 (Smooth spring physics, tactile active scaling `scale-[0.98]`, retro scoreboard cell glow, and tab transitions).

## Color Calibration (Night-Pitch System)
- **Base Background (`bg-base`)**: `#050a08` (OLED pitch shadow)
- **Main Wrapper (`bg-pitch`)**: `#0d1815` (Deep stadium pitch)
- **Surface Cards (`bg-card`)**: `#131f1a` (Standard surface container)
- **Raised Hover Cards (`bg-raised`)**: `#182720` (Active/hovered state)
- **Borders & Hairlines (`border-subtle`)**: `#233129` (Fine 1px grids)
- **Primary Text (`text-primary`)**: `#f4f1ea` (Bone white for high contrast readability)
- **Muted Text (`text-muted`)**: `#8fa398` (Pitch mist)
- **Faint Text (`text-faint`)**: `#5c6d64` (Structural dark gray)
- **Accent Primary (`accent-floodlight`)**: `#f5b942` (Signature amber gold floodlight)
- **Accent Turf (`accent-turf`)**: `#4fae7a` (Grass green)
- **Accent Red (`accent-loss`)**: `#c1554d` (Warning red)
- **Banned Colors**: Pure `#000` (except inside scoreboard digits), pure white text, AI-purple/neon blue gradients, default slate/gray colors.

## Typography Architecture
- **Display & Headings**: `'Big Shoulders Display', sans-serif`, uppercase, tight tracking (`tracking-tight` or `tracking-[-0.02em]`).
- **Body & Descriptions**: `'Inter', sans-serif`, standard tracking, line height `1.5`.
- **Timers, Scores & Numbers**: `'JetBrains Mono', monospace` for all live minutes, timestamps, odds, position numbers, and database metrics.

## Component Styling Specs
1. **Retro Scoreboard Digit**:
   - Distinct digit cells: `bg-[#000]`, text `#f5b942`, rounded `4px`, inner shadow `inset 0 0 6px rgba(245,185,66,0.25)`, border `1px solid #2a2210`. Completed match dims digit (`opacity-50`).
2. **Double-Bezel Cards**:
   - Outer rim: `border border-[#233129] rounded-[14px] bg-[#131f1a]`.
   - Favorite indicator: `border-l-[3px] border-l-[#4fae7a]`.
3. **Segmented Pills & Tactile Buttons**:
   - Background `#131f1a`, border `#233129`, radius `10px`. Active state `#182720` with text `#f4f1ea`. Click feedback `active:scale-[0.98]`.

## LiveKick Visual Screen Catalog (`Designs/`)
This design system governs the 17 visual screens in `Designs/`:
- **Home Feed** (`LiveKick — Home Feed.png`, `LiveKick — Mobile Home Feed.png`)
- **Match Detail & Lineups** (`LiveKick — Match Detail.png`, `LiveKick — Match Detail Lineups.png`, `LiveKick — Match Stats (2-Column Layout).png`)
- **Tactical Lineup Lab** (`LiveKick — Tactical Lineup Lab.png`)
- **Prediction League** (`LiveKick — Fan Prediction League .png`)
- **Transfer Radar** (`LiveKick — Transfer Radar.png`)
- **Team & Player Profiles** (`LiveKick — Arsenal FC Team Profile.png`, `LiveKick — Bukayo Saka Player Profile.png`)
- **Standings & News** (`LiveKick — League Standings.png`, `LiveKick — Football News & Editorial.png`)
- **Auth & Search** (`LiveKick — Login & Signup.png`, `LiveKick — Search Modal & Results.png`, `LiveKick — Player Onboarding.png`, `LiveKick — User Profile & Settings.png`)
