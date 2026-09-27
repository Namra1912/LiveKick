// src/components/match/MatchTeamForm.jsx
// Last 5 finished results for each side. Each row is a self-contained mini
// scoreline — both teams named (with crests) in the match's real home/away
// order, score badge between them — so it reads on its own without needing
// a column header, matching the reference's "Team A score Team B" rows.
import { useNavigate } from 'react-router-dom';
import Crest from '../shared/Crest';
import { matches } from '../../data/mockData';
import './MatchTeamForm.css';

function recentResults(teamId, excludeMatchId) {
  return matches
    .filter((m) => m.status === 'finished' && m.id !== excludeMatchId && (m.homeTeam.id === teamId || m.awayTeam.id === teamId))
    .sort((a, b) => new Date(b.matchDateUtc) - new Date(a.matchDateUtc))
    .slice(0, 5)
    .map((m) => {
      const isHomeSide = m.homeTeam.id === teamId;
      const scoreFor = isHomeSide ? m.homeScore : m.awayScore;
      const scoreAgainst = isHomeSide ? m.awayScore : m.homeScore;
      const result = scoreFor > scoreAgainst ? 'w' : scoreFor < scoreAgainst ? 'l' : 'd';
      return { id: m.id, homeTeam: m.homeTeam, awayTeam: m.awayTeam, homeScore: m.homeScore, awayScore: m.awayScore, result };
    });
}

function TeamChip({ team, side }) {
  return (
    <span className={`match-team-form__team match-team-form__team--${side}`}>
      <Crest logoUrl={team.logoUrl} name={team.name} size={18} />
      <span>{team.name}</span>
    </span>
  );
}

function FormRow({ row }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="match-team-form__row" onClick={() => navigate(`/matches/${row.id}`)}>
      <TeamChip team={row.homeTeam} side="left" />
      <span className={`match-team-form__badge match-team-form__badge--${row.result}`}>
        {row.homeScore} - {row.awayScore}
      </span>
      <TeamChip team={row.awayTeam} side="right" />
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
            homeRows.map((row) => <FormRow key={row.id} row={row} />)
          ) : (
            <p className="match-team-form__empty">No recent results</p>
          )}
        </div>
        <div className="match-team-form__col match-team-form__col--away">
          {awayRows.length > 0 ? (
            awayRows.map((row) => <FormRow key={row.id} row={row} />)
          ) : (
            <p className="match-team-form__empty">No recent results</p>
          )}
        </div>
      </div>
    </div>
  );
}
