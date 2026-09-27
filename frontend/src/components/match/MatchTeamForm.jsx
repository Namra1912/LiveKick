// src/components/match/MatchTeamForm.jsx
// Last 5 finished results for each side, home team's column on the left and
// away team's on the right — reused from the same `matches` array as the
// rest of the app rather than a separate form dataset.
import { useNavigate } from 'react-router-dom';
import { matches } from '../../data/mockData';
import './MatchTeamForm.css';

function recentResults(teamId, excludeMatchId) {
  return matches
    .filter((m) => m.status === 'finished' && m.id !== excludeMatchId && (m.homeTeam.id === teamId || m.awayTeam.id === teamId))
    .sort((a, b) => new Date(b.matchDateUtc) - new Date(a.matchDateUtc))
    .slice(0, 5)
    .map((m) => {
      const isHomeSide = m.homeTeam.id === teamId;
      const opponent = isHomeSide ? m.awayTeam : m.homeTeam;
      const scoreFor = isHomeSide ? m.homeScore : m.awayScore;
      const scoreAgainst = isHomeSide ? m.awayScore : m.homeScore;
      const result = scoreFor > scoreAgainst ? 'w' : scoreFor < scoreAgainst ? 'l' : 'd';
      return { id: m.id, opponent, scoreFor, scoreAgainst, result };
    });
}

function FormRow({ row, align }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={`match-team-form__row match-team-form__row--${align}`}
      onClick={() => navigate(`/matches/${row.id}`)}
    >
      {align === 'home' && <span className={`match-team-form__badge match-team-form__badge--${row.result}`}>{row.scoreFor} - {row.scoreAgainst}</span>}
      <span className="match-team-form__opponent">{row.opponent.name}</span>
      {align === 'away' && <span className={`match-team-form__badge match-team-form__badge--${row.result}`}>{row.scoreFor} - {row.scoreAgainst}</span>}
    </button>
  );
}

export default function MatchTeamForm({ homeTeam, awayTeam, matchId }) {
  const homeRows = recentResults(homeTeam.id, matchId);
  const awayRows = recentResults(awayTeam.id, matchId);
  if (homeRows.length === 0 && awayRows.length === 0) return null;

  return (
    <div className="match-team-form">
      <h2 className="match-detail__card-title match-team-form__title">Team Form</h2>
      <div className="match-team-form__grid">
        <div className="match-team-form__col">
          {homeRows.length > 0 ? (
            homeRows.map((row) => <FormRow key={row.id} row={row} align="home" />)
          ) : (
            <p className="match-team-form__empty">No recent results</p>
          )}
        </div>
        <div className="match-team-form__col match-team-form__col--away">
          {awayRows.length > 0 ? (
            awayRows.map((row) => <FormRow key={row.id} row={row} align="away" />)
          ) : (
            <p className="match-team-form__empty">No recent results</p>
          )}
        </div>
      </div>
    </div>
  );
}
