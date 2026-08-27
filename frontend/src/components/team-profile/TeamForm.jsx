// src/components/team-profile/TeamForm.jsx
import { useMemo } from 'react';
import Crest from '../shared/Crest';
import { matches } from '../../data/mockData';
import './TeamForm.css';

export default function TeamForm({ team }) {
  // Find past 5 finished matches for this team
  const pastMatches = useMemo(() => {
    if (!team) return [];
    return matches
      .filter(
        (m) =>
          (m.homeTeam?.id === team.id || m.awayTeam?.id === team.id) &&
          m.status === 'finished'
      )
      .slice(-5);
  }, [team]);

  // Find next upcoming match for this team
  const nextMatch = useMemo(() => {
    if (!team) return null;
    return matches.find(
      (m) =>
        (m.homeTeam?.id === team.id || m.awayTeam?.id === team.id) &&
        (m.status === 'upcoming' || m.status === 'live')
    );
  }, [team]);

  return (
    <div className="team-form-row">
      {/* Team Form Card (55% width) */}
      <div className="team-form-card">
        <div className="team-form-card__header">
          <span className="team-form-card__title">RECENT FORM</span>
          <span className="team-form-card__subtitle">Last 5 Matches</span>
        </div>

        <div className="team-form-card__chips">
          {pastMatches.length === 0 ? (
            <div className="team-form-card__empty">No recent matches recorded</div>
          ) : (
            pastMatches.map((m) => {
              const isHome = m.homeTeam?.id === team.id;
              const opponent = isHome ? m.awayTeam : m.homeTeam;
              const teamScore = isHome ? m.homeScore : m.awayScore;
              const oppScore = isHome ? m.awayScore : m.homeScore;

              let outcome = 'D';
              let outcomeClass = 'team-form-chip--draw';
              if (teamScore > oppScore) {
                outcome = 'W';
                outcomeClass = 'team-form-chip--win';
              } else if (teamScore < oppScore) {
                outcome = 'L';
                outcomeClass = 'team-form-chip--loss';
              }

              return (
                <div key={m.id} className={`team-form-chip ${outcomeClass}`}>
                  <span className="team-form-chip__score">
                    {m.homeScore}-{m.awayScore}
                  </span>
                  <div className="team-form-chip__opponent">
                    <Crest logoUrl={opponent?.logoUrl ?? opponent?.crestUrl} name={opponent?.name} size={22} />
                    <span className="team-form-chip__opp-name">{opponent?.shortName ?? 'OPP'}</span>
                  </div>
                  <span className="team-form-chip__badge">{outcome}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Next Match Card (45% width) */}
      <div className="next-match-card">
        <div className="next-match-card__header">
          <span className="next-match-card__title">NEXT MATCH</span>
          <span className="next-match-card__comp">{nextMatch?.league ?? team?.league ?? 'La Liga'}</span>
        </div>

        {nextMatch ? (
          <div className="next-match-card__body">
            <div className="next-match-card__teams">
              <div className="next-match-card__team">
                <Crest logoUrl={nextMatch.homeTeam?.logoUrl} name={nextMatch.homeTeam?.name} size={36} />
                <span className="next-match-card__team-name">{nextMatch.homeTeam?.name}</span>
              </div>

              <div className="next-match-card__vs-badge">
                <span>VS</span>
              </div>

              <div className="next-match-card__team">
                <Crest logoUrl={nextMatch.awayTeam?.logoUrl} name={nextMatch.awayTeam?.name} size={36} />
                <span className="next-match-card__team-name">{nextMatch.awayTeam?.name}</span>
              </div>
            </div>

            <div className="next-match-card__meta">
              <span className="next-match-card__venue">{nextMatch.venue ?? team?.stadium ?? 'Stadium'}</span>
              <span className="next-match-card__time">
                {nextMatch.status === 'live' ? (
                  <span className="next-match-card__live-pill">LIVE {nextMatch.minute}&rsquo;</span>
                ) : (
                  'Today · 21:00 UTC'
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="next-match-card__empty">No upcoming match scheduled</div>
        )}
      </div>
    </div>
  );
}
