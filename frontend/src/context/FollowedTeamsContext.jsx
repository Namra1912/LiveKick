// src/context/FollowedTeamsContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LS_FAV_TEAMS = 'lk_fav_teams';
const DEFAULT_FAV_TEAMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function readFavTeams() {
  try {
    const val = localStorage.getItem(LS_FAV_TEAMS);
    return val ? JSON.parse(val) : DEFAULT_FAV_TEAMS;
  } catch {
    return DEFAULT_FAV_TEAMS;
  }
}

const FollowedTeamsContext = createContext(null);

export function FollowedTeamsProvider({ children }) {
  const [favTeamIds, setFavTeamIds] = useState(readFavTeams);

  useEffect(() => {
    try {
      localStorage.setItem(LS_FAV_TEAMS, JSON.stringify(favTeamIds));
    } catch {
      // Storage unavailable or quota exceeded fallback
    }
  }, [favTeamIds]);

  const isFollowing = useCallback(
    (teamId) => favTeamIds.includes(Number(teamId)),
    [favTeamIds]
  );

  const toggleFollow = useCallback((teamId) => {
    const id = Number(teamId);
    setFavTeamIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }, []);

  const followTeam = useCallback((teamId) => {
    const id = Number(teamId);
    setFavTeamIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unfollowTeam = useCallback((teamId) => {
    const id = Number(teamId);
    setFavTeamIds((prev) => prev.filter((t) => t !== id));
  }, []);

  return (
    <FollowedTeamsContext.Provider
      value={{
        favTeamIds,
        isFollowing,
        toggleFollow,
        followTeam,
        unfollowTeam,
      }}
    >
      {children}
    </FollowedTeamsContext.Provider>
  );
}

export function useFollowedTeams() {
  const context = useContext(FollowedTeamsContext);
  if (!context) {
    throw new Error('useFollowedTeams must be used within a FollowedTeamsProvider');
  }
  return context;
}
