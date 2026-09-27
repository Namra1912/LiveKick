// src/components/match/MatchNextFixture.jsx
// Both sides' next upcoming league fixture, side by side — home team's on
// the left half, away team's on the right half, split by a divider. Renders
// only the half(es) that have an upcoming fixture in the data.
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { formatKickoffTime } from '../../utils/matchHelpers';
import { matches, leagues } from '../../data/mockData';
import './MatchNextFixture.css';

function nextFixtureFor(teamId) {
  return matches
    .filter((m) => m.status === 'upcoming' && (m.homeTeam.id === teamId || m.awayTeam.id === teamId))
    .sort((a, b) => new Date(a.matchDateUtc) - new Date(b.matchDateUtc))[0];
}

function FixtureHalf({ fixture }) {
  const navigate = useNavigate();
  if (!fixture) return <p className="match-next-fixture__empty">No upcoming fixture scheduled.</p>;
  const leagueObj = leagues.find((l) => l.name === fixture.league);

  return (
    <button type="button" className="match-next-fixture__half" onClick={() => navigate(`/matches/${fixture.id}`)}>
      <div className="match-next-fixture__meta">
        {leagueObj?.logoUrl && <Crest logoUrl={leagueObj.logoUrl} name={fixture.league} size={13} />}
        <span>
          {new Date(fixture.matchDateUtc).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>
      <div className="match-next-fixture__row">
        <div className="match-next-fixture__team">
          <Crest logoUrl={fixture.homeTeam.logoUrl} name={fixture.homeTeam.name} size={28} />
          <span>{fixture.homeTeam.shortName}</span>
        </div>
        <span className="match-next-fixture__time">{formatKickoffTime(fixture.matchDateUtc)}</span>
        <div className="match-next-fixture__team match-next-fixture__team--away">
          <span>{fixture.awayTeam.shortName}</span>
          <Crest logoUrl={fixture.awayTeam.logoUrl} name={fixture.awayTeam.name} size={28} />
        </div>
      </div>
    </button>
  );
}

export default function MatchNextFixture({ homeTeam, awayTeam }) {
  const homeNext = nextFixtureFor(homeTeam.id);
  const awayNext = nextFixtureFor(awayTeam.id);
  if (!homeNext && !awayNext) return null;

  return (
    <div className="match-next-fixture">
      <h2 className="match-detail__card-title match-next-fixture__title">Next Match</h2>
      <div className="match-next-fixture__split">
        <div className="match-next-fixture__side">
          <span className="match-next-fixture__side-label">{homeTeam.shortName}</span>
          <FixtureHalf fixture={homeNext} />
        </div>
        <div className="match-next-fixture__side match-next-fixture__side--away">
          <span className="match-next-fixture__side-label">{awayTeam.shortName}</span>
          <FixtureHalf fixture={awayNext} />
        </div>
      </div>
    </div>
  );
}
