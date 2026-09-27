// src/components/match/MatchNextFixture.jsx
// The home team's next upcoming league fixture — same partial-coverage
// contract as the rest of the page: renders nothing if there isn't one.
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { formatKickoffTime } from '../../utils/matchHelpers';
import { matches, leagues } from '../../data/mockData';
import './MatchNextFixture.css';

export default function MatchNextFixture({ team }) {
  const navigate = useNavigate();
  const next = matches
    .filter((m) => m.status === 'upcoming' && (m.homeTeam.id === team.id || m.awayTeam.id === team.id))
    .sort((a, b) => new Date(a.matchDateUtc) - new Date(b.matchDateUtc))[0];

  if (!next) return null;
  const leagueObj = leagues.find((l) => l.name === next.league);

  return (
    <div className="match-next-fixture">
      <h2 className="match-detail__card-title match-next-fixture__title">Next Match</h2>
      <button type="button" className="match-next-fixture__row" onClick={() => navigate(`/matches/${next.id}`)}>
        <div className="match-next-fixture__team">
          <Crest logoUrl={next.homeTeam.logoUrl} name={next.homeTeam.name} size={32} />
          <span>{next.homeTeam.shortName}</span>
        </div>

        <div className="match-next-fixture__center">
          {leagueObj?.logoUrl && <Crest logoUrl={leagueObj.logoUrl} name={next.league} size={14} />}
          <span className="match-next-fixture__time">{formatKickoffTime(next.matchDateUtc)}</span>
          <span className="match-next-fixture__date">
            {new Date(next.matchDateUtc).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="match-next-fixture__team match-next-fixture__team--away">
          <span>{next.awayTeam.shortName}</span>
          <Crest logoUrl={next.awayTeam.logoUrl} name={next.awayTeam.name} size={32} />
        </div>
      </button>
    </div>
  );
}
