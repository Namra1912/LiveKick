---
name: stitch-visual-recreation
description: Recreation doctrine for converting Stitch UI visual designs located in the `Designs/` directory into production-ready React components matching the "Night-Pitch" design system. Use when translating Stitch PNG mockups into high-fidelity UI code.
---

# Stitch Visual Design Recreation Blueprint

## Overview
This skill provides the exact mapping from the 17 high-fidelity Stitch visual design PNGs inside `c:/Users/namra/OneDrive/Desktop/LiveKick/Designs` into modern, pixel-faithful React components.

## Catalog of Stitch Visual Mockups (`Designs/`)

| Design Mockup File | Targeted React View / Component | Key Visual Characteristics |
| :--- | :--- | :--- |
| `LiveKick — Home Feed.png` | `src/features/home/HomeFeed.jsx` | Top floodlight header, live match carousel with retro score digits, trending football news grid, quick standings snippet. |
| `LiveKick — Mobile Home Feed.png` | `src/features/home/MobileHomeFeed.jsx` | Mobile navigation drawer, compact single-column score cards, quick action pills. |
| `LiveKick — Match Detail.png` | `src/features/matches/MatchDetail.jsx` | Hero match banner, score timeline, live commentary ticker, tabbed navigation (Overview, Lineups, Stats). |
| `LiveKick — Match Detail Lineups.png` | `src/features/matches/MatchLineups.jsx` | Interactive pitch diagram with 4-3-3 / 4-2-3-1 player positioning nodes, player rating badges, substitution list. |
| `LiveKick — Match Stats (2-Column Layout).png` | `src/features/matches/MatchStats.jsx` | 2-column comparative bar charts for possession, xG, shots on target, passes, foul counts. |
| `LiveKick — Tactical Lineup Lab.png` | `src/features/tactics/TacticsLab.jsx` | Interactive football pitch builder, drag/swap player slots, formation selector dropdown, squad depth analysis. |
| `LiveKick — Fan Prediction League .png` | `src/features/predictions/PredictionLeague.jsx` | Interactive prediction cards, odds multipliers, tactile pill buttons, wallet balance pill, prediction leaderboard. |
| `LiveKick — Transfer Radar.png` | `src/features/transfers/TransferRadar.jsx` | Transfer probability radar, high-value transfer cards, club logo badges, rumor credibility meters. |
| `LiveKick — Arsenal FC Team Profile.png` | `src/features/teams/TeamProfile.jsx` | Club header banner, squad roster table, upcoming fixtures, trophies highlight, form guide. |
| `LiveKick — Bukayo Saka Player Profile.png` | `src/features/players/PlayerProfile.jsx` | Player hero card with portrait, radar stat graph (Pace, Shooting, Passing, Dribbling, Defending, Physicality), season heatmaps. |
| `LiveKick — League Standings.png` | `src/features/standings/LeagueStandings.jsx` | Premier League / La Liga table, Champions League / Europa League zone color bars, goal difference metrics. |
| `LiveKick — Football News & Editorial.png` | `src/features/news/NewsEditorial.jsx` | Hero news article, editorial grid, tag filters (Transfers, Match Reports, Analysis), reading time badges. |
| `LiveKick — Login & Signup.png` | `src/features/auth/AuthModal.jsx` | Dual-tab login/register modal, dark pitch aesthetic, input validation feedback, social auth buttons. |
| `LiveKick — Player Onboarding.png` | `src/features/onboarding/OnboardingFlow.jsx` | Step-by-step favorite club selection, league preferences, notification toggles. |
| `LiveKick — Search Modal & Results.png` | `src/features/search/SearchModal.jsx` | Global command palette search (`Cmd+K`), instant search results across clubs, players, matches. |
| `LiveKick — User Profile & Settings.png` | `src/features/profile/UserProfile.jsx` | Account settings, prediction history, streak badges, dark mode options. |
| `livekick_brand_logo.png` | `src/components/common/BrandLogo.jsx` | Custom vector LiveKick logo, floodlight amber icon, bone-white brand typography. |

## Implementation Rules
1. **Never approximation or generic colors**: Every card, background, text, border must strictly follow the Night-Pitch tokens (`#050a08`, `#0d1815`, `#131f1a`, `#182720`, `#233129`, `#f4f1ea`, `#8fa398`, `#f5b942`, `#4fae7a`).
2. **Double-Bezel Card Depth**: All cards must use outer rim `border border-[#233129] rounded-[14px] bg-[#131f1a]`.
3. **Retro Scoreboard Digits**: Use `#000` background digit cells with glowing amber `#f5b942` digits and inner shadow `inset 0 0 6px rgba(245,185,66,0.25)`.
4. **Fluid Transitions**: Screen/tab transitions must use smooth keyframe fades or Framer Motion transitions.
