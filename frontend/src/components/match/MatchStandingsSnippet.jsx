// src/components/match/MatchStandingsSnippet.jsx
import { useNavigate } from 'react-router-dom';
import { standings, leagues } from '../../data/mockData';
import './MatchStandingsSnippet.css';

export default function MatchStandingsSnippet({ match }) {
  const navigate = useNavigate();
  const table = standings[match.league];
  if (!table) return null;

  const leagueSlug = leagues.find((l) => l.name === match.league)?.slug;
  const matchTeamIds = new Set([match.homeTeam.id, match.awayTeam.id]);

  return (
    <div className="match-standings-snippet">
      <div className="match-detail__card-title-row">
        <h2 className="match-detail__card-title">{match.league} Table</h2>
        <button type="button" className="match-standings-snippet__link" onClick={() => navigate(`/standings?league=${leagueSlug}`)}>
          Full Table
        </button>
      </div>
      <div className="match-standings-snippet__scroll">
        <table className="match-standings-snippet__table">
          <thead>
            <tr>
              <th className="match-standings-snippet__th">#</th>
              <th className="match-standings-snippet__th match-standings-snippet__th--team">Club</th>
              <th className="match-standings-snippet__th">P</th>
              <th className="match-standings-snippet__th">Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => {
              const isMatchTeam = matchTeamIds.has(row.team.id);
              return (
                <tr
                  key={row.team.id}
                  className={`match-standings-snippet__row ${isMatchTeam ? 'match-standings-snippet__row--highlight' : ''}`}
                  onClick={() => navigate(`/teams/${row.team.id}`)}
                >
                  <td className="match-standings-snippet__td">{row.position}</td>
                  <td className="match-standings-snippet__td match-standings-snippet__td--team">{row.team.name}</td>
                  <td className="match-standings-snippet__td">{row.played}</td>
                  <td className="match-standings-snippet__td match-standings-snippet__td--pts">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
