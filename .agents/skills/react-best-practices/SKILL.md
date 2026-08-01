---
name: react-best-practices
description: Best practices for React component architecture, custom hooks, state management, performance optimization, and modular UI structure when building modern web apps. Use when creating, refactoring, or organizing React frontend components.
---

# React Best Practices & Architecture

## 1. Component Architecture & File Structure
- **Single Responsibility Principle**: Each component should do ONE thing well. Split large views into smaller feature components.
- **Directory Structure**:
  ```
  src/
  ├── components/          # Reusable UI components (Buttons, Modals, Cards, RetroScoreboard)
  │   ├── ui/              # Low-level primitive components
  │   └── scoreboard/      # Scoreboard-specific components
  ├── features/            # Feature-based components (Home, Matches, Transfers, Predictions, TacticsLab)
  │   ├── matches/
  │   ├── transfers/
  │   └── predictions/
  ├── context/             # React context providers (AuthContext, ThemeContext, LiveFeedContext)
  ├── hooks/               # Custom reusable hooks (useLiveScores, usePredictions, useDebounce)
  ├── services/            # API client services (axios instance, api routes)
  ├── utils/               # Formatting, calculations, constants
  └── types/               # TypeScript interfaces or prop validation
  ```

## 2. Hooks Doctrine
- **`useState` vs `useReducer`**: Use `useState` for simple local toggles; use `useReducer` for complex form states or multi-field updates.
- **`useContext`**: Wrap global states (user auth, wallet balance, active match subscriptions) in context providers, exposed through custom hooks (e.g., `useAuth()`, `useWallet()`).
- **`useRef`**: Use for DOM measurements, timer references, or mutable values that don't trigger re-renders.
- **Custom Hooks**: Extract data fetching, subscription loops, or repetitive state logic into custom hooks (`useMatchDetail(id)`, `useTransferRadar()`).

## 3. UI Performance Optimization
- **Memoization**: Wrap expensive list item computations or subcomponents in `React.memo`, `useMemo`, or `useCallback` when passing callbacks to child components.
- **Virtualized Lists**: For large lists of matches or news articles, render efficiently without lagging the browser.
- **Image Optimization**: Use progressive loading, aspect ratio containers, and explicit width/height to prevent layout shifts (CLS).

## 4. State Synchronization & Mock Data Strategy
- Maintain clean, structured mock data files during frontend development.
- Keep state mutations pure and predictable.
- Handle loading, error, and empty states cleanly for every data-fetching view.
