// src/components/layout/AppLayout.jsx
// Three-column layout shell:
// TopNav (56px) + [Sidebar 240px | main feed | right panel 320px]

import './AppLayout.css';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import { currentUser, teams } from '../../data/mockData';

export default function AppLayout({
  children,
  onSearchOpen,
  isLiveOnly = false,
  onToggleLiveOnly,
  hasAnyLiveMatches = false,
}) {
  return (
    <div className="app-layout">
      {/* Sticky top nav */}
      <TopNav user={currentUser} onSearchOpen={onSearchOpen ?? (() => {})} />

      {/* Body row */}
      <div className="app-layout__body">
        {/* Sidebar */}
        <Sidebar
          favoriteTeams={currentUser.favoriteTeamIds}
          allTeams={teams}
          isLiveOnly={isLiveOnly}
          onToggleLiveOnly={onToggleLiveOnly}
          hasAnyLiveMatches={hasAnyLiveMatches}
        />

        {/* Center + right panel */}
        <div className="app-layout__content">
          {children}
        </div>
      </div>
    </div>
  );
}
