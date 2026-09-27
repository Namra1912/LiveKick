// src/components/match/MatchStandingsSnippet.jsx
import { useNavigate } from 'react-router-dom';
import { standings, leagues } from '../../data/mockData';
import './MatchStandingsSnippet.css';

function ordinal(n) {
  if (n == null) return '—';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function MatchStandingsSnippet({ match }) {
  const navigate = useNavigate();
  const table = standings[match.league];
  if (!table) return null;

  const homeRow = table.find((r) => r.team.id === match.homeTeam.id);
  const awayRow = table.find((r) => r.team.id === match.awayTeam.id);
  if (!homeRow && !awayRow) return null;

  const leagueSlug = leagues.find((l) => l.name === match.league)?.slug;

  return (
    <div className="match-standings-snippet">
      <div className="match-detail__card-title-row">
        <h2 className="match-detail__card-title">{match.league} Table</h2>
        <button type="button" className="match-standings-snippet__link" onClick={() => navigate(`/standings?league=${leagueSlug}`)}>
          Full Table
        </button>
      </div>
      <div className="match-standings-snippet__rows">
        {[homeRow, awayRow].filter(Boolean).map((row) => (
          <div className="match-standings-snippet__row" key={row.team.id}>
            <span className="match-standings-snippet__pos">{ordinal(row.position)}</span>
            <span className="match-standings-snippet__team">{row.team.name}</span>
            <span className="match-standings-snippet__stat">{row.played}</span>
            <div className="match-standings-snippet__form">
              {row.form.slice(-5).map((r, i) => (
                <span key={i} className={`match-standings-snippet__form-dot match-standings-snippet__form-dot--${r.toLowerCase()}`}>
                  {r}
                </span>
              ))}
            </div>
            <span className="match-standings-snippet__pts">{row.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
