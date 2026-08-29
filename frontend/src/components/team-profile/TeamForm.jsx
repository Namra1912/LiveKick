// src/components/team-profile/TeamForm.jsx
import { useMemo } from 'react';
import Crest from '../shared/Crest';
import { matches, leagues } from '../../data/mockData';
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

  // Derive league logo for next match
  const nextMatchLeagueLogo = useMemo(() => {
    const compName = nextMatch?.league ?? team?.league;
    if (!compName) return null;
    const found = leagues.find((l) => l.name.toLowerCase() === compName.toLowerCase());
    return found?.logoUrl ?? null;
  }, [nextMatch, team]);

  return (
    <div className="team-form-row">
      {/* Team Form Card */}
      <div className="team-form-card">
        <div className="team-form-card__header">
          <span className="team-form-card__title">RECENT FORM</span>
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

              let outcome = 'draw';
              if (teamScore > oppScore) {
                outcome = 'win';
              } else if (teamScore < oppScore) {
                outcome = 'loss';
              }

              return (
                <div key={m.id} className="team-form-chip">
                  <div className={`team-form-chip__score-box team-form-chip__score-box--${outcome}`}>
                    {m.homeScore}-{m.awayScore}
                  </div>
                  <div className="team-form-chip__opponent">
                    <Crest logoUrl={opponent?.logoUrl ?? opponent?.crestUrl} name={opponent?.name} size={24} />
                    <span className="team-form-chip__opp-name">{opponent?.shortName ?? 'OPP'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Next Match Card */}
      <div className="next-match-card">
        <div className="next-match-card__header">
          <span className="next-match-card__title">NEXT MATCH</span>
          <div className="next-match-card__comp-wrap">
            {nextMatchLeagueLogo && (
              <img
                src={nextMatchLeagueLogo}
                alt={nextMatch?.league ?? team?.league}
                className="next-match-card__league-logo"
              />
            )}
            <span className="next-match-card__comp">
              {nextMatch?.league ?? team?.league ?? 'La Liga'}
            </span>
          </div>
        </div>

        {nextMatch ? (
          <div className="next-match-card__body">
            <div className="next-match-card__teams">
              <div className="next-match-card__team">
                <Crest logoUrl={nextMatch.homeTeam?.logoUrl} name={nextMatch.homeTeam?.name} size={36} />
                <span className="next-match-card__team-name">{nextMatch.homeTeam?.name}</span>
              </div>

              <div className="next-match-card__time-display">
                {nextMatch.status === 'live' ? (
                  <span className="next-match-card__live-pill">LIVE {nextMatch.minute}&rsquo;</span>
                ) : (
                  '21:00'
                )}
              </div>

              <div className="next-match-card__team">
                <Crest logoUrl={nextMatch.awayTeam?.logoUrl} name={nextMatch.awayTeam?.name} size={36} />
                <span className="next-match-card__team-name">{nextMatch.awayTeam?.name}</span>
              </div>
            </div>

            <div className="next-match-card__meta">
              <span className="next-match-card__venue">{nextMatch.venue ?? team?.stadium ?? 'Stadium'}</span>
              <span className="next-match-card__time">
                <span className="next-match-card__today-dot" title="Match Today" />
                Today · 21:00 UTC
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

