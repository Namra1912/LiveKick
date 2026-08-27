// src/routes/AppRouter.jsx
// Central router config. All page routes listed here.
// Stub pages for routes that don't have full implementations yet.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FollowedTeamsProvider } from '../context/FollowedTeamsContext';
import HomeFeed from '../pages/HomeFeed';
import MatchDetail from '../pages/MatchDetail';
import Standings from '../pages/Standings';
import Transfers from '../pages/Transfers';
import PredictionsLeague from '../pages/PredictionsLeague';
import TacticsLab from '../pages/TacticsLab';
import Login from '../pages/Login';
import News from '../pages/News';
import TeamDetail from '../pages/TeamDetail';
import PlayerDetail from '../pages/PlayerDetail';
import Settings from '../pages/Settings';

export default function AppRouter() {
  return (
    <FollowedTeamsProvider>
      <BrowserRouter>
        <Routes>
          {/* Core routes */}
          <Route path="/"              element={<HomeFeed />} />
          <Route path="/news"          element={<News />} />
          <Route path="/standings"     element={<Standings />} />
          <Route path="/transfers"     element={<Transfers />} />
          <Route path="/predictions"   element={<PredictionsLeague />} />
          <Route path="/tactics"       element={<TacticsLab />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/settings"      element={<Settings />} />

          {/* Detail routes — navigated to from match rows, team crests, and player names */}
          <Route path="/matches/:id"   element={<MatchDetail />} />
          <Route path="/teams/:id"     element={<TeamDetail />} />
          <Route path="/players/:id"   element={<PlayerDetail />} />
        </Routes>
      </BrowserRouter>
    </FollowedTeamsProvider>
  );
}
