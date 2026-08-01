import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeFeed from '../pages/HomeFeed';
import MatchDetail from '../pages/MatchDetail';
import Standings from '../pages/Standings';
import Transfers from '../pages/Transfers';
import PredictionsLeague from '../pages/PredictionsLeague';
import TacticsLab from '../pages/TacticsLab';
import Login from '../pages/Login';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/predictions" element={<PredictionsLeague />} />
        <Route path="/tactics" element={<TacticsLab />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
