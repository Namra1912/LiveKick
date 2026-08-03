// src/components/layout/TopNav.jsx
// Top nav: brand badge logo + search bar + coin pill + bell + avatar

import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import CoinIcon from '../icons/CoinIcon';
import bootIcon from '../../assets/livekick_boot_icon.png';
import './TopNav.css';

// Brand logo using livekick_boot_icon.png with green LiveKick wordmark
function LiveKickLogo() {
  return (
    <div className="topnav__logo">
      <img src={bootIcon} alt="LiveKick Logo" className="topnav__logo-img" />
      <span className="topnav__wordmark">LiveKick</span>
    </div>
  );
}

export default function TopNav({ user, onSearchOpen }) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="topnav">
      {/* Logo — fixed width to align with sidebar */}
      <div className="topnav__logo-block">
        <LiveKickLogo />
      </div>

      {/* Search bar — centered, expands */}
      <div className="topnav__search-wrap">
        <button
          id="global-search-btn"
          onClick={onSearchOpen}
          className="topnav__search-btn"
          aria-label="Open search (⌘K)"
        >
          <Search size={14} strokeWidth={2} color="var(--color-dimmer)" />
          <span className="topnav__search-placeholder">
            Search teams, leagues, players...
          </span>
          <span className="topnav__search-badge">⌘K</span>
        </button>
      </div>

      {/* Right side: Coins, Bell, Avatar */}
      <div className="topnav__actions">
        {/* Coin balance pill */}
        <div className="topnav__coin-pill">
          <CoinIcon size={16} />
          <span className="topnav__coin-amount">
            {(user?.matchdayCoins ?? 0).toLocaleString()}
          </span>
        </div>

        {/* Bell */}
        <button
          id="notification-bell"
          className="topnav__icon-btn"
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={1.75} color="var(--color-secondary)" />
          <span className="topnav__notif-dot" />
        </button>

        {/* Avatar */}
        <button
          id="user-avatar-btn"
          className="topnav__avatar-btn"
          aria-label="User profile"
        >
          {avatarError ? (
            <div className="topnav__avatar-fallback">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          ) : (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}&background=00B370&color=071a11&size=72&bold=true&format=svg`}
              alt={user?.name ?? 'User'}
              className="topnav__avatar-img"
              onError={() => setAvatarError(true)}
            />
          )}
        </button>
      </div>
    </header>
  );
}
